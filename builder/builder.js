/**
 * 店舗HP ビルダー - コアロジック
 */

let currentTemplate = "cafe";
let menuItemCount = 3;
let headerImageData = null;
let shopImageData = null;

/** 初期化 */
function init() {
  renderTemplateSelector();
  loadTemplateDefaults("cafe");
  attachEventListeners();
  updatePreview();
}

/** テンプレート選択UIを生成 */
function renderTemplateSelector() {
  const container = document.getElementById("template-selector");
  container.innerHTML = "";
  for (const [key, tmpl] of Object.entries(TEMPLATES)) {
    const card = document.createElement("div");
    card.className = "template-card" + (key === currentTemplate ? " selected" : "");
    card.dataset.template = key;
    card.innerHTML = `
      <span class="template-icon">${tmpl.icon}</span>
      <strong>${tmpl.name}</strong>
      <small>${tmpl.description}</small>
    `;
    card.addEventListener("click", () => selectTemplate(key));
    container.appendChild(card);
  }
}

/** テンプレート選択 */
function selectTemplate(key) {
  currentTemplate = key;
  document.querySelectorAll(".template-card").forEach((c) => c.classList.remove("selected"));
  document.querySelector(`.template-card[data-template="${key}"]`).classList.add("selected");
  loadTemplateDefaults(key);
  updatePreview();
}

/** テンプレートのデフォルト値をフォームに読み込み */
function loadTemplateDefaults(key) {
  const d = TEMPLATES[key].defaults;
  const c = TEMPLATES[key].colors;
  document.getElementById("shop-name").value = d.shopName;
  document.getElementById("catchphrase").value = d.catchphrase;
  document.getElementById("shop-description").value = d.description;
  document.getElementById("address").value = "東京都渋谷区○○1-2-3";
  document.getElementById("phone").value = "03-1234-5678";
  document.getElementById("hours").value = "10:00〜20:00";
  document.getElementById("closed").value = "毎週水曜日";

  // SNSフィールドをクリア
  document.getElementById("sns-instagram").value = "";
  document.getElementById("sns-x").value = "";
  document.getElementById("sns-line").value = "";
  document.getElementById("sns-facebook").value = "";

  // カラーピッカーにテンプレートの色をセット
  document.getElementById("color-primary").value = c.primary;
  document.getElementById("color-secondary").value = c.secondary;
  document.getElementById("color-accent").value = c.accent;
  document.getElementById("color-background").value = c.background;

  const menuContainer = document.getElementById("menu-items");
  menuContainer.innerHTML = "";
  menuItemCount = 0;
  d.menuItems.forEach((item) => addMenuItem(item.name, item.price));
}

/** カラーピッカーから現在の色を取得 */
function getCustomColors() {
  return {
    primary: document.getElementById("color-primary").value,
    secondary: document.getElementById("color-secondary").value,
    accent: document.getElementById("color-accent").value,
    background: document.getElementById("color-background").value,
  };
}

/** テンプレートの色にリセット */
function resetColors() {
  const c = TEMPLATES[currentTemplate].colors;
  document.getElementById("color-primary").value = c.primary;
  document.getElementById("color-secondary").value = c.secondary;
  document.getElementById("color-accent").value = c.accent;
  document.getElementById("color-background").value = c.background;
  updatePreview();
}

/** イベントリスナー登録 */
function attachEventListeners() {
  // テキストフィールド
  const fields = ["shop-name", "catchphrase", "shop-description", "address", "phone", "hours", "closed"];
  fields.forEach((id) => {
    document.getElementById(id).addEventListener("input", updatePreview);
  });

  // SNSフィールド
  const snsFields = ["sns-instagram", "sns-x", "sns-line", "sns-facebook"];
  snsFields.forEach((id) => {
    document.getElementById(id).addEventListener("input", updatePreview);
  });

  // カラーピッカー
  const colorFields = ["color-primary", "color-secondary", "color-accent", "color-background"];
  colorFields.forEach((id) => {
    document.getElementById(id).addEventListener("input", updatePreview);
  });
  document.getElementById("reset-colors-btn").addEventListener("click", resetColors);

  // Google Map チェックボックス
  document.getElementById("show-map").addEventListener("change", updatePreview);

  // メニュー追加
  document.getElementById("add-menu-btn").addEventListener("click", () => {
    addMenuItem("", "");
    updatePreview();
  });

  // ダウンロード
  document.getElementById("download-btn").addEventListener("click", downloadHTML);

  // プレビューサイズ
  document.getElementById("preview-mobile-btn").addEventListener("click", () => setPreviewSize("mobile"));
  document.getElementById("preview-tablet-btn").addEventListener("click", () => setPreviewSize("tablet"));
  document.getElementById("preview-pc-btn").addEventListener("click", () => setPreviewSize("pc"));

  // 画像アップロード
  setupImageUpload("header");
  setupImageUpload("shop");
}

