console.log("index.js 已載入");

async function register() {
    console.log("register clicked");
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("兩次密碼不一致");
        return;
    }

    // 💡 修正：加上了正確的網址路域 "/register"
    const response = await fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    const result = await response.json();
    alert(result.message);

    if (result.success) {
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        document.getElementById("confirmPassword").value = "";
        document.getElementById("confirmPassword").style.display = "none";
        isRegisterMode = false;
    }
}

async function login() {
    console.log("login clicked");

    document.getElementById("confirmPassword").style.display = "none";
    isRegisterMode = false;

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // 💡 修正：加上了正確的網址路域 "/login"
    const response = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    const result = await response.json();

    if (result.success) {
        sessionStorage.setItem("token", result.token);
        sessionStorage.setItem("username", username);
        // 💡 轉跳至同在 Public 資料夾下的 home.html
        window.location.href = "home.html";
    } else {
        alert(result.message);
    }
}

let isRegisterMode = false; 

function showRegister() {
    const confirmPassword = document.getElementById("confirmPassword");

    if (!isRegisterMode) {
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        document.getElementById("confirmPassword").value = "";
        confirmPassword.style.display = "inline-block";
        isRegisterMode = true;
    } else {
        register();
    }
}

// 💡 修正 window.onload 的錯誤：
// 原本一開啟首頁時沒有登入，sessionStorage 沒有 username，會導致對 null 抓 innerText 噴錯。
window.onload = function () {
    const username = sessionStorage.getItem("username");
    const welcomeText = document.getElementById("welcomeText");
    
    // 確保網頁上真的有這個標籤且有資料才寫入
    if (welcomeText && username) {
        welcomeText.innerText = "歡迎 " + username;   
    }
}