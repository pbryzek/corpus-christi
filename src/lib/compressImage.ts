const MAX_DIMENSION = 1920;
const MAX_FILE_SIZE = 500 * 1024; // 500KB
const INITIAL_QUALITY = 0.85;

export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;

  let targetW = width;
  let targetH = height;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
    targetW = Math.round(width * ratio);
    targetH = Math.round(height * ratio);
  }

  const needsResize = targetW !== width || targetH !== height;
  const isLarge = file.size > MAX_FILE_SIZE;

  if (!needsResize && !isLarge) {
    bitmap.close();
    return file;
  }

  const canvas = new OffscreenCanvas(targetW, targetH);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0, targetW, targetH);
  bitmap.close();

  let quality = INITIAL_QUALITY;
  let blob = await canvas.convertToBlob({ type: 'image/jpeg', quality });

  while (blob.size > MAX_FILE_SIZE && quality > 0.4) {
    quality -= 0.1;
    blob = await canvas.convertToBlob({ type: 'image/jpeg', quality });
  }

  const name = file.name.replace(/\.[^.]+$/, '.jpg');
  return new File([blob], name, { type: 'image/jpeg' });
}
