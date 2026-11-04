export const PRESETS = [
  { id: 'ig-feed-portrait', platform: 'Instagram', label: 'Feed portrait', width: 1080, height: 1350, safe: { top: 5, right: 5, bottom: 5, left: 5 }, note: 'A versatile 4:5 feed format.' },
  { id: 'ig-square', platform: 'Instagram', label: 'Feed square', width: 1080, height: 1080, safe: { top: 6, right: 6, bottom: 6, left: 6 }, note: 'Square feed artwork.' },
  { id: 'ig-story', platform: 'Instagram', label: 'Story / Reel', width: 1080, height: 1920, safe: { top: 13, right: 7, bottom: 22, left: 7 }, note: 'Approximate UI-aware safe zone; keep key copy away from top and bottom controls.' },
  { id: 'linkedin-landscape', platform: 'LinkedIn', label: 'Landscape post', width: 1200, height: 627, safe: { top: 7, right: 6, bottom: 7, left: 6 }, note: 'Landscape image post.' },
  { id: 'linkedin-square', platform: 'LinkedIn', label: 'Square post', width: 1200, height: 1200, safe: { top: 6, right: 6, bottom: 6, left: 6 }, note: 'Square image post.' },
  { id: 'youtube-thumb', platform: 'YouTube', label: 'Video thumbnail', width: 1280, height: 720, safe: { top: 6, right: 6, bottom: 6, left: 6 }, note: 'Keep important text and faces comfortably inside edge margins.' },
  { id: 'youtube-banner', platform: 'YouTube', label: 'Channel banner', width: 2560, height: 1440, safe: { top: 35.3125, right: 19.8047, bottom: 35.3125, left: 19.8047 }, note: 'Centered device-safe area based on 1546 × 423 px. Preview guidance only; verify current platform requirements.' },
  { id: 'tiktok-cover', platform: 'TikTok', label: 'Video cover', width: 1080, height: 1920, safe: { top: 12, right: 8, bottom: 21, left: 8 }, note: 'Approximate interface-aware safe zone; placement varies by device and app UI.' },
  { id: 'x-landscape', platform: 'X', label: 'Landscape post', width: 1600, height: 900, safe: { top: 6, right: 6, bottom: 6, left: 6 }, note: 'Landscape post image.' },
  { id: 'x-header', platform: 'X', label: 'Profile header', width: 1500, height: 500, safe: { top: 12, right: 10, bottom: 12, left: 10 }, note: 'Keep important content away from the profile avatar overlap area.' }
];

export function getPreset(id) {
  return PRESETS.find((preset) => preset.id === id) ?? PRESETS[0];
}

export function getDrawRect(imageWidth, imageHeight, canvasWidth, canvasHeight, fit = 'cover', zoom = 1, offsetX = 0, offsetY = 0) {
  for (const value of [imageWidth, imageHeight, canvasWidth, canvasHeight, zoom]) {
    if (!Number.isFinite(value) || value <= 0) throw new RangeError('Image, canvas and zoom dimensions must be positive finite numbers.');
  }
  if (!['cover', 'contain'].includes(fit)) throw new TypeError('Fit must be cover or contain.');
  const base = fit === 'cover' ? Math.max(canvasWidth / imageWidth, canvasHeight / imageHeight) : Math.min(canvasWidth / imageWidth, canvasHeight / imageHeight);
  const width = imageWidth * base * zoom;
  const height = imageHeight * base * zoom;
  return {
    x: (canvasWidth - width) / 2 + (offsetX / 100) * canvasWidth,
    y: (canvasHeight - height) / 2 + (offsetY / 100) * canvasHeight,
    width,
    height
  };
}

export function safeRect(width, height, safe) {
  return {
    x: width * safe.left / 100,
    y: height * safe.top / 100,
    width: width * (100 - safe.left - safe.right) / 100,
    height: height * (100 - safe.top - safe.bottom) / 100
  };
}

export function formatDimensions(width, height) {
  return `${width.toLocaleString('en-US')} × ${height.toLocaleString('en-US')} px`;
}

export function safeExportName(platform, label) {
  return `${platform}-${label}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'framecheck-export';
}
