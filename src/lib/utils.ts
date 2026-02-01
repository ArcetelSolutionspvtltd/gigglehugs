import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type Area } from 'react-easy-crop';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area
): Promise<string | null> {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });

  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL('image/png');
}
