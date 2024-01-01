const { S3Client, PutObjectCommand , GetObjectCommand, DeleteObjectCommand} = require('@aws-sdk/client-s3');
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner");
const multer = require('multer');
const dotenv = require('dotenv').config().parsed;
const crypto = require('crypto');

const s3Client = new S3Client({
	region: dotenv.BUCKET_REGION, // Replace with your AWS region
	credentials: {
		accessKeyId: dotenv.ACCESS_KEY, // Replace with your Access Key ID
		secretAccessKey: dotenv.SECRET_ACCESS_KEY, // Replace with your Secret Access Key
	},
});
const bucketName = dotenv.BUCKET_NAME;

let randomImageNamer = (bytes = 32) => crypto.randomBytes(16).toString('hex');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



// Handle the image upload - for single image only
module.exports.uploadImage = async (req, res, next) => {
	try {
		// Assuming 'upload' is properly configured with multer for handling file uploads
		upload.single('image')(req, res, async (err) => {
			if (err) {
				return res.status(500).send(false);
			}
			const params = {
				Bucket: bucketName,
				Key: randomImageNamer(), // Set a unique key for the file
				Body: req.file.buffer
			};

			const putObjectCommand = new PutObjectCommand(params);
			await s3Client.send(putObjectCommand);

			// Attach the Key to the req object
			req.objectKey = params.Key;

			next();
		});
	} catch (uploadErr) {
		return res.status(500).send(false);
	}
};


// Handle the image upload - for multiple image upload
module.exports.uploadMultipleImage = (req, res, next) => {
	
	try {
		
		upload.array('images')(req, res, async (err) => {
			if (err) {
				console.log('stopped here in middleware')
				return res.status(500).send({error : "server error"});
			}
			console.log(req.files)
			const uploadedImages = [];
			
			for (const file of req.files) {
				const params = {
					Bucket: bucketName,
					Key: randomImageNamer(), // Use the randomImageNamer() function for a unique key
					Body: file.buffer,
				};

				const putObjectCommand = new PutObjectCommand(params);
				await s3Client.send(putObjectCommand);

				uploadedImages.push({ key: params.Key });
			}

			// Attach the uploaded image keys to the req object
			req.uploadedImages = uploadedImages;
			console.log(`${uploadedImages}: uploadedImages`)
			next();
		});
		
		
	} catch (uploadErr) {
		return res.status(500).send({error : "server error"});
	}
};


module.exports.retrieveImageUrl = async (objectKey) => {

	const params = {
		Bucket: bucketName,
		Key: objectKey
	};

	try {
		const getObjectCommand = new GetObjectCommand(params);
		const signedUrl = await getSignedUrl(s3Client, getObjectCommand, { expiresIn: 3600 }); // Set expiration time in seconds

		return signedUrl;
	} catch (err) {
		return res.status(500).send(false);
	}
}

// Middleware for deleting a single image from the S3 bucket
module.exports.deleteImage = async (req, res, next) => {
    try {
        const { key } = req.body; // Assuming the image key is passed in the request body

        const params = {
            Bucket: bucketName,
            Key: key,
        };

        const deleteObjectCommand = new DeleteObjectCommand(params);
        await s3Client.send(deleteObjectCommand);
		
		req.deletedImageKey = {
			key: key
		};
        next();
    } catch (deleteErr) {
        return res.status(500).send({ error: deleteErr });
    }
};

// Middleware for deleting multiple images from the S3 bucket
module.exports.deleteMultipleImages = async (req, res, next) => {
    try {
        const { keys } = req.body; // Assuming the image keys are passed in the request body

        if (!keys || keys.length === 0) {
            return res.status(400).send({ error: 'No keys provided for deletion.' });
        }

        const deletedImages = [];

        for (const key of keys) {
            const params = {
                Bucket: bucketName,
                Key: key,
            };

            const deleteObjectCommand = new DeleteObjectCommand(params);
            await s3Client.send(deleteObjectCommand);

            deletedImages.push({ key });
        }

        // Attach the deleted image keys to the req object
        req.deletedImages = deletedImages;
		uploadMultipleImage();
        next();
    } catch (deleteErr) {
        return res.status(500).send({ error: "server error" });
    }
};
