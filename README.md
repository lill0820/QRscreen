# QR Screen

お客様にはQRコードだけを見せ、運営はパスワードで管理画面に入る店頭表示用ページです。

## 使い方

1. `npm install`
2. `npm run dev`
3. ブラウザで `http://localhost:3000` を開く
4. 左上の `管理` ボタンを押す
5. 初期パスワード `1234` を入力する
6. QRコード画像、案内文、サイズ、背景色を設定する
7. `保存して表示` を押す

設定は同じブラウザの `localStorage` に保存されます。

## ファイル構成

- `app/page.js`: 画面操作と状態管理
- `app/components/QrPanel.js`: QR表示部品
- `app/lib/qr-screen-config.js`: 初期設定
- `app/lib/qr-storage.js`: 保存と読み込み
- `app/globals.css`: 見た目

## 注意

このパスワードは店頭での誤操作防止用です。サーバー認証ではないため、強いセキュリティが必要な用途には向きません。
