export const FIREBASE_STORAGE_BUCKET = 'jaysmoneyguides.firebasestorage.app';
export const getFirebaseStorageUrl = (assetPath: string, bucket = FIREBASE_STORAGE_BUCKET): string => {
  if (!assetPath) return '';
  if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) return assetPath;
  // local public assets stay local
  if (assetPath.startsWith('/')) return assetPath;
  const clean = assetPath.replace(/^\/+/, '');
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(clean)}?alt=media`;
};
