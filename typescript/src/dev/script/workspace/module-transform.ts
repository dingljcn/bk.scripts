window.$Transform = function(buttonName, username, password) {
    return {
        btnName: buttonName,
        func: function() {
            const usernameElement: HTMLInputElement = document.querySelector("div[formkey='ChooseTrOperator'] div[caption='用户名'] input");
            const passwordElement: HTMLInputElement = document.querySelector("div[formkey='ChooseTrOperator'] div[caption='密码'] input");
            if (usernameElement && password) {
                usernameElement.click();
                usernameElement.value = username;
                passwordElement.click();
                passwordElement.type = 'text';
                passwordElement.value = password;
                usernameElement.click();
            }
        }
    }
}