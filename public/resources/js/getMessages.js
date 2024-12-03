 
        
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
                        <div class="info">
                            <div>
                            <a onclick="fetchMessageById('${message.id}')" >${message.titre}</a>
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
        
        getMessages();