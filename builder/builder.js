/**
 * 店舗HP ビルダー - コアロジック
 */

let currentTemplate = "cafe";
let menuItemCount = 3;

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
  document.getElementById("shop-name").value = d.shopName;
  document.getElementById("catchphrase").value = d.catchphrase;
  document.getElementById("shop-description").value = d.description;
  document.getElementById("address").value = "東京都渋谷区○○1-2-3";
  document.getElementById("phone").value = "03-1234-5678";
  document.getElementById("hours").value = "10:00〜20:00";
  document.getElementById("closed").value = "毎週水曜日";

  const menuContainer = document.getElementById("menu-items");
  menuContainer.innerHTML = "";
  menuItemCount = 0;
  d.menuItems.forEach((item) => addMenuItem(item.name, item.price));
}

/** イベントリスナー登録 */
function attachEventListeners() {
  const fields = ["shop-name", "catchphrase", "shop-description", "address", "phone", "hours", "closed"];
  fields.forEach((id) => {
    document.getElementById(id).addEventListener("input", updatePreview);
  });
  document.getElementById("add-menu-btn").addEventListener("click", () => {
    addMenuItem("", "");
    updatePreview();
  });
  document.getElementById("download-btn").addEventListener("click", downloadHTML);
  document.getElementById("preview-mobile-btn").addEventListener("click", () => setPreviewSize("mobile"));
  document.getElementById("preview-tablet-btn").addEventListener("click", () => setPreviewSize("tablet"));
  document.getElementById("preview-pc-btn").addEventListener("click", () => setPreviewSize("pc"));
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

/** 完成HTMLを生成 */
function generateHTML() {
  const data = getFormData();
  const tmpl = TEMPLATES[currentTemplate];
  const c = tmpl.colors;

  const menuHTML = data.menuItems.length > 0
    ? data.menuItems.map((item) =>
        `          <div class="menu-item">
            <span class="menu-item-name">${escapeHTML(item.name)}</span>
            <span class="menu-item-dots"></span>
            <span class="menu-item-price">${item.price ? escapeHTML(item.price) + "円" : ""}</span>
          </div>`
      ).join("\n")
    : "";

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
      background: ${c.headerBg};
      color: ${c.headerText};
      text-align: center;
      padding: 60px 20px 40px;
    }
    .header h1 { font-size: 2em; margin-bottom: 10px; letter-spacing: 0.05em; }
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
    .info-table { width: 100%; max-width: 500px; margin: 0 auto; }
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
    </table>
  </section>

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
