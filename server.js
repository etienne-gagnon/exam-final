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
