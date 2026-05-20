1.後端cmd啟動=>cd到對應資料夾=>輸入 nodemon server.js 2.打開MySQL檢查資料是否成功匯入=>
輸入=>
USE login_system;
SELECT \* FROM users;

從最原始的一般user登入(不安全)慢慢進階到需要身分驗證和密碼雜湊加密，第一份做出來的範本是能透過直接換網頁的形式進入(index=>home)，這是非常不安全的方式，因為容易被暴力破解，到第二個版本運用jwt讓每一次登入都需要有專屬的token才可以，然後在進行密碼雜湊做進一步的安全驗證。