/** 画像アップロードのセットアップ */
function setupImageUpload(type) {
  const area = document.getElementById(type + "-image-area");
  const input = document.getElementById(type + "-image-input");
  const preview = document.getElementById(type + "-image-preview");
  const placeholder = document.getElementById(type + "-image-placeholder");
  const removeBtn = document.getElementById(type + "-image-remove");

  area.addEventListener("click", (e) => {
    if (e.target !== removeBtn) input.click();
  });

  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      if (type === "header") headerImageData = dataUrl;
      else shopImageData = dataUrl;
      preview.src = dataUrl;
      preview.hidden = false;
      removeBtn.hidden = false;
      placeholder.hidden = true;
      updatePreview();
    };
    reader.readAsDataURL(file);
  });

  removeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (type === "header") headerImageData = null;
    else shopImageData = null;
    preview.src = "";
    preview.hidden = true;
    removeBtn.hidden = true;
    placeholder.hidden = false;
    input.value = "";
    updatePreview();
  });
}

/** メニュー項目を追加 */
function addMenuItem(name, price) {
  menuItemCount++;
  const container = document.getElementById("menu-items");
  const row = document.createElement("div");
  row.className = "menu-item-row";
  row.innerHTML = `
    <input type="text" class="menu-name" placeholder="メニュー名" value="${escapeHTML(name)}">
    <input type="text" class="menu-price" placeholder="価格" value="${escapeHTML(price)}">
    <button type="button" class="remove-menu-btn" title="削除">×</button>
  `;
  row.querySelector(".remove-menu-btn").addEventListener("click", () => {
    row.remove();
    updatePreview();
  });
  row.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", updatePreview);
  });
  container.appendChild(row);
}

/** フォームからデータを取得 */
function getFormData() {
  const menuItems = [];
  document.querySelectorAll(".menu-item-row").forEach((row) => {
    const name = row.querySelector(".menu-name").value.trim();
    const price = row.querySelector(".menu-price").value.trim();
    if (name) menuItems.push({ name, price });
  });
  return {
    shopName: document.getElementById("shop-name").value.trim(),
    catchphrase: document.getElementById("catchphrase").value.trim(),
    description: document.getElementById("shop-description").value.trim(),
    address: document.getElementById("address").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    hours: document.getElementById("hours").value.trim(),
    closed: document.getElementById("closed").value.trim(),
    showMap: document.getElementById("show-map").checked,
    snsInstagram: document.getElementById("sns-instagram").value.trim(),
    snsX: document.getElementById("sns-x").value.trim(),
    snsLine: document.getElementById("sns-line").value.trim(),
    snsFacebook: document.getElementById("sns-facebook").value.trim(),
    headerImage: headerImageData,
    shopImage: shopImageData,
    menuItems,
  };
}

/** プレビューサイズ切り替え */
function setPreviewSize(size) {
  const frame = document.getElementById("preview-frame");
  document.querySelectorAll(".preview-size-btn").forEach((b) => b.classList.remove("active"));
  document.getElementById(`preview-${size}-btn`).classList.add("active");
  frame.className = "preview-frame preview-" + size;
}

/** プレビュー更新 */
function updatePreview() {
  const html = generateHTML();
  const frame = document.getElementById("preview-frame");
  const iframe = frame.querySelector("iframe") || document.createElement("iframe");
  if (!iframe.parentNode) {
    iframe.setAttribute("sandbox", "allow-same-origin");
    frame.appendChild(iframe);
  }
  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();
}

