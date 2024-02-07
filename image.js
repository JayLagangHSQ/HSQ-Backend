const { S3Client, PutObjectCommand , GetObjectCommand, DeleteObjectCommand} = require('@aws-sdk/client-s3');
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner");
const multer = require('multer');
const dotenv = require('dotenv').config().parsed;
const crypto = require('crypto');
const sharp = require('sharp');
const User = require('./models/User')

const s3Client = new S3Client({
	region: dotenv.BUCKET_REGION, // Replace with your AWS region
	credentials: {
		accessKeyId: dotenv.ACCESS_KEY, // Replace with your Access Key ID
		secretAccessKey: dotenv.SECRET_ACCESS_KEY, // Replace with your Secret Access Key
	},
});
const bucketName = dotenv.BUCKET_NAME;
const employeePictureBucket = dotenv.EMPLOYEE_PICTURE_BUCKET;
let randomImageNamer = (bytes = 32) => crypto.randomBytes(16).toString('hex');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// HERE I JUST REALIZED THAT I'M NOT FOLLOWING THE DRY PRINCIPLE
// Function to compress the image with dynamic quality adjustment
const compressImage = async (imageBuffer, targetSize) => {
    let quality = 100; // Starting quality
    let compressedImageBuffer = imageBuffer;
    let currentSize = compressedImageBuffer.length;

    // While the current size is larger than the target size, reduce the quality and compress again
    while (currentSize > targetSize && quality > 0) {
        // Adjust quality
        quality -= 5; // You can adjust the step size as needed

        // Compress the image with the adjusted quality
        compressedImageBuffer = await sharp(imageBuffer)
            .jpeg({ quality })
            .toBuffer();

        // Update the current size
        currentSize = compressedImageBuffer.length;
    }

    return compressedImageBuffer;
};

module.exports.uploadProfileImage = async (req, res, next) => {
    try {
        // Assuming 'upload' is properly configured with multer for handling file uploads
        upload.single('image')(req, res, async (err) => {
            const { key } = req.body; // Assuming the image key is passed in the request body
            req.key = key;
            if (err) {
                return res.status(500).send(false);
            }
            const params = {
                Bucket: employeePictureBucket,
                Key: randomImageNamer(), // Set a unique key for the file
                Body: req.file.buffer
            };

            // Compress the image using dynamic quality adjustment
            const compressedImageBuffer = await compressImage(req.file.buffer, 500 * 1024); // 500kb in bytes

            params.Body = compressedImageBuffer; // Replace original buffer with compressed image buffer

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
module.exports.deleteProfileImage = async (req, res, next) => {

	const user = await User.findById(req.user.id)
    try {

        const key  = user.profilePictureKey.key; // Assuming the image key is passed in the request body
		if(key == null || key == undefined || key == ''){
			return next();
		}
        const params = {
            Bucket: employeePictureBucket,
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
module.exports.retrieveProfileImageUrl = async (objectKey) => {

	const params = {
		Bucket: employeePictureBucket,
		Key: objectKey
	};

	try {
		const getObjectCommand = new GetObjectCommand(params);
		const signedUrl = await getSignedUrl(s3Client, getObjectCommand, { expiresIn: 3600 }); // Set expiration time in seconds

		return signedUrl;
	} catch (err) {
		return false
	}
}


// Handle the image upload - for multiple image upload
module.exports.uploadMultipleImage = (customParameter) => (req, res, next) => {
	let actualBucketName;

	!customParameter ? actualBucketName=bucketName : actualBucketName = customParameter;
	
	try {
		
		upload.array('images')(req, res, async (err) => {
			if (err) {
				return res.status(500).send({error : "server error"});
			}

			const uploadedImages = [];
			
			for (const file of req.files) {
				const params = {
					Bucket: actualBucketName,
					Key: randomImageNamer(), // Use the randomImageNamer() function for a unique key
					Body: file.buffer,
				};

				const putObjectCommand = new PutObjectCommand(params);
				await s3Client.send(putObjectCommand);

				uploadedImages.push({ key: params.Key });
			}

			// Attach the uploaded image keys to the req object
			req.uploadedImages = uploadedImages;

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
		
		return false
	}
}

module.exports.retrieveImageUrlUniversal = async (bucket,objectKey) => {

	const params = {
		Bucket: bucket,
		Key: objectKey
	};

	try {
		const getObjectCommand = new GetObjectCommand(params);
		const signedUrl = await getSignedUrl(s3Client, getObjectCommand, { expiresIn: 3600 }); // Set expiration time in seconds

		return signedUrl;
	} catch (err) {
		
		return false
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
