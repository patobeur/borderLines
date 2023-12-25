# socket io multiplayer test

## start server
    npm start
    npm run dev (for nodemon)

    then right click on index.html to open with "Live Server"

## bugs

a lot of bugs as you can see !!!




### packages
    
    {
        "name": "messup",
        "version": "1.0.0",
        "description": "",
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

### Front imports ( public side )
    <script type="importmap">{
        "imports": {
            "three": "https://unpkg.com/three@0.159.0/build/three.module.js",
            "three/addons/": "https://unpkg.com/three@0.159.0/examples/jsm/"
    }}
    </script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.7.2/socket.io.min.js" crossorigin="anonymous" referrerpolicy="no-referrer">
    </script>

### One version before

https://github.com/Penflam/borderLines