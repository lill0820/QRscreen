import { qrScreenConfig } from "./qr-screen-config";

const hexColorPattern = /^#[0-9a-f]{6}$/i;

export function normalizeSettings(saved) {
  const savedCaption = saved?.caption;
  const caption =
    savedCaption === qrScreenConfig.previousDefaultCaption
      ? qrScreenConfig.defaults.caption
      : savedCaption;
  const templateIds = new Set(qrScreenConfig.backgroundTemplates.map((template) => template.id));
  const backgroundMode = saved?.backgroundMode === "template" ? "template" : qrScreenConfig.defaults.backgroundMode;
  const backgroundTemplate = templateIds.has(saved?.backgroundTemplate)
    ? saved.backgroundTemplate
    : qrScreenConfig.defaults.backgroundTemplate;
  const background = hexColorPattern.test(saved?.background || "")
    ? saved.background
    : qrScreenConfig.defaults.background;

  return {
    ...qrScreenConfig.defaults,
    ...(saved || {}),
    caption: caption || qrScreenConfig.defaults.caption,
    qrData: String(saved?.qrData || "").trim() || qrScreenConfig.defaults.qrData,
    size: Number(saved?.size || qrScreenConfig.defaults.size),
    backgroundMode,
    backgroundTemplate,
    background,
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
