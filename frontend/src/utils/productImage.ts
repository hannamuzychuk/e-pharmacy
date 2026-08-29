import { createShopMobile } from "../images/assets";
import { resolveApiUrl } from "./apiBase";

const placeholderImage = createShopMobile.webp1x;

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

  if (image.startsWith("data:")) {
    return image;
  }

  if (image.startsWith("/")) {
    return resolveApiUrl(image);
  }

  try {
    const url = new URL(image);

    if (url.protocol === "https:" && ALLOWED_IMAGE_HOSTS.has(url.hostname)) {
      return resolveApiUrl(`/api/image?url=${encodeURIComponent(image)}`);
    }
  } catch {
    return placeholderImage;
  }

  return image;
}
