import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type Area } from "react-easy-crop";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) {
    throw new Error('Invalid data URL');
  }
  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/**
 * Creates a cropped image from an image source and a crop area.
 * This is a hardened version to prevent crashes from float values.
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area
): Promise<string | null> {
  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }
  
  // The crop area from react-easy-crop is relative to the full-resolution image.
  // No rotation is handled here to keep things simple and robust.
  
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  
  // Draw the cropped area from the source image onto the canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0, // destination x
    0, // destination y
    pixelCrop.width, // destination width
    pixelCrop.height // destination height
  );
  
  // Return the cropped image as a base64 string
  return canvas.toDataURL('image/png');
}
