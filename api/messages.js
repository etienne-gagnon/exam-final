const express = require("express");

let app = express();
app.use(express.json());
app.use(express.urlencoded( {extended: true} ));


app.listen(4042, () => {
    console.log("Serveur api - messages : http://localhost:4041/");
});

