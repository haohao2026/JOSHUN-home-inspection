# 究享驗屋網站

這是一個靜態形象網站專案，內容包含首頁、關於究享、驗屋項目與常見問題頁。

## 結構

- `index.html`：首頁
- `pages/`：網站分頁
- `css/style.css`：主要樣式
- `js/main.js`：導覽、FAQ、估價與表單互動
- `assets/`：圖片與品牌素材
- `google-apps-script/contact-form.gs`：Google 試算表表單串接範例

## 表單串接

網站表單可串接 Google Apps Script Web App。部署後把 Web App URL 填入 `js/main.js` 的 `GOOGLE_SCRIPT_URL` 常數，即可將資料寫入 Google 試算表並寄出 Email 通知。
