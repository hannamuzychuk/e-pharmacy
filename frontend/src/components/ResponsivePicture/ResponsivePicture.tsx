import type { ImgHTMLAttributes } from "react";
import {
  densitySrcSet,
  fallbackSrcSet,
  type DensityImage,
} from "../../images/assets";

type Source = {
  image: DensityImage;
  media?: string;
};

type ResponsivePictureProps = {
  sources: Source[];
  imgClassName?: string;
  pictureClassName?: string;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "className">;

export function ResponsivePicture({
  sources,
  imgClassName,
  pictureClassName,
  alt = "",
  loading = "lazy",
  decoding = "async",
  ...imgProps
}: ResponsivePictureProps) {
  const fallback = sources[sources.length - 1]?.image;

  if (!fallback) {
    return null;
  }

  return (
    <picture className={pictureClassName}>
      {sources.map(({ image, media }) => (
        <source
          key={`${media ?? "default"}-${image.webp1x}`}
          type="image/webp"
          media={media}
          srcSet={densitySrcSet(image)}
        />
      ))}
      <img
        className={imgClassName}
        src={fallback.fallback}
        srcSet={fallbackSrcSet(fallback)}
        alt={alt}
        loading={loading}
        decoding={decoding}
        {...imgProps}
      />
    </picture>
  );
}
