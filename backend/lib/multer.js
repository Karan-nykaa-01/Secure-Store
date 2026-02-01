const multer = require("multer");
const path = require("path");

// Multer config (advanced)
// const upload = multer({
//     storage: multer.memoryStorage(),
//     fileFilter: (req, file, cb) => {
//       let ext = path.extname(file.originalname);
//       if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".webp") {
//         cb(new Error("File type is not supported"), false);
//         return;
//       }
//       cb(null, true);
//     },
// });

const upload = multer({
  storage: multer.memoryStorage(),
  // limits: { fileSize: 10 * 1024 * 1024 }, // restrict file size
});

module.exports = { upload };
