import logoMobilePng from "./logo-mobile.png";
import logoDesktopPng from "./logo-desktop.png";
import logoMobilePng2x from "./logo-mobile-2x.png";
import logoDesktopPng2x from "./logo-desktop-2x.png";
import logoMobileWebp from "./logo-mobile.webp";
import logoMobileWebp2x from "./logo-mobile-2x.webp";
import logoDesktopWebp from "./logo-desktop.webp";
import logoDesktopWebp2x from "./logo-desktop-2x.webp";

import pillMobilePng from "./mobile-white-round-pill.png";
import pillTabletPng from "./tablet-white-round-pill.png";
import pillDesktopPng from "./desktop-white-round-pill.png";
import pillMobilePng2x from "./mobile-white-round-pill-2x.png";
import pillTabletPng2x from "./tablet-white-round-pill-2x.png";
import pillDesktopPng2x from "./desktop-white-round-pill-2x.png";
import pillMobileWebp from "./mobile-white-round-pill.webp";
import pillMobileWebp2x from "./mobile-white-round-pill-2x.webp";
import pillTabletWebp from "./tablet-white-round-pill.webp";
import pillTabletWebp2x from "./tablet-white-round-pill-2x.webp";
import pillDesktopWebp from "./desktop-white-round-pill.webp";
import pillDesktopWebp2x from "./desktop-white-round-pill-2x.webp";

import createShopMobileJpg from "./create-shop-mobile.jpg";
import createShopTabletJpg from "./create-shop-tablet.jpg";
import createShopDesktopJpg from "./create-shop-desktop.jpg";
import createShopMobileJpg2x from "./create-shop-mobile-2x.jpg";
import createShopTabletJpg2x from "./create-shop-tablet-2x.jpg";
import createShopDesktopJpg2x from "./create-shop-desktop-2x.jpg";
import createShopMobileWebp from "./create-shop-mobile.webp";
import createShopMobileWebp2x from "./create-shop-mobile-2x.webp";
import createShopTabletWebp from "./create-shop-tablet.webp";
import createShopTabletWebp2x from "./create-shop-tablet-2x.webp";
import createShopDesktopWebp from "./create-shop-desktop.webp";
import createShopDesktopWebp2x from "./create-shop-desktop-2x.webp";

import medicinePlaceholderPng from "./medicine-placeholder.png";
import medicinePlaceholderPng2x from "./medicine-placeholder-2x.png";
import medicinePlaceholderWebp from "./medicine-placeholder.webp";
import medicinePlaceholderWebp2x from "./medicine-placeholder-2x.webp";

export type DensityImage = {
  webp1x: string;
  webp2x: string;
  fallback: string;
  fallback2x?: string;
};

export function densitySrcSet(image: DensityImage): string {
  return `${image.webp1x} 1x, ${image.webp2x} 2x`;
}

export function fallbackSrcSet(image: DensityImage): string | undefined {
  if (!image.fallback2x) {
    return undefined;
  }

  return `${image.fallback} 1x, ${image.fallback2x} 2x`;
}

export const logoMobile: DensityImage = {
  webp1x: logoMobileWebp,
  webp2x: logoMobileWebp2x,
  fallback: logoMobilePng,
  fallback2x: logoMobilePng2x,
};

export const logoDesktop: DensityImage = {
  webp1x: logoDesktopWebp,
  webp2x: logoDesktopWebp2x,
  fallback: logoDesktopPng,
  fallback2x: logoDesktopPng2x,
};

export const pillMobile: DensityImage = {
  webp1x: pillMobileWebp,
  webp2x: pillMobileWebp2x,
  fallback: pillMobilePng,
  fallback2x: pillMobilePng2x,
};

export const pillTablet: DensityImage = {
  webp1x: pillTabletWebp,
  webp2x: pillTabletWebp2x,
  fallback: pillTabletPng,
  fallback2x: pillTabletPng2x,
};

export const pillDesktop: DensityImage = {
  webp1x: pillDesktopWebp,
  webp2x: pillDesktopWebp2x,
  fallback: pillDesktopPng,
  fallback2x: pillDesktopPng2x,
};

export const createShopMobile: DensityImage = {
  webp1x: createShopMobileWebp,
  webp2x: createShopMobileWebp2x,
  fallback: createShopMobileJpg,
  fallback2x: createShopMobileJpg2x,
};

export const createShopTablet: DensityImage = {
  webp1x: createShopTabletWebp,
  webp2x: createShopTabletWebp2x,
  fallback: createShopTabletJpg,
  fallback2x: createShopTabletJpg2x,
};

export const createShopDesktop: DensityImage = {
  webp1x: createShopDesktopWebp,
  webp2x: createShopDesktopWebp2x,
  fallback: createShopDesktopJpg,
  fallback2x: createShopDesktopJpg2x,
};

export const medicinePlaceholder: DensityImage = {
  webp1x: medicinePlaceholderWebp,
  webp2x: medicinePlaceholderWebp2x,
  fallback: medicinePlaceholderPng,
  fallback2x: medicinePlaceholderPng2x,
};

export const defaultShopLogo: DensityImage = logoDesktop;

export { logoDesktopPng };
