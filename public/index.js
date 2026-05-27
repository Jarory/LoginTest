    console.log("index.js 已載入");

    async function register() {
    
    console.log("register clicked");
    
    const username =
    document.getElementById("username").value;

    const password =
    document.getElementById("password").value;

    const confirmPassword =
    document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {

        alert("兩次密碼不一致");
        return;
    }

    //login
    const response = await fetch(
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        }
    );

    const result = await response.json();

    alert(result.message);

    if (result.success) {

        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        document.getElementById("confirmPassword").value = "";

        document.getElementById("confirmPassword")
        .style.display = "none";

        isRegisterMode = false;
    }
}

async function login() {

    console.log("login clicked");

    document.getElementById("confirmPassword")
    .style.display = "none";

    isRegisterMode = false;

    const username =
    document.getElementById("username").value;

    const password =
    document.getElementById("password").value;

    //register
    const response = await fetch(
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        }
    );

    const result = await response.json();

    if (result.success) {

        sessionStorage.setItem(
            "token",
            result.token
        );

        sessionStorage.setItem(
            "username",
            username
        );

        window.location.href = "home.html";

    } else {

        alert(result.message);
    }
}

let isRegisterMode = false; //註冊模式預設f

function showRegister() {

    const confirmPassword =
    document.getElementById("confirmPassword");

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



// function logout() {

//     sessionStorage.removeItem("token");
//     sessionStorage.removeItem("username");

//     window.location.href = "index.html";
// }

window.onload = function () {

    const username =
    sessionStorage.getItem("username");

    document.getElementById("welcomeText")
    .innerText = "歡迎 " + username;   
}