console.log("home.js 已載入");

// token 驗證
const token = sessionStorage.getItem("token");

if (!token) {
    window.location.href = "index.html";
}

// 顯示 username
const username = sessionStorage.getItem("username");

if (username) {
    document.getElementById("welcomeText").innerText = "歡迎 " + username;
}

function logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    window.location.href = "index.html";
}

async function getProfile() {
    const token = sessionStorage.getItem("token");

    // 💡 修正：將 http://localhost:3000/profile 改為相對路徑 "/profile"
    const response = await fetch("/profile", {
        headers: {
            Authorization: "Bearer " + token
        }
    });

    const result = await response.json();
    console.log(result);
    alert(result.message);
}
