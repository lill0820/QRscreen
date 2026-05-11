import QRCode from "react-qr-code";

export default function QrPanel({ alt, classPrefix = "qr", qrData, style }) {
  return (
    <div className={`${classPrefix}-panel`} style={style}>
      {qrData ? (
        <QRCode
          aria-label={alt}
          className={`${classPrefix}-code`}
          value={qrData}
          size={256}
          style={{ height: "100%", width: "100%" }}
        />
      ) : (
        <div className={`${classPrefix}-placeholder`}>QRコード未設定</div>
      )}
    </div>
  );
}
