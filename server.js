const express = require("express");

let app = express();
app.use(express.json());
app.use(express.urlencoded( {extended: true} ));


app.listen(4040, () => {
    console.log("Serveur principal : http://localhost:4040/");
});


app.use(express.static(__dirname + '/public/resources'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/resources/views/home.html");
});

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/public/resources/views/login.html");
});

app.get("/register", (req, res) => {
    res.sendFile(__dirname + "/public/resources/views/register.html");
});



app.post("/login", (req, res) => {
    console.log("Appel de login");
    
    const { username, password } = req.body;

    fetch('http://localhost:4041/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur : ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Réponse du serveur :', data);
        res.json(data);
    })
    .catch(error => {
        console.error('Erreur lors de la requête :', error);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    });
});

app.post("/register", (req, res) => {
    console.log("Appel de register");
    
    const { name, username, password } = req.body;

    fetch('http://localhost:4041/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            username: username,
            password: password
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur : ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Réponse du serveur :', data);
        res.json(data);
    })
    .catch(error => {
        console.error('Erreur lors de la requête :', error);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    });
});