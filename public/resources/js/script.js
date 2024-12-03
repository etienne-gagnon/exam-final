



document.addEventListener("DOMContentLoaded", function () {


    let getNameInURL = new URLSearchParams(window.location.search).get('name');
    let getUsernameInURL = new URLSearchParams(window.location.search).get('username');
    let getValidateLogin = new URLSearchParams(window.location.search).get('validateLogin');
    let getActivePage = new URLSearchParams(window.location.search).get('activePage');

    if (getNameInURL && getUsernameInURL && getValidateLogin) {
        localStorage.setItem("name", getNameInURL);
        localStorage.setItem("username", getUsernameInURL);
        localStorage.setItem("validateLogin", getValidateLogin);
        localStorage.setItem("activePage", getActivePage);
        window.location.href = localStorage.getItem("activePage");
    }

    let name = localStorage.getItem("name");
    let username = localStorage.getItem("username");
    let validateLogin = localStorage.getItem("validateLogin");


    if (name && username && validateLogin) {
        let loginLogoutContainer = document.getElementById("login-logout");

        loginLogoutContainer.innerHTML = `
            <span>`+ name +`</span>
            <a onclick="logout()">logout</a>
        `;

        let getUsernameFromStorage = document.getElementById("getUsernameFromStorage");
        if (getUsernameFromStorage) {
            getUsernameFromStorage.value = localStorage.getItem("username");
        }

        let newMessageBtnContainer = document.getElementById("newMessageBtnContainer");

        if(newMessageBtnContainer){
            let newMessageBtn = document.createElement("button");
            newMessageBtn.innerText = "New Message";
            newMessageBtn.setAttribute("onclick", "newMessageBtn()");
    
            newMessageBtnContainer.append(newMessageBtn);
            getMessages();
        }

    }else{
        let loginLogoutContainer = document.getElementById("login-logout");

        loginLogoutContainer.innerHTML = `
            <a href="/login">Login</a>
            <a href="/register">Register</a>
        `;
    }

    let addNewMessageBtn = document.getElementById("addNewMessage");

    if (addNewMessageBtn) {
        addNewMessageBtn.addEventListener("submit", function (e) {
            e.preventDefault();
    
            //validateLogin();
            addNewMessageBtn.submit();
        });
    }
    
});








function logout() {
    localStorage.removeItem("name");
    localStorage.removeItem("username");
    localStorage.removeItem("validateLogin");
    window.location.href = "/";
}



function validateLogin() {
    let form = document.createElement("form");
    form.method = "POST";
    form.action = "/validate-login";
    form.innerHTML = `
            <input type="hidden" name="name" value="` + localStorage.getItem("name") + `">
            <input type="hidden" name="username" value="` + localStorage.getItem("username") + `">
            <input type="hidden" name="activePage" value="` + window.location.href + `">
        `;
    document.body.appendChild(form);
    form.submit();
}   

function newMessageBtn() {
    validateLogin();

    window.location.href = "/newMessage";
}






// Script message client

async function getMessages() {
    try {
        const response = await fetch('http://localhost:4042/api/messages');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const messages = await response.json();

        const messagesContainer = document.getElementById('messagesContainer');
        if (!messagesContainer) {
            console.error('messagesContainer introuvable dans le DOM');
            return;
        }

        messagesContainer.innerHTML = '';
        
        messages.forEach(message => {
            const messageElement = document.createElement("div");
            messageElement.id = message.id;
            messageElement.className = "message";
            messageElement.innerHTML = `
                <div>
                    <a onclick="fetchMessageById('${message.id}')" >${message.titre}</a>
                    <span>${message.username}</span>
                    <span>${new Date(message.date).toLocaleString()}</span>
                </div>
                <div>
                    <span>${message.message}</span>
                </div>
            `;
            messagesContainer.appendChild(messageElement);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des messages :', error);
    }
}

async function fetchMessageById(messageId) {
    try {
        const response = await fetch(`http://localhost:4042/api/messages/${messageId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const message = await response.json();

        const messagesContainer = document.getElementById('messagesContainer');
        if (!messagesContainer) {
            console.error('messagesContainer introuvable dans le DOM');
            return;
        }

        messagesContainer.innerHTML = '';
            const messageElement = document.createElement("div");
            messageElement.id = message.id;
            messageElement.className = "message";
            messageElement.innerHTML = `
                <div>
                    <a>${message.titre}</a>
                    <span>${message.username}</span>
                    <span>${new Date(message.date).toLocaleString()}</span>
                </div>
                <div>
                    <span>${message.message}</span>
                </div>
            `;
            messagesContainer.appendChild(messageElement);
    } catch (error) {
        console.error('Erreur lors de la récupération des messages :', error);
    }
}


