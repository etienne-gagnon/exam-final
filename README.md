Port du serveur : 4040




SERVERS
- server.js : gère les routes entre les views et les API

API
- api-users.js : gère les requetes et reponse de la bd adminitration.users
- api-messages.js : gère les requetes et reponse de la bd content.messages

RESOURCES
- VIEWS
    - HOME
        - NAV
            - btn "nouveau message" (si login)
            - search bar
            - a : login
            - a : register
            - si login : 
                - A : prenom user 
                    - menu déroulant avec profile et my message
                - a : logout    
        - MESSAGE *** UNIQUEMENT SI SEARCH BAR ** 
        - si connecter 
            - pop up new messgage 
            - pop up new repsonse
        
    - LOGIN
        - NAV
        - FORM 
            - input : username
            - input : password hashed
            - btn ok 
            - btn cancel
    - REGISTER
            - FORM 
            - input : name
            - input : username
            - input : password hashed
            - btn ok 
            - btn cancel
    - PROFILE
        - nav
        - info du user 
            - name
            - username
            - pasword
    - 




