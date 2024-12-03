document.addEventListener("DOMContentLoaded", function(){

    let getNameInURL = new URLSearchParams(window.location.search).get('name');
    let getUsernameInURL = new URLSearchParams(window.location.search).get('username');

    if(getNameInURL){
        localStorage.setItem("name", getNameInURL);
        localStorage.setItem("username", getUsernameInURL);
        window.location.href= "/";
    }
    
    let name = localStorage.getItem("name");
    let username = localStorage.getItem("username");


    if(name){
        let displayName = document.getElementById("display-name");
            displayName.innerText = name;

        let loginLogout = document.getElementById("login-logout");
            loginLogout.innerText = "logout";
            loginLogout.href = "";
            loginLogout.setAttribute("onclick", "logout()");

    }


});

function logout(){
    localStorage.removeItem("name");
    localStorage.removeItem("username");
    window.location.href= "/";
}