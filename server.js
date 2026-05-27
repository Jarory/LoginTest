const jwt = require("jsonwebtoken");  //驗證使用者身份
const bcrypt = require("bcrypt");  //密碼雜湊
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require('path');
const fs = require('fs'); // 引入檔案系統模組

const app = express();
const SECRET_KEY = "mysecretkey";

app.use(cors());
app.use(express.json());

// 💡 終極相容性路徑偵測：自動判斷雲端是 Public 還小寫 public
let targetFolder = 'public';
if (fs.existsSync(path.join(__dirname, 'Public'))) {
    targetFolder = 'Public';
} else if (fs.existsSync(path.join(__dirname, 'public'))) {
    targetFolder = 'public';
}

console.log("👉 伺服器目前成功鎖定前端資料夾：", targetFolder);

// 1. 先開放資料夾（這行千萬不能拿掉！這樣按鈕的 index.js 和美編 style.css 才能被下載）
app.use(express.static(path.join(__dirname, targetFolder)));

// 2. 設定首頁路由（讓輸入網址時直接讀取網頁檔案）
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, targetFolder, 'index.html')); 
});

// 3. 會員主頁路由
app.get('/home', (req, res) => {
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

//雜湊版本
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

//驗證資料版本
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

        return res.json({ success: true, message: "登入成功", token: token });
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
    res.json({ message: "驗證成功", user: req.user });
});

// 💡 雲端平台部署必須動態讀取 process.env.PORT，否則會跟 Render 衝突
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`伺服器啟動於 port: ${PORT}`);
});
