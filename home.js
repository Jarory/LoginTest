console.log("home.js 已載入");

//token驗證
const token =
sessionStorage.getItem("token");

if (!token) {
    window.location.href = "index.html";
}

//顯示username
const username =
sessionStorage.getItem("username");

if (username) {

    document.getElementById("welcomeText")
    .innerText = "歡迎 " + username;
}

function logout() {

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");

    window.location.href = "index.html";
}

async function getProfile() {

    const token =
    sessionStorage.getItem("token");

    const response = await fetch(
        "http://localhost:3000/profile",
        {
            headers: {
                Authorization:
                "Bearer " + token
            }
        }
    );

    const result =
    await response.json();

    console.log(result);

    alert(result.message);
}
