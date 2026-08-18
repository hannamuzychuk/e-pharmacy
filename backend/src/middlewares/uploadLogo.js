const path = require("path");
const fs = require("fs");
const multer = require("multer");
const HttpError = require("../utils/HttpError");

const uploadDir = path.join(__dirname, "../../uploads/logos");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  if (!file.mimetype.startsWith("image/")) {
    cb(new HttpError(400, "Please upload an image file"));
    return;
  }

  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

function uploadLogo(req, res, next) {
  upload.single("logo")(req, res, (error) => {
    if (error) {
      next(error);
      return;
    }

    next();
  });
}

module.exports = uploadLogo;
