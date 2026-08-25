const HttpError = require("../utils/HttpError");

const ALLOWED_HOSTS = new Set([
  "i.ibb.co",
  "ibb.co",
  "i.imgur.com",
  "imgur.com",
]);

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

async function proxyImage(req, res) {
  const rawUrl = req.query.url;

  if (!rawUrl || typeof rawUrl !== "string") {
    throw new HttpError(400, "Image url is required");
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(rawUrl);
  } catch (error) {
    throw new HttpError(400, "Invalid image url");
  }

  if (parsedUrl.protocol !== "https:" || !ALLOWED_HOSTS.has(parsedUrl.hostname)) {
    throw new HttpError(403, "Image host is not allowed");
  }

  const response = await fetch(parsedUrl.toString(), {
    headers: {
      "User-Agent": "e-pharmacy-image-proxy/1.0",
    },
  });

  if (!response.ok) {
    throw new HttpError(404, "Image not found");
  }

  const contentType = response.headers.get("content-type") || "image/jpeg";
  if (!contentType.startsWith("image/")) {
    throw new HttpError(415, "Unsupported image type");
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  if (buffer.length > MAX_IMAGE_SIZE) {
    throw new HttpError(413, "Image is too large");
  }

  res.setHeader("Content-Type", contentType);
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(buffer);
}

module.exports = { proxyImage };
