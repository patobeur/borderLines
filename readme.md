# socket io 

multiple users tests, again...

## start server

    npm install
    npm start or npm run dev (for nodemon)

    open index.html with "Live Server" for client

## bugs

a lot of bugs as you can see !!!

less than before but still a lot of missing functionalities ...

- [ ] no limite for users in a room
- [ ] no limite for rooms
- [ ] movement along floor borders isn't smooth
- [x] still no visible teamate

- [ ] done

### packages
    
    {
        "name": "bordelines",
        "version": "1.0.0",
        "description": "multi-user testing with socket.io",
        "main": "server.js",
        "type": "module",
        "scripts": {
            "start": "node .",
            "dev": "nodemon ."
        },
        "keywords": [],
        "author": "",
        "license": "ISC",
        "dependencies": {
            "express": "^4.18.2",
            "socket.io": "^4.7.2"
        },
        "devDependencies": {
            "nodemon": "^3.0.2"
        }
    }

### ip connection set ( server side )

server.js

    const io = new Server(expressServer, {
        cors: {
            origin: process.env.NODE_ENV === "production" ? false : [
                "http://localhost:5501",
                "http://127.0.0.1:5501"
            ]
        }
    })

- [ ] server need to be standAlone as client


### CLIENT SIDE -> Front imports 

    <script type="importmap">{
        "imports": {
            "three": "https://unpkg.com/three@0.159.0/build/three.module.js",
            "three/addons/": "https://unpkg.com/three@0.159.0/examples/jsm/"
    }}
    </script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.7.2/socket.io.min.js" crossorigin="anonymous" referrerpolicy="no-referrer">
    </script>

- [ ] client need to be standAlone as server


### CLIENT SIDE -> add your local server ip to *main.js* 

    import { Core } from "./mainCore.js";
    Core.init({socket:io('ws://192.xxx.xxx.xxx:3500')})
