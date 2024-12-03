async function fetchMyMessages(username) {
    try {
        const response = await fetch(`http://localhost:4042/api/mymessages/${username}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const messages = data.formattedMessages; // Extraire le tableau `formattedMessages`
        if (!Array.isArray(messages)) {
            console.error('Les messages retournés ne sont pas valides.');
            return;
        }

        const messagesContainer = document.getElementById('messagesContainer');
        if (!messagesContainer) {
            console.error('messagesContainer introuvable dans le DOM');
            return;
        }

        messagesContainer.innerHTML = ''; // Vider le conteneur

    

        messages.forEach(message => {
            const messageElement = document.createElement("div");
            messageElement.id = message.id || ""; // Assurez-vous que `id` existe ou laissez vide
            messageElement.className = "message";
            messageElement.innerHTML = `
                <div class="info">
                    <div>
                        <a onclick="fetchMessageById('${message.id || ""}')">${message.titre}</a>
                        <span>${message.username}</span>
                        <span>${new Date(message.date).toLocaleString()}</span>
                    </div>
                </div>
                <div class="message">
                    <span>${message.message}</span>
                </div>
            `;
            messagesContainer.appendChild(messageElement);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des messages :', error);
    }
}

// Appeler la fonction avec le username stocké dans localStorage
fetchMyMessages(localStorage.getItem("username"));