



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
            newMessageBtn.id = "newMessageBtn";
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
    window.location.href = "/newMessage";
}



async function fetchMessageById(messageId) {
    try {
        // Récupérer le message
        const responseMessage = await fetch(`http://localhost:4042/api/messages/${messageId}`);
        if (!responseMessage.ok) {
            throw new Error(`HTTP error! Status: ${responseMessage.status}`);
        }
        const message = await responseMessage.json();

        // Préparer le conteneur du message
        const messagesContainer = document.getElementById('messagesContainer');
        if (!messagesContainer) {
            console.error('messagesContainer introuvable dans le DOM');
            return;
        }


        if (localStorage.getItem("validateLogin")) {
            let newAnswerForm = document.createElement("form");
            newAnswerForm.id = "newAnswerForm";
            newAnswerForm.style.display = "none"; // Correction : utilisation d'une affectation
            newAnswerForm.method = "post";
            newAnswerForm.action = `http://localhost:4042/api/messages/${messageId}`;
            newAnswerForm.innerHTML = `
                <input hidden name="username" value="${localStorage.getItem("username")}">
                <label>Réponse : </label>
                <textarea name="answer" placeholder="Réponse"></textarea>
                <button type="submit">Répondre</button>
                <a onclick='newResponse()' class='center'>Fermer</a>
            `;
        
            newMessageBtnContainer.append(newAnswerForm); 
        }

        messagesContainer.innerHTML = '';

        const messageElement = document.createElement("div");
        messageElement.id = message.id;
        messageElement.className = "message";

        messageElement.innerHTML = `
            <div class="info active">
                <div>
                    <a onclick="fetchMessageById('${message.id}')">${message.titre}</a>
                    <span>${message.username}</span>
                    <span>${new Date(message.date).toLocaleString()}</span>
                </div>
                ${localStorage.getItem("validateLogin") ? '<button onclick="newResponse()">Répondre</button>' : ''}
            </div>
            <div class="message">
                <span>${message.message}</span>
            </div>
        `;

        messagesContainer.appendChild(messageElement);


        // Récupérer les réponses
        const responseAnswers = await fetch(`http://localhost:4042/api/answers/${messageId}`);
        if (!responseAnswers.ok) {
            throw new Error(`HTTP error! Status: ${responseAnswers.status}`);
        }
        const answers = await responseAnswers.json();

        answers.forEach(answer => {
            const answerElement = document.createElement("div");
            answerElement.className = "message";
            answerElement.innerHTML = `
                <div class="info">
                    <span>${answer.username}</span>
                    <span>${new Date(answer.date).toLocaleString()}</span>
                </div>
                <div class="message">
                    <span>${answer.answer}</span>
                </div>
            `;
            messagesContainer.appendChild(answerElement);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des messages ou des réponses :', error);
    }
}


function newResponse(){
    let newAnswerForm = document.getElementById("newAnswerForm");

    if(newAnswerForm.style.display == "none"){
        newAnswerForm.style.display = "flex";
    }else{
        newAnswerForm.style.display = "none";
    }
}


