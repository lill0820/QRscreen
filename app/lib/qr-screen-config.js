export const qrScreenConfig = {
  storageKey: "qr-screen-settings-v2",
  defaultPassword: "1234",
  previousDefaultCaption: "スマートフォンのカメラで読み取ってください",
  backgroundTemplates: [
    {
      id: "sunrise",
      name: "朝焼け",
      css: "linear-gradient(135deg, #fff5df 0%, #ffd6a5 44%, #f7a072 100%)"
    },
    {
      id: "peach",
      name: "ピーチ",
      css: "linear-gradient(145deg, #fff1eb 0%, #ffd7cf 45%, #f8b4a2 100%)"
    },
    {
      id: "honey",
      name: "ハニー",
      css: "linear-gradient(140deg, #fff8d9 0%, #f8d883 48%, #e9a85f 100%)"
    },
    {
      id: "rose",
      name: "ローズ",
      css: "linear-gradient(135deg, #fff0f3 0%, #f7c6d0 48%, #d996a7 100%)"
    },
    {
      id: "latte",
      name: "ラテ",
      css: "linear-gradient(140deg, #fff8ee 0%, #ead0b8 50%, #c99a7a 100%)"
    }
  ],
  defaults: {
    caption: "混雑状況などはこちらのQRコードを読み取ってご確認ください",
    size: 520,
    backgroundMode: "color",
    backgroundTemplate: "sunrise",
    background: "#f4f7f8",
    qrData: ""
  }
};
