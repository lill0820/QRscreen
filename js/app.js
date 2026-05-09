const state = QRStorage.load();

const elements = {
  customerScreen: document.getElementById("customerScreen"),
  adminScreen: document.getElementById("adminScreen"),
  adminEntryButton: document.getElementById("adminEntryButton"),
  passwordDialog: document.getElementById("passwordDialog"),
  passwordForm: document.getElementById("passwordForm"),
  passwordInput: document.getElementById("passwordInput"),
  passwordError: document.getElementById("passwordError"),
  cancelPasswordButton: document.getElementById("cancelPasswordButton"),
  settingsForm: document.getElementById("settingsForm"),
  qrFile: document.getElementById("qrFile"),
  captionInput: document.getElementById("captionInput"),
  sizeInput: document.getElementById("sizeInput"),
  sizeValue: document.getElementById("sizeValue"),
  backgroundInput: document.getElementById("backgroundInput"),
  passwordChangeInput: document.getElementById("passwordChangeInput"),
  previewButton: document.getElementById("previewButton"),
  qrPanel: document.getElementById("qrPanel"),
  qrImage: document.getElementById("qrImage"),
  qrPlaceholder: document.getElementById("qrPlaceholder"),
  customerCaption: document.getElementById("customerCaption"),
  previewQrPanel: document.getElementById("previewQrPanel"),
  previewQrImage: document.getElementById("previewQrImage"),
  previewPlaceholder: document.getElementById("previewPlaceholder"),
  previewCaption: document.getElementById("previewCaption")
};

function applyQrImage(imageElement, placeholderElement) {
  if (state.qrData) {
    imageElement.src = state.qrData;
    imageElement.hidden = false;
    placeholderElement.hidden = true;
    return;
  }

  imageElement.removeAttribute("src");
  imageElement.hidden = true;
  placeholderElement.hidden = false;
}

function renderCustomerScreen() {
  document.documentElement.style.setProperty("--customer-bg", state.background);
  elements.qrPanel.style.setProperty("--qr-size", `${state.size}px`);
  elements.customerCaption.textContent = state.caption;
  applyQrImage(elements.qrImage, elements.qrPlaceholder);
}

function renderAdminScreen() {
  elements.captionInput.value = state.caption;
  elements.sizeInput.value = state.size;
  elements.sizeValue.textContent = `${state.size}px`;
  elements.backgroundInput.value = state.background;
  elements.passwordChangeInput.value = "";

  elements.previewQrPanel.style.setProperty("--qr-size", `${state.size}px`);
  elements.previewCaption.textContent = state.caption;
  applyQrImage(elements.previewQrImage, elements.previewPlaceholder);
}

function render() {
  renderCustomerScreen();
  renderAdminScreen();
}

function saveAndRender() {
  QRStorage.save(state);
  render();
}

function openPasswordDialog() {
  elements.passwordInput.value = "";
  elements.passwordError.textContent = "";

  if (elements.passwordDialog.showModal) {
    elements.passwordDialog.showModal();
  } else {
    elements.passwordDialog.setAttribute("open", "");
  }

  elements.passwordInput.focus();
}

function closePasswordDialog() {
  if (elements.passwordDialog.open && elements.passwordDialog.close) {
    elements.passwordDialog.close();
  } else {
    elements.passwordDialog.removeAttribute("open");
  }
}

function openAdminScreen() {
  closePasswordDialog();
  elements.customerScreen.hidden = true;
  elements.adminScreen.hidden = false;
  renderAdminScreen();
}

async function openCustomerScreen() {
  elements.adminScreen.hidden = true;
  elements.customerScreen.hidden = false;
  renderCustomerScreen();

  if (document.documentElement.requestFullscreen) {
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      // Fullscreen can be blocked by browser settings; the QR-only view still remains.
    }
  }
}

function updateStateFromForm() {
  state.caption = elements.captionInput.value.trim() || QR_SCREEN_CONFIG.defaults.caption;
  state.size = Number(elements.sizeInput.value);
  state.background = elements.backgroundInput.value;

  const nextPassword = elements.passwordChangeInput.value.trim();
  if (nextPassword) {
    state.password = nextPassword;
  }
}

elements.adminEntryButton.addEventListener("click", openPasswordDialog);

elements.passwordForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (elements.passwordInput.value === state.password) {
    openAdminScreen();
    return;
  }

  elements.passwordError.textContent = "パスワードが違います。";
  elements.passwordInput.select();
});

elements.cancelPasswordButton.addEventListener("click", closePasswordDialog);

elements.qrFile.addEventListener("change", () => {
  const file = elements.qrFile.files && elements.qrFile.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    state.qrData = String(reader.result);
    saveAndRender();
  });
  reader.readAsDataURL(file);
});

elements.captionInput.addEventListener("input", () => {
  state.caption = elements.captionInput.value;
  renderAdminScreen();
});

elements.sizeInput.addEventListener("input", () => {
  state.size = Number(elements.sizeInput.value);
  renderAdminScreen();
});

elements.backgroundInput.addEventListener("input", () => {
  state.background = elements.backgroundInput.value;
  render();
});

elements.settingsForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  updateStateFromForm();
  saveAndRender();
  await openCustomerScreen();
});

elements.previewButton.addEventListener("click", openCustomerScreen);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && elements.adminScreen.hidden) {
    closePasswordDialog();
  }
});

render();
