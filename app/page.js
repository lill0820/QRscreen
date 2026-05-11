"use client";

import { useEffect, useRef, useState } from "react";
import QrPanel from "./components/QrPanel";
import { qrScreenConfig } from "./lib/qr-screen-config";
import { loadSettings, normalizeSettings, saveSettings } from "./lib/qr-storage";

export default function Home() {
  const [settings, setSettings] = useState(() => normalizeSettings(null));
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordChange, setPasswordChange] = useState("");
  const passwordDialogRef = useRef(null);
  const passwordInputRef = useRef(null);

  useEffect(() => {
    setSettings(loadSettings());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--customer-bg", settings.background);
  }, [settings.background]);

  function persist(nextSettings) {
    const normalized = normalizeSettings(nextSettings);
    setSettings(normalized);
    saveSettings(normalized);
  }

  function updateSettings(nextSettings) {
    setSettings(normalizeSettings(nextSettings));
  }

  function openPasswordDialog() {
    setPassword("");
    setPasswordError("");

    const dialog = passwordDialogRef.current;
    if (dialog?.showModal) {
      dialog.showModal();
    } else {
      dialog?.setAttribute("open", "");
    }

    window.setTimeout(() => passwordInputRef.current?.focus(), 0);
  }

  function closePasswordDialog() {
    const dialog = passwordDialogRef.current;
    if (dialog?.open && dialog.close) {
      dialog.close();
    } else {
      dialog?.removeAttribute("open");
    }
  }

  async function openCustomerScreen() {
    setIsAdminOpen(false);

    if (document.documentElement.requestFullscreen) {
      try {
        await document.documentElement.requestFullscreen();
      } catch {
        // Fullscreen can be blocked by browser settings; the QR-only view still remains.
      }
    }
  }

  function openAdminScreen() {
    closePasswordDialog();
    setIsAdminOpen(true);
  }

  function handlePasswordSubmit(event) {
    event.preventDefault();

    if (password === settings.password) {
      openAdminScreen();
      return;
    }

    setPasswordError("パスワードが違います。");
    passwordInputRef.current?.select();
  }

  function handleQrFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      persist({
        ...settings,
        qrData: String(reader.result)
      });
    });
    reader.readAsDataURL(file);
  }

  function handleSave(event) {
    event.preventDefault();

    const nextSettings = {
      ...settings,
      caption: settings.caption.trim() || qrScreenConfig.defaults.caption,
      password: passwordChange.trim() || settings.password
    };

    persist(nextSettings);
    setPasswordChange("");
    openCustomerScreen();
  }

  const qrPanelStyle = { "--qr-size": `${settings.size}px` };

  return (
    <>
      <main className="customer-screen" aria-label="お客様向けQR表示" hidden={isAdminOpen}>
        <button className="admin-entry-button" type="button" onClick={openPasswordDialog}>
          管理
        </button>

        <section className="qr-display">
          <p className="customer-caption">{settings.caption}</p>
          <QrPanel alt="読み取り用QRコード" qrData={settings.qrData} style={qrPanelStyle} />
        </section>
      </main>

      <dialog className="password-dialog" aria-labelledby="passwordTitle" ref={passwordDialogRef}>
        <form className="password-box" method="dialog" onSubmit={handlePasswordSubmit}>
          <h1 id="passwordTitle">管理画面</h1>
          <p>運営用パスワードを入力してください。</p>
          <label htmlFor="passwordInput">パスワード</label>
          <input
            id="passwordInput"
            ref={passwordInputRef}
            type="password"
            autoComplete="current-password"
            inputMode="numeric"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <p className="error-message" aria-live="polite">
            {passwordError}
          </p>
          <div className="dialog-actions">
            <button className="button secondary" type="button" onClick={closePasswordDialog}>
              閉じる
            </button>
            <button className="button primary" type="submit">
              入る
            </button>
          </div>
        </form>
      </dialog>

      <section className="admin-screen" aria-label="運営管理画面" hidden={!isAdminOpen || !isLoaded}>
        <aside className="admin-sidebar">
          <div className="brand">
            <div className="brand-mark" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div>
              <h2>QR Screen</h2>
              <p>運営管理画面</p>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div className="field">
              <label htmlFor="qrFile">お客様に見せるQRコード画像</label>
              <input id="qrFile" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={handleQrFileChange} />
            </div>

            <div className="field">
              <label htmlFor="captionInput">QR上の案内文</label>
              <input
                id="captionInput"
                type="text"
                maxLength={60}
                value={settings.caption}
                onChange={(event) => updateSettings({ ...settings, caption: event.target.value })}
              />
            </div>

            <div className="field">
              <label htmlFor="sizeInput">QRコードの大きさ</label>
              <div className="range-row">
                <input
                  id="sizeInput"
                  type="range"
                  min="260"
                  max="720"
                  step="10"
                  value={settings.size}
                  onChange={(event) => updateSettings({ ...settings, size: Number(event.target.value) })}
                />
                <span>{settings.size}px</span>
              </div>
            </div>

            <div className="field">
              <label htmlFor="backgroundInput">背景色</label>
              <input
                id="backgroundInput"
                type="color"
                value={settings.background}
                onChange={(event) => updateSettings({ ...settings, background: event.target.value })}
              />
            </div>

            <div className="field">
              <label htmlFor="passwordChangeInput">管理パスワード変更</label>
              <input
                id="passwordChangeInput"
                type="password"
                autoComplete="new-password"
                placeholder="変更するときだけ入力"
                value={passwordChange}
                onChange={(event) => setPasswordChange(event.target.value)}
              />
            </div>

            <div className="actions">
              <button className="button primary" type="submit">
                保存して表示
              </button>
              <button className="button secondary" type="button" onClick={openCustomerScreen}>
                表示だけ戻る
              </button>
            </div>
          </form>

          <p className="admin-note">
            お客様画面から管理画面を開くには、左上の管理ボタンを押してパスワードを入力します。初期パスワードは <strong>1234</strong> です。
          </p>
        </aside>

        <section className="admin-preview" aria-label="プレビュー">
          <div className="preview-shell">
            <div className="preview-label">お客様に見える画面</div>
            <div className="preview-screen">
              <p className="preview-caption">{settings.caption}</p>
              <QrPanel alt="QRコードのプレビュー" classPrefix="preview-qr" qrData={settings.qrData} style={qrPanelStyle} />
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
