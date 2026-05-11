export default function QrPanel({ alt, classPrefix = "qr", qrData, style }) {
  return (
    <div className={`${classPrefix}-panel`} style={style}>
      {qrData ? (
        <img className={`${classPrefix}-image`} src={qrData} alt={alt} />
      ) : (
        <div className={`${classPrefix}-placeholder`}>QRコード未設定</div>
      )}
    </div>
  );
}
