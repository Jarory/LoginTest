# LoginTest — 會員登入系統

> 使用 Node.js、Express.js 與 MySQL 從零打造的會員登入系統，實作使用者註冊、登入、密碼加密、JWT 身分驗證以及雲端部署。

🌐 **Live Demo**

https://logintest-yhla.onrender.com/

> ⚠️ Render 免費方案第一次開啟可能需要等待約 30～60 秒，屬正常現象。

---

# 專案展示

## 登入畫面

> （建議放登入頁截圖）

---

## 會員首頁

> （建議放登入成功後畫面）

---

## 資料庫

> （建議放 MySQL users 資料表截圖）

---

## 專案介紹

這個專案是我在學習後端開發時，獨立完成的第一個完整會員登入系統。

最初僅完成基本的帳號密碼登入功能，之後重新設計整個登入流程，導入 **MySQL、bcrypt 密碼雜湊、JWT 身分驗證** 等技術，希望讓登入流程更接近實際網站的運作方式。

除了完成功能外，也透過不斷除錯與重構，理解登入驗證背後的設計理念與安全性考量。

---

# 專案演進

## 第一版

- 基本會員註冊與登入
- 使用 MySQL 儲存帳號資料
- 密碼以明文方式儲存
- 登入成功後直接切換頁面
- 未建立完整登入驗證機制

## 第二版（目前版本）

- 密碼使用 bcrypt 雜湊後存入資料庫
- 登入成功後由後端產生 JWT Token
- 使用 Middleware 驗證 Token
- 前後端以 Fetch API + JSON 進行資料交換
- 使用 Render 完成雲端部署
- 使用環境變數管理資料庫連線資訊

---

# 系統架構

```text
Browser
(HTML / CSS / JavaScript)
            │
            │ Fetch API
            ▼
Node.js + Express.js
            │
            ├── JWT Authentication
            ├── bcrypt Password Hashing
            ▼
        MySQL Database
```

---

# 核心功能

- 會員註冊
- 會員登入
- 帳號重複檢查
- MySQL 使用者資料儲存
- bcrypt 密碼雜湊
- JWT Token 產生
- JWT Middleware 驗證
- 登入狀態保存（Session Storage）
- Render 雲端部署
- 前後端分離架構（Fetch API + JSON）

---

# API

| Method | API       | 功能           |
| ------ | --------- | -------------- |
| POST   | /register | 建立新會員     |
| POST   | /login    | 登入驗證       |
| GET    | /profile  | JWT Token 驗證 |

---

# 使用技術

## Frontend

- HTML
- CSS
- JavaScript
- Fetch API

## Backend

- Node.js
- Express.js

## Database

- MySQL

## Authentication

- JWT (JSON Web Token)
- bcrypt

## Deployment

- Render

---

# 登入流程

```text
使用者輸入帳號密碼
        │
        ▼
前端 Fetch API 發送登入請求
        │
        ▼
Express 接收 Request
        │
        ▼
MySQL 查詢使用者
        │
        ▼
bcrypt 比對密碼
        │
        ▼
登入成功
        │
        ▼
產生 JWT Token
        │
        ▼
回傳 Token 至前端
        │
        ▼
前端保存 Token
        │
        ▼
可透過受保護 API (/profile)
驗證登入身份
```

# 專案亮點

✔ 使用 Express 建立 REST API

✔ 使用 MySQL 管理會員資料

✔ bcrypt 密碼雜湊

✔ JWT 身分驗證

✔ Middleware 保護 API

✔ Fetch API 串接前後端

✔ Render 雲端部署

✔ 使用環境變數管理敏感資訊

---

# 這個專案我學到什麼

透過這個專案，我學習並實作了：

- Node.js 與 Express 建立後端 API
- MySQL 資料庫操作與會員管理
- Fetch API 串接前後端
- bcrypt 密碼雜湊與驗證流程
- JWT 身分驗證流程
- Middleware 的使用方式
- Render 雲端部署 Node.js 專案
- 使用 Chrome DevTools（Console、Network）除錯前後端問題
- 從基本登入系統逐步重構為具備安全驗證機制的會員系統

---

# 未來可持續優化

- Email 驗證
- 忘記密碼功能
- Token Refresh 機制
- 使用者個人資料修改
- 大頭貼上傳
- RWD 響應式設計
- Docker 容器化部署

---

# 專案說明

本專案為個人學習用途。

資料庫連線資訊、JWT Secret Key 等敏感資訊皆使用環境變數管理，不包含於此 Repository。
