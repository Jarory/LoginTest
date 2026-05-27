const jwt = require("jsonwebtoken");  // 驗證使用者身份
const bcrypt = require("bcrypt");  // 密碼雜湊
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require('path');
const fs = require('fs'); // 💡 引入檔案系統模組

const app = express();
const SECRET_KEY = "mysecretkey";

app.use(cors());
app.use(express.json());

// 💡 修正：自動偵測雲端 Git 到底是存在大寫 Public 還小寫 public 資料夾
let targetFolder = 'public';
if (fs.existsSync(path.join(__dirname, 'Public'))) {
    targetFolder = 'Public';
}
console.log("👉 伺服器目前成功鎖定前端資料夾：", targetFolder);

// 1. 必須先開放靜態資料夾（這樣 style.css、index.js、home.js 才能被順利下載）
app.use(express.static(path.join(__dirname, targetFolder)));

// 2. 設定首頁路由（讓輸入網址時直接讀取 index.html）
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, targetFolder, 'index.html')); 
});

// 3. 設定會員主頁路由（提供正確的相對路徑跳轉）
app.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname, targetFolder, 'home.html'));
});

const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
});

db.connect((err) => {
    if (err) {
        console.log("資料庫連線失敗");
    } else {
        console.log("MySQL連線成功");
    }
});

// 雜湊版本註冊
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const checkSql = "SELECT * FROM users WHERE username = ?";

    db.query(checkSql, [username], async (err, result) => {
        if (err) {
            return res.json({ success: false, message: "系統錯誤" });
        }
        if (result.length > 0) {
            return res.json({ success: false, message: "帳號已存在" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const insertSql = "INSERT INTO users (username, password) VALUES (?, ?)";

        db.query(insertSql, [username, hashedPassword], (err, result) => {
            if (err) {
                return res.json({ success: false, message: "註冊失敗" });
            }
            return res.json({ success: true, message: "註冊成功" });
        });
    });
});

// 驗證資料版本登入
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM users WHERE username = ?";

    db.query(sql, [username], async (err, result) => {
        if (err) {
            return res.json({ success: false, message: "登入失敗" });
        }
        if (result.length === 0) {
            return res.json({ success: false, message: "帳號不存在" });
        }

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "密碼錯誤" });
        }

        const token = jwt.sign({ username: username }, SECRET_KEY, { expiresIn: "1h" });

        return res.json({
            success: true,
            message: "登入成功",
            token: token
        });
    });
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

app.get("/profile", authenticateToken, (req, res) => {
    res.json({
        message: "驗證成功",
        user: req.user
    });
});

// 💡 修正：Render 部署必備！優先使用雲端環境變數提供的 PORT，否則才使用 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`伺服器啟動，正運行於 Port: ${PORT}`);
});
