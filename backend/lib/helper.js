const { HeadObjectCommand } = require("@aws-sdk/client-s3");
const { s3 } = require("./s3Config");

// helper to check if key exists
const BUCKET = process.env.AWS_BUCKET_NAME;
const objectExists = async (key) => {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = { objectExists };
