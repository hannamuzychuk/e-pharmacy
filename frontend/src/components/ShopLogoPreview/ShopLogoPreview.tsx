import { DensityImageImg } from "../ResponsivePicture/DensityImageImg";
import { defaultShopLogo } from "../../images/assets";

type ShopLogoPreviewProps = {
  previewUrl: string | null;
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
};

export function ShopLogoPreview({
  previewUrl,
  className,
  alt = "Shop logo preview",
  width = 44,
  height = 44,
}: ShopLogoPreviewProps) {
  if (!previewUrl) {
    return (
      <DensityImageImg
        image={defaultShopLogo}
        className={className}
        alt={alt}
        width={width}
        height={height}
        loading="eager"
        decoding="async"
      />
    );
  }

  return (
    <img
      className={className}
      src={previewUrl}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
    />
  );
}
