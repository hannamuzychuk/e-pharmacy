import placeholderImage from "../images/create-shop-mobile.jpg";

const ALLOWED_IMAGE_HOSTS = new Set([
  "i.ibb.co",
  "ibb.co",
  "i.imgur.com",
  "imgur.com",
]);

export function getProductImageUrl(image?: string | null) {
  if (!image) {
    return placeholderImage;
  }

  if (image.startsWith("/") || image.startsWith("data:")) {
    return image;
  }

  try {
    const url = new URL(image);

    if (url.protocol === "https:" && ALLOWED_IMAGE_HOSTS.has(url.hostname)) {
      return `/api/image?url=${encodeURIComponent(image)}`;
    }
  } catch {
    return placeholderImage;
  }

  return image;
}
