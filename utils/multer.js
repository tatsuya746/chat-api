const multer = require("multer");
const path = require("path");

function generateId() {
  const min = 1000000000000; // smallest 19-digit number
  const max = 9999999999999; // largest 19-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  filename: (req, file, cb) => {
    cb(null, generateId() + '_' + file.originalname);
  },
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);  
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});