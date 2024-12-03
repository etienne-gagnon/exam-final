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


app.post("/api/users/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await db.collection("users").findOne({ username: username });

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                res.json({ success: true, message: "Connexion réussie", user: { id: user._id, name: user.name, username: user.username } });
            } else {
                res.status(401).json({ success: false, message: "Mot de passe incorrect" });
            }
        } else {
            res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur interne du serveur au moment de la connexion" });
    }
});

app.post("/api/users/register", async (req, res) => {
    const { name, username, password } = req.body;

    const userExists = await db.collection("users").findOne({ username });

    if (userExists) {
        res.status(409).json({ success: false, message: "L'utilisateur existe déjà" });
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            name: name,
            username: username,
            password: hashedPassword,
            profile: 'user'
        }

        try {
            const result = await db.collection("users").insertOne(newUser);
            res.status(201).json({ success: true, message: "Utilisateur enregistré avec succès", user: { id: result.insertedId, name: name, username: username } });
        } catch (error) {
            res.status(500).json({ success: false, message: "Erreur interne du serveur au moment de l'enregistrement" });
        }
    }
});


