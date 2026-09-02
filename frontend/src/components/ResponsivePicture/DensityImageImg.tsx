import type { ImgHTMLAttributes } from "react";
import {
  densitySrcSet,
  fallbackSrcSet,
  type DensityImage,
} from "../../images/assets";

type DensityImageImgProps = {
  image: DensityImage;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet">;

export function DensityImageImg({
  image,
  alt = "",
  loading = "lazy",
  decoding = "async",
  ...imgProps
}: DensityImageImgProps) {
  return (
    <picture>
      <source type="image/webp" srcSet={densitySrcSet(image)} />
      <img
        src={image.fallback}
        srcSet={fallbackSrcSet(image)}
        alt={alt}
        loading={loading}
        decoding={decoding}
        {...imgProps}
      />
    </picture>
  );
}
