const jwt = require("jsonwebtoken");  //驗證使用者身份
const bcrypt = require("bcrypt");  //密碼雜湊
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const SECRET_KEY = "mysecretkey";

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "@Jay0110",
    database: "login_system"
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

    const checkSql =
    "SELECT * FROM users WHERE username = ?";

    db.query(checkSql, [username], async (err, result) => {

        if (err) {

            return res.json({
                success: false,
                message: "系統錯誤"
            });
        }

        if (result.length > 0) {

            return res.json({
                success: false,
                message: "帳號已存在"
            });
        }

        const hashedPassword =
        await bcrypt.hash(password, 10);

        const insertSql =
        "INSERT INTO users (username, password) VALUES (?, ?)";

        db.query(
            insertSql,
            [username, hashedPassword],
            (err, result) => {

                if (err) {

                    return res.json({
                        success: false,
                        message: "註冊失敗"
                    });
                }

                return res.json({
                    success: true,
                    message: "註冊成功"
                });
            }
        );
    });
});

//驗證資料版本
app.post("/login", (req, res) => {

    const { username, password } = req.body;

    const sql =
    "SELECT * FROM users WHERE username = ?";

    db.query(sql, [username], async (err, result) => {

        if (err) {

            return res.json({
                success: false,
                message: "登入失敗"
            });
        }

        if (result.length === 0) {

            return res.json({
                success: false,
                message: "帳號不存在"
            });
        }

        const user = result[0];

        const isMatch =
        await bcrypt.compare( //加密比對
            password,
            user.password
        );

        if (!isMatch) {

            return res.json({
                success: false,
                message: "密碼錯誤"
            });
        }

        const token = jwt.sign(
            {
                username: username
            },
            SECRET_KEY,
            {
                expiresIn: "1h"
            }
        );

        return res.json({
            success: true,
            message: "登入成功",
            token: token
        });
    });
});

function authenticateToken(req, res, next) {

    const authHeader = req.headers["authorization"];

    const token =
    authHeader && authHeader.split(" ")[1];

    if (!token) {

        return res.sendStatus(401);
    }

    jwt.verify(
        token,
        SECRET_KEY,
        (err, user) => {

            if (err) {

                return res.sendStatus(403);
            }

            req.user = user;

            next();
        }
    );
}

app.get(
    "/profile",
    authenticateToken,
    (req, res) => {

        res.json({
            message: "驗證成功",
            user: req.user
        });
    }
);

app.listen(3000, () => {
    console.log("伺服器啟動：http://localhost:3000");
});