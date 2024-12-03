const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('mongodb');
const uri = "mongodb+srv://admin:admin@cluster0.v4hby.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
let db;

let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:4040', // Autorise uniquement cette origine
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes autorisées
}));

app.use(express.static(__dirname + '/public/resources'));

app.listen(4042, () => {
    console.log("Serveur api - messages : http://localhost:4042/");
});



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
        db = client.db("content");
        console.log("Connexion à la base de données réussie !");
    } catch (error) {
        console.error("Erreur lors de la connexion à la base de données :", error);
        process.exit(1);
    }
};

connectToDatabase();


// Ajout message
app.post("/api/messages", async (req, res) => {
    try {
        const { username, titre,  message } = req.body;
        const newMessage = {
            username,
            titre,
            message,
            date: new Date()
        };

        console.log(username + message + titre);
        
        if (!username || !message || !titre) {
            return res.status(400).json({ success: false, message: "Le nom d'utilisateur, le titre et le contenu sont requis" });
        }

        

        // Ajout du message à la base de données
        const mResult = await db.collection("messages").insertOne(newMessage);

        if (mResult) {
            res.status(201).json({
                success: true,
                message: "Message ajouté avec succès",
                data: newMessage
            });
            console.log("Message ajouté avec succès :", newMessage);
        } else {
            res.status(401).json({
                success: false,
                message: "Erreur lors de l'insertion du message",
                data: newMessage
            });
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout du message :", error);
        res.status(201).json({
            success: true,
            message: "Erreur lors de l'ajout du message",
            data: newMessage
        });
    }
});

app.get("/api/messages", async (req, res) => {
    try {
        
        const messagesFromDb = await db.collection("messages").find().toArray();
        const formattedMessages = messagesFromDb.map(message => ({
            id: message._id,
            titre: message.titre,
            username: message.username,
            message: message.message,
            date: message.date,
        }));
        res.status(200).json(formattedMessages);
    } catch (error) {
        console.error("Erreur lors de la récupération des messages :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});



app.get("/api/messages/:id", async (req, res) => {
    try {
        const messageId = req.params.id;
        const message = await db.collection("messages").findOne({ _id: new ObjectId(messageId) });

        if(message) {
            res.status(200).json({
                success:true,
                id: message._id,
                titre: message.titre,
                username: message.username,
                message: message.message,
                date: message.date,
            })
        }else{
            res.status(400).json({success:false, message:"Message non trouvé pour l'id"});
        }
        
    } catch (error) {
        res.status(500).json({success:false, message:"Erreur lors du fetch"});

    }
});

app.get("/api/answers/:id", async (req, res) => {
    const messageId = req.params.id;

    
        try {
            const answersFromDb = await db.collection("answers").find({ messageId: messageId }).toArray();

            console.log(answersFromDb);

            const formattedAnswers = answersFromDb.map(message => ({
                username: message.username,
                answer: message.answer,
                date: message.date,
            }));
            console.log(formattedAnswers);
            res.status(200).json(formattedAnswers);
            
        } catch (error) {
            console.error("Erreur lors de la récupération des messages :", error);
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
});

app.post("/api/messages/:id", async (req, res) => {
    try {
        const messageId = req.params.id;
        const { username,  answer } = req.body;

        

        const newMessage = {
            messageId,
            username,
            answer,
            date: new Date()
        };

        
        console.log(newMessage);

        const message = await db.collection("answers").insertOne(newMessage);
        if(message) {
            res.status(200).json({
                success:true,
                messageId: messageId,
                username: message.username,
                answer: message.answer,
                date: message.date,
            })
        }else{
            res.status(400).json({success:false, message:"Message non trouvé pour l'id"});
        }
        
    } catch (error) {
        res.status(500).json({success:false, message:"Erreur lors du fetch"});

    }
});

// moddifier messages avec le admin seulement

// Supprimer messages avec le admin seulement