/** SNSリンクのHTMLを生成 */
function generateSNSHTML(data, primaryColor) {
  const links = [];
  if (data.snsInstagram) {
    links.push(`<a href="${escapeHTML(data.snsInstagram)}" target="_blank" rel="noopener noreferrer" class="sns-btn sns-instagram" title="Instagram">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
    </a>`);
  }
  if (data.snsX) {
    links.push(`<a href="${escapeHTML(data.snsX)}" target="_blank" rel="noopener noreferrer" class="sns-btn sns-x" title="X">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    </a>`);
  }
  if (data.snsFacebook) {
    links.push(`<a href="${escapeHTML(data.snsFacebook)}" target="_blank" rel="noopener noreferrer" class="sns-btn sns-facebook" title="Facebook">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
    </a>`);
  }
  if (data.snsLine) {
    links.push(`<a href="${escapeHTML(data.snsLine)}" target="_blank" rel="noopener noreferrer" class="sns-btn sns-line" title="LINE">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
    </a>`);
  }
  return links.length > 0
    ? `\n  <section class="section sns-section">
    <div class="section-title-wrapper">
      <h2 class="section-title">SNS</h2>
    </div>
    <div class="sns-links">
      ${links.join("\n      ")}
    </div>
  </section>`
    : "";
}

