/**
 * 店舗向けHPテンプレート定義
 * 各テンプレートはカラーテーマ、レイアウト、デフォルトテキストを持つ
 */
const TEMPLATES = {
  cafe: {
    name: "カフェ・喫茶店",
    description: "温かみのある落ち着いたデザイン",
    icon: "☕",
    colors: {
      primary: "#6B4226",
      secondary: "#D4A574",
      accent: "#F5E6D3",
      background: "#FFF8F0",
      text: "#3E2723",
      headerBg: "#6B4226",
      headerText: "#FFFFFF",
    },
    font: "'Noto Serif JP', serif",
    defaults: {
      shopName: "カフェ サンプル",
      catchphrase: "こだわりの一杯で、やすらぎのひとときを",
      description: "自家焙煎のコーヒー豆を使用した、香り高い一杯をお届けします。落ち着いた店内で、ゆったりとした時間をお過ごしください。",
      menuItems: [
        { name: "ブレンドコーヒー", price: "450" },
        { name: "カフェラテ", price: "520" },
        { name: "自家製ケーキセット", price: "850" },
      ],
    },
  },
  restaurant: {
    name: "レストラン・食堂",
    description: "清潔感のあるモダンなデザイン",
    icon: "🍽️",
    colors: {
      primary: "#C62828",
      secondary: "#FF5252",
      accent: "#FFEBEE",
      background: "#FFFFFF",
      text: "#212121",
      headerBg: "#C62828",
      headerText: "#FFFFFF",
    },
    font: "'Noto Sans JP', sans-serif",
    defaults: {
      shopName: "レストラン サンプル",
      catchphrase: "地元の新鮮食材で作る、心のこもった料理",
      description: "地元で採れた新鮮な食材を使い、ひとつひとつ丁寧にお作りしています。ご家族やお友達との楽しいお食事の時間を、ぜひ当店でお過ごしください。",
      menuItems: [
        { name: "日替わりランチ", price: "900" },
        { name: "ハンバーグ定食", price: "1,100" },
        { name: "季節のパスタ", price: "1,200" },
      ],
    },
  },
  salon: {
    name: "美容室・サロン",
    description: "スタイリッシュで洗練されたデザイン",
    icon: "✂️",
    colors: {
      primary: "#4A148C",
      secondary: "#CE93D8",
      accent: "#F3E5F5",
      background: "#FAFAFA",
      text: "#212121",
      headerBg: "#4A148C",
      headerText: "#FFFFFF",
    },
    font: "'Noto Sans JP', sans-serif",
    defaults: {
      shopName: "ヘアサロン サンプル",
      catchphrase: "あなたの「なりたい」を叶えるサロン",
      description: "お客様一人ひとりの髪質やライフスタイルに合わせて、最適なスタイルをご提案いたします。リラックスできる空間で、美しい仕上がりをお届けします。",
      menuItems: [
        { name: "カット", price: "4,400" },
        { name: "カット + カラー", price: "8,800" },
        { name: "パーマ", price: "7,700" },
      ],
    },
  },
  shop: {
    name: "小売店・ショップ",
    description: "親しみやすいシンプルなデザイン",
    icon: "🏪",
    colors: {
      primary: "#1565C0",
      secondary: "#64B5F6",
      accent: "#E3F2FD",
      background: "#FFFFFF",
      text: "#212121",
      headerBg: "#1565C0",
      headerText: "#FFFFFF",
    },
    font: "'Noto Sans JP', sans-serif",
    defaults: {
      shopName: "ショップ サンプル",
      catchphrase: "暮らしを彩る、こだわりの品揃え",
      description: "お客様の暮らしを豊かにする商品を厳選して取り揃えています。スタッフが親切丁寧にご案内いたしますので、お気軽にお立ち寄りください。",
      menuItems: [
        { name: "おすすめ商品A", price: "1,500" },
        { name: "人気商品B", price: "2,800" },
        { name: "新着商品C", price: "3,200" },
      ],
    },
  },
};
