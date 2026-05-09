const QRStorage = (() => {
  const { storageKey, defaultPassword, defaults, previousDefaultCaption } = QR_SCREEN_CONFIG;

  function normalizeSettings(saved) {
    const savedCaption = saved && saved.caption;
    const caption = savedCaption === previousDefaultCaption ? defaults.caption : savedCaption;

    return {
      ...defaults,
      ...(saved || {}),
      caption: caption || defaults.caption,
      size: Number(saved && saved.size ? saved.size : defaults.size),
      password: saved && saved.password ? saved.password : defaultPassword
    };
  }

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      return normalizeSettings(saved);
    } catch {
      localStorage.removeItem(storageKey);
      return normalizeSettings(null);
    }
  }

  function save(settings) {
    localStorage.setItem(storageKey, JSON.stringify(normalizeSettings(settings)));
  }

  return {
    load,
    save
  };
})();
