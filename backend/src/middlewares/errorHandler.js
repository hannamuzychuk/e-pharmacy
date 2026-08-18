function errorHandler(err, req, res, next) {
  if (err.name === "MulterError") {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Image must be under 5MB"
        : err.message;
    return res.status(400).json({ message });
  }

  const isMongoDuplicate = err.code === 11000;

  if (isMongoDuplicate) {
    if (err.keyValue && err.keyValue.email) {
      return res.status(409).json({ message: "Email already exists" });
    }

    if (err.keyValue && err.keyValue.phone) {
      return res.status(409).json({ message: "Phone already exists" });
    }

    if (err.keyValue && err.keyValue.ownerId) {
      return res.status(409).json({ message: "Shop already exists" });
    }

    return res.status(409).json({ message: "This value already exists" });
  }

  const status = err.status || 500;
  const message =
    status === 500 ? "Internal Server Error" : err.message || "Request failed";

  res.status(status).json({ message });
}

module.exports = errorHandler;
