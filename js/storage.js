const QRStorage = (() => {
  const { storageKey, defaultPassword, defaults } = QR_SCREEN_CONFIG;

  function normalizeSettings(saved) {
    return {
      ...defaults,
      ...(saved || {}),
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
