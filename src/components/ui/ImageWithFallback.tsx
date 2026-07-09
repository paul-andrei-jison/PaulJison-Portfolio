'use client';
import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/cn';

interface Props extends Omit<ImageProps, 'src' | 'placeholder'> {
  src?: string;
  placeholder?: string;
  fallbackClassName?: string;
}

export default function ImageWithFallback({
  src,
  placeholder = 'Image unavailable',
  fallbackClassName,
  alt,
  className,
  width,
  height,
  ...rest
}: Props) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 text-sm text-center',
          fallbackClassName,
          className,
        )}
        style={{
          width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
          height: height ? (typeof height === 'number' ? `${height}px` : height) : '100%',
        }}
        role="img"
        aria-label={alt ?? placeholder}
      >
        {placeholder}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setHasError(true)}
      {...rest}
    />
  );
}
