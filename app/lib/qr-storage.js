import { qrScreenConfig } from "./qr-screen-config";

export function normalizeSettings(saved) {
  const savedCaption = saved?.caption;
  const caption =
    savedCaption === qrScreenConfig.previousDefaultCaption
      ? qrScreenConfig.defaults.caption
      : savedCaption;

  return {
    ...qrScreenConfig.defaults,
    ...(saved || {}),
    caption: caption || qrScreenConfig.defaults.caption,
    size: Number(saved?.size || qrScreenConfig.defaults.size),
    password: saved?.password || qrScreenConfig.defaultPassword
  };
}

export function loadSettings() {
  if (typeof window === "undefined") {
    return normalizeSettings(null);
  }

  try {
    const saved = JSON.parse(window.localStorage.getItem(qrScreenConfig.storageKey));
    return normalizeSettings(saved);
  } catch {
    window.localStorage.removeItem(qrScreenConfig.storageKey);
    return normalizeSettings(null);
  }
}

export function saveSettings(settings) {
  window.localStorage.setItem(qrScreenConfig.storageKey, JSON.stringify(normalizeSettings(settings)));
}
