
module.exports.bucketIdentifier = (req, res,bucketName, next) => {
    req.bucket = bucketName;
    next()
}