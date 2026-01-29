const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3 } = require("../lib/s3Config");
const { objectExists } = require("../lib/helper");
const Upload = require("../models/Upload");

const BUCKET = process.env.AWS_BUCKET_NAME;

const uploadImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const baseKey = `images/${file.originalname}`;
    let finalKey = baseKey;

    if (await objectExists(baseKey)) {
      const timestamp = Date.now();
      const ext = file.originalname.split(".").pop();
      const nameWithoutExt = file.originalname.substring(0, file.originalname.lastIndexOf('.'));
      finalKey = `images/${nameWithoutExt}_${timestamp}.${ext}`;
    }

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: finalKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const imageUrl = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${finalKey}`;

    // � Save upload record to database
    const uploadRecord = await Upload.create({
      userId: req.user._id,
      fileName: file.originalname,
      fileKey: finalKey,
      fileUrl: imageUrl,
      fileSize: file.size,
      mimeType: file.mimetype
    });

    // 🔍 log stored image info
    console.log({
      originalName: file.originalname,
      storedKey: finalKey,
      size: file.size,
      mimeType: file.mimetype,
      url: imageUrl,
    });

    res.json({
      message: "Upload successful",
      key: finalKey,
      url: imageUrl,
      upload: uploadRecord
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
};

const getUploadHistory = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const uploads = await Upload.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('fileName fileUrl fileSize mimeType createdAt');

    res.json({
      success: true,
      uploads
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch upload history" });
  }
};

module.exports = { uploadImage, getUploadHistory };
