const { PutObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { s3 } = require("../lib/s3Config");
const { objectExists } = require("../lib/helper");
const Upload = require("../models/Upload");

const uploadImage = async (req, res) => {
  try {
    const file = req.file;
    let { bucket, directory } = req.body;

    bucket = bucket.trim();
    directory = directory.trim();

    console.log("Upload request received:", {
      bucket,
      directory,
      file
    });

    // Read allowed buckets from environment variable
    const ALLOWED_BUCKETS = process.env.ALLOWED_BUCKETS.split(',').map(b => b.trim());

    if (!bucket || !ALLOWED_BUCKETS.includes(bucket)) {
      return res.status(400).json({ message: "Invalid bucket selection" });
    }
    if (!directory) {
      return res.status(400).json({ message: "Directory name is required" });
    }
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const BUCKET = bucket;
    const baseKey = `${directory}/${file.originalname}`;
    let finalKey = baseKey;

    // Check if object with same key exists
    const exists = await objectExists(finalKey, BUCKET);
    if (exists) {
      const timestamp = Date.now();
      const ext = file.originalname.split(".").pop();
      const nameWithoutExt = file.originalname.substring(0, file.originalname.lastIndexOf('.'));
      finalKey = `${directory}/${nameWithoutExt}_${timestamp}.${ext}`;
    }

    // Upload to S3
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: finalKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    // final image URL
    const imageUrl = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${finalKey}`;

    // � Save upload record to database
    await Upload.create({
      fileName: file.originalname,
      fileUrl: imageUrl,
      fileSize: file.size,
      bucket: bucket,
      directory: directory,
    });

    // 🔍 log stored image info
    console.log({
      bucket: bucket,
      directory: directory,
      originalName: file.originalname,
      storedKey: finalKey,
      size: file.size,
      mimeType: file.mimetype,
      url: imageUrl,
    });

    // Respond with success and image URL
    res.status(200).json({
      message: "Image Uploaded successfully",
      url: imageUrl,
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

    res.status(200).json({
      success: true,
      uploads
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch upload history" });
  }
};

const getDirectories = async (req, res) => {
  try {
    const { bucket } = req.query;

    // Read allowed buckets from environment variable
    const ALLOWED_BUCKETS = process.env.ALLOWED_BUCKETS.split(',').map(b => b.trim());

    if (!bucket || !ALLOWED_BUCKETS.includes(bucket)) {
      return res.status(400).json({ message: "Invalid bucket selection" });
    }

    // List objects with delimiter to get prefixes (directories)
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Delimiter: '/',
    });

    const response = await s3.send(command);
    
    // Extract directory names from CommonPrefixes
    const directories = (response.CommonPrefixes || []).map(prefix => {
      // Remove trailing slash
      return prefix.Prefix.slice(0, -1);
    });

    res.status(200).json({
      success: true,
      directories
    });
  } catch (err) {
    console.error('Error fetching directories:', err);
    res.status(500).json({ message: "Failed to fetch directories" });
  }
};

module.exports = { uploadImage, getUploadHistory, getDirectories };
