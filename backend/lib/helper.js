const { HeadObjectCommand } = require("@aws-sdk/client-s3");
const { s3 } = require("./s3Config");

// helper to check if key exists
const objectExists = async (key, bucket) => {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = { objectExists };