/** 完成HTMLを生成 */
function generateHTML() {
  const data = getFormData();
  const tmpl = TEMPLATES[currentTemplate];
  const baseColors = tmpl.colors;
  const custom = getCustomColors();

  // カスタムカラーを適用（テンプレートベースをカスタム値で上書き）
  const c = {
    ...baseColors,
    primary: custom.primary,
    secondary: custom.secondary,
    accent: custom.accent,
    background: custom.background,
    headerBg: custom.primary,
    headerText: baseColors.headerText,
  };

  const menuHTML = data.menuItems.length > 0
    ? data.menuItems.map((item) =>
        `          <div class="menu-item">
            <span class="menu-item-name">${escapeHTML(item.name)}</span>
            <span class="menu-item-dots"></span>
            <span class="menu-item-price">${item.price ? escapeHTML(item.price) + "円" : ""}</span>
          </div>`
      ).join("\n")
    : "";

  const headerImageCSS = data.headerImage
    ? `background-image: linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('${data.headerImage}');
      background-size: cover;
      background-position: center;
      padding: 80px 20px 60px;`
    : `background: ${c.headerBg};
      padding: 60px 20px 40px;`;

  const shopImageHTML = data.shopImage
    ? `\n  <section class="section" style="text-align:center; padding-bottom: 20px;">
    <img src="${data.shopImage}" alt="店舗写真" style="width:100%; max-width:700px; border-radius:12px; box-shadow: 0 4px 16px rgba(0,0,0,0.1);">
  </section>`
    : "";

  const mapHTML = (data.showMap && data.address)
    ? `\n      <tr><th>地図</th><td>
        <div style="margin-top:8px; border-radius:8px; overflow:hidden;">
          <iframe src="https://maps.google.com/maps?q=${encodeURIComponent(data.address)}&output=embed&z=16" width="100%" height="250" style="border:0; display:block;" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </td></tr>`
    : "";

  const snsHTML = generateSNSHTML(data, c.primary);

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHTML(data.shopName)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Noto+Serif+JP:wght@400;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: ${tmpl.font};
      background: ${c.background};
      color: ${c.text};
      line-height: 1.8;
    }

    /* ヘッダー */
    .header {
      ${headerImageCSS}
      color: ${c.headerText};
      text-align: center;
    }
    .header h1 { font-size: 2em; margin-bottom: 10px; letter-spacing: 0.05em; text-shadow: 0 1px 4px rgba(0,0,0,0.2); }
    .header p { font-size: 1.1em; opacity: 0.9; }

    /* セクション共通 */
    .section {
      max-width: 800px;
      margin: 0 auto;
      padding: 50px 20px;
    }
    .section-title {
      font-size: 1.5em;
      color: ${c.primary};
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 10px;
      border-bottom: 2px solid ${c.secondary};
      display: inline-block;
    }
    .section-title-wrapper { text-align: center; margin-bottom: 30px; }

    /* 紹介セクション */
    .about-text {
      text-align: center;
      font-size: 1.05em;
      max-width: 600px;
      margin: 0 auto;
    }

    /* メニューセクション */
    .menu-section { background: ${c.accent}; }
    .menu-item {
      display: flex;
      align-items: baseline;
      padding: 12px 0;
      border-bottom: 1px dashed ${c.secondary};
    }
    .menu-item:last-child { border-bottom: none; }
    .menu-item-name { font-weight: bold; white-space: nowrap; }
    .menu-item-dots { flex: 1; border-bottom: 1px dotted ${c.secondary}; margin: 0 8px; min-width: 20px; }
    .menu-item-price { white-space: nowrap; color: ${c.primary}; font-weight: bold; }

    /* 店舗情報 */
    .info-table { width: 100%; max-width: 500px; margin: 0 auto; border-collapse: collapse; }
    .info-table tr { border-bottom: 1px solid #eee; }
    .info-table th {
      text-align: left;
      padding: 12px 16px 12px 0;
      color: ${c.primary};
      white-space: nowrap;
      width: 100px;
      vertical-align: top;
    }
    .info-table td { padding: 12px 0; }

    /* SNSセクション */
    .sns-section { text-align: center; padding-top: 20px; }
    .sns-links { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }
    .sns-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      color: #fff;
      text-decoration: none;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .sns-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
    .sns-instagram { background: linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); }
    .sns-x { background: #000; }
    .sns-facebook { background: #1877F2; }
    .sns-line { background: #06C755; }

    /* フッター */
    .footer {
      background: ${c.headerBg};
      color: ${c.headerText};
      text-align: center;
      padding: 30px 20px;
      font-size: 0.9em;
      opacity: 0.9;
    }

    /* レスポンシブ */
    @media (max-width: 600px) {
      .header { padding: 40px 16px 30px; }
      .header h1 { font-size: 1.5em; }
      .section { padding: 30px 16px; }
      .section-title { font-size: 1.2em; }
    }
  </style>
</head>
<body>
  <header class="header">
    <h1>${escapeHTML(data.shopName)}</h1>
    <p>${escapeHTML(data.catchphrase)}</p>
  </header>
${shopImageHTML}
  <section class="section">
    <div class="section-title-wrapper">
      <h2 class="section-title">当店について</h2>
    </div>
    <p class="about-text">${escapeHTML(data.description)}</p>
  </section>

${data.menuItems.length > 0 ? `  <section class="section menu-section">
    <div class="section-title-wrapper">
      <h2 class="section-title">${currentTemplate === "salon" ? "メニュー・料金" : "メニュー"}</h2>
    </div>
    <div class="menu-list">
${menuHTML}
    </div>
  </section>` : ""}

  <section class="section">
    <div class="section-title-wrapper">
      <h2 class="section-title">店舗情報</h2>
    </div>
    <table class="info-table">
${data.address ? `      <tr><th>住所</th><td>${escapeHTML(data.address)}</td></tr>` : ""}
${data.phone ? `      <tr><th>電話番号</th><td>${escapeHTML(data.phone)}</td></tr>` : ""}
${data.hours ? `      <tr><th>営業時間</th><td>${escapeHTML(data.hours)}</td></tr>` : ""}
${data.closed ? `      <tr><th>定休日</th><td>${escapeHTML(data.closed)}</td></tr>` : ""}
${mapHTML}
    </table>
  </section>
${snsHTML}
  <footer class="footer">
    <p>&copy; ${new Date().getFullYear()} ${escapeHTML(data.shopName)}</p>
  </footer>
</body>
</html>`;
}

/** HTMLダウンロード */
function downloadHTML() {
  const data = getFormData();
  const html = generateHTML();
  const blob = new Blob([html], { type: "text/html; charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = (data.shopName || "myshop") + ".html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("HTMLファイルをダウンロードしました！");
}

/** トースト通知表示 */
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

/** HTMLエスケープ */
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", init);
