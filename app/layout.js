import "./globals.css";

export const metadata = {
  title: "QR Screen",
  description: "店頭表示用のQRコード画面"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
