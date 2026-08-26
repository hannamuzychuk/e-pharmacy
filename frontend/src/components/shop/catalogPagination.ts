import { useEffect, useState } from "react";

const MOBILE_PAGE_SIZE = 6;
const DESKTOP_PAGE_SIZE = 8;
const DESKTOP_MEDIA_QUERY = "(min-width: 1440px)";

export function useCatalogPageSize() {
  const [pageSize, setPageSize] = useState(() => {
    if (typeof window === "undefined") {
      return MOBILE_PAGE_SIZE;
    }

    return window.matchMedia(DESKTOP_MEDIA_QUERY).matches
      ? DESKTOP_PAGE_SIZE
      : MOBILE_PAGE_SIZE;
  });

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const updatePageSize = () => {
      setPageSize(media.matches ? DESKTOP_PAGE_SIZE : MOBILE_PAGE_SIZE);
    };

    updatePageSize();
    media.addEventListener("change", updatePageSize);

    return () => media.removeEventListener("change", updatePageSize);
  }, []);

  return pageSize;
}

export function getPageItems(
  current: number,
  total: number,
): Array<number | "ellipsis"> {
  if (total <= 4) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  if (current <= 2) {
    return [1, 2, 3, "ellipsis"];
  }

  if (current >= total - 1) {
    return ["ellipsis", total - 2, total - 1, total];
  }

  return ["ellipsis", current - 1, current, current + 1, "ellipsis"];
}
