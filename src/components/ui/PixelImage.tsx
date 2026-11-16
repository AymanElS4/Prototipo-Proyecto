import React from 'react';

interface PixelImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const PixelImage: React.FC<PixelImageProps> = ({
  src,
  alt = '',
  width = 32,
  height = 32,
  className = '',
  style = {},
  ...props
}) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{
        imageRendering: 'pixelated',
        display: 'inline-block',
        objectFit: 'contain',
        ...style
      }}
      {...props}
    />
  );
};
