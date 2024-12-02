const express = require("express");
const bcrypt = require("bcrypt");

let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(4041, () => {
    console.log("Serveur api - users : http://localhost:4041/");
});




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:admin@cluster0.v4hby.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
let db;

const connectToDatabase = async () => {
    try {
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });

        await client.connect();
        db = client.db("administration");
        console.log("Connexion à la base de données réussie !");
    } catch (error) {
        console.error("Erreur lors de la connexion à la base de données :", error);
        process.exit(1);
    }
};

connectToDatabase();



app.post("/api/users/login", (req, res) => {

    const { username, password } = req.body;

    // connexion a la bd

    // vérifier si user existe
    // Renvoyer la réponse
});


app.post("/api/users/register", async (req, res) => {

    const { name, username, password } = req.body;


    try {
        const userExists = await db.collection("users").findOne({ username });

        if (userExists) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            name: name,
            username: username,
            password: hashedPassword,
            profile: 'user'
        }

        const result = await db.collection("users").insertOne(newUser);

        res.status(201).json({
            success: true,
            message: "Utilisateur enregistré avec succès",
            user: { id: result.insertedId, name: name, username: username }
        });
    } catch (error) {
        console.error("Erreur lors de l'enregistrement:", error);
        res.status(500).json({ success: false, message: "Erreur interne du serveur" });
    }
});


