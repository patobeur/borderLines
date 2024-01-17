import express from 'express'
import { Server } from "socket.io"
import path from 'path'
import { fileURLToPath } from 'url'
import { UsersState } from './src/usersState.js'
import { getLocalIpAddress } from './src/serverTools.js'; // Import de la fonction

// import fs from 'fs';
// import https from 'https';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// const httpsOptions = {
//     key: fs.readFileSync(path.join(__dirname, 'chemin_vers_key.key')),
//     cert: fs.readFileSync(path.join(__dirname, 'chemin_vers_cert.crt'))
// };

const PORT = process.env.PORT || 3500
const ADMIN = "Admin"

const app = express()

app.use(express.static(path.join(__dirname, "public")))

// const expressServer = https.createServer(httpsOptions, app);

// expressServer.listen(PORT, () => {
//     console.log(`listening on port ${PORT}`);
//     console.log(`IP pour se connecter en local : https://${getLocalIpAddress()}:${PORT}`);
// });
const expressServer = app.listen(PORT, () => {
// \x1b[31m : Rouge
// \x1b[32m : Vert
// \x1b[34m : Bleu
// \x1b[33m : jaune
// \x1b[0m : Réinitialisation de la couleur
	const serveurInfo = getLocalIpAddress()
    console.log(`________________________________________`);
    console.log(`listening on port \x1b[31m${PORT}\x1b[0m`);
    console.log(`LOCAL http://127.0.0.1:\x1b[31m5500\x1b[33m/public/index.html\x1b[0m`);
	// console.log(`\x1b[33mhttp://${getLocalIpAddress()}:${PORT}\x1b[0m`); 
	console.log(`${serveurInfo.name} \x1b[33mLAN:\x1b[32m http://${serveurInfo.iface.address}:${PORT}\x1b[0m`);
	console.log(`\x1b[31mTest:\x1b[34m https://${serveurInfo.iface.address}:${PORT}\x1b[0m`);
    console.log(`________________________________________`);
});

const io = new Server(expressServer, {
	cors: {
		origin: process.env.NODE_ENV === "production" ? false : [
			"http://localhost:5501",
			"http://127.0.0.1:5501",
			"http://192.168.1.105:5501"
		]
	}
})
let socketing = {
	user:null,
	users:null,
	prevRoom:false,
	socket:false,
	leaveRoom:function ({id , name}){
		if (this.prevRoom) {
			
			this.socket.leave(this.prevRoom)
			// LE JOUEUR A QUITTÉ LA ROOM

			// message to all user in prevroom
			io.to(this.prevRoom).emit(
				'message', 
				`[${UsersState.getTime()}][${this.prevRoom}][Server] ${name} has left the room`
			)
			
			this.updatePrevRoomUserList()
		}
	},
	updatePrevRoomUserList:function (){
		// send new userList for all users in prevroom
		io.to(this.prevRoom).emit('updateUserList', {
			users: UsersState.getUsersInRoom(this.prevRoom)
		})
	},
	init:function (socket){
		this.socket = socket
		this.sendMessageToPlayer(`[${UsersState.getTime()}][Server] Welcome to BorderLines`)
	},
	sendMessageToPlayer:function (message){
		this.socket.emit('message',message,)
	},
	sendPlayerMessageToRoom:function (datas){
		
		const user = UsersState.getUser(datas.socketId)
		if(user && datas && datas.name && datas.room && datas.text){
			const room = user.room
			const name = user.name
			if(name === datas.name && room === datas.room){
					io.to(room).emit('message', `[${UsersState.getTime()}][${room}][${name}] ${datas.text}`)
			}
		}

	}
}
io.on('connection', (socket) => {
	socketing.init(socket)
		console.log(`User ${socket.id} CONNECTED`)
	// Upon connection - only to user 
	// socket.on('checkName', ({ name, room }) => {

	// })
	socket.on('enterRoom', ({ name, couleur, room, datas }) => {

		socketing.prevRoom = UsersState.getUser(socket.id)?.room

		// leave previous room if prevRoom
		if (socketing.prevRoom) socketing.leaveRoom({id:socket.id,name:socket.name})

		socketing.user = UsersState.activateUserInNewRoom(socket.id, name, couleur, room, datas)
		socketing.users = UsersState.getUsersInRoom(socketing.user.room, datas)
		// join room 
		socket.join(socketing.user.room)

		// send Welcome Paquet message
		socket.emit('welcome', {
			user:socketing.user,
			users:socketing.users,
			message:`[${UsersState.getTime()}][${socketing.user.room}][Server] You have joined the ${socketing.user.room} chat room`
		})
		
		// // To everyone else in the room
		// io.to(socketing.user.room).emit(
		// 	'message',  `[${UsersState.getTime()}][${socketing.user.room}][${socketing.user.name}] has joined the room`
		// )

		// Update user list for room 
		io.to(socketing.user.room).emit('refreshUsersListInRoom', {
			users: socketing.users,
			message:`[${UsersState.getTime()}][${socketing.user.room}][Server] ${socketing.user.name} has joined the room`
		})

		// Update rooms list for everyone 
		io.emit('refreshRoomsList', {
			rooms: UsersState.getAllActiveRooms()
		})
		// Update rooms list for everyone in the room
		io.to(socketing.user.room).emit('addPlayer', {
			rooms: UsersState.getAllActiveRooms()
		})
	})

	// newuserposition
	socket.on('newuserposition', (data) => {
		console.log('server send newuserposition',data.name, data.pos)
		const pos = data.pos;
		const other = data.other;
		// const name = data.name;
		// no check
		// no verif
		// nothing
		UsersState.setUserPos(socket.id,pos);
		const usersCount = UsersState.getUsersInRoom(socketing.user.room).length

		if(usersCount > 1){
			io.to(socketing.user.room).emit('updPlayerById', {
				id: socket.id,
				pos: pos,
				other:other
			})
		}
	})

	// When user disconnects - to all others 
	socket.on('disconnect', () => {
		const user = UsersState.getUser(socket.id)
		if (socketing.prevRoom) socketing.leaveRoom({id:socket.id,name:socket.name})
		UsersState.userLeavesApp(socket.id)


		if (user) {
			io.to(user.room).emit('message', `[${UsersState.getTime()}][${user.room}][${user.name}]  has left the room`)

			io.to(user.room).emit('refreshUsersListInRoom', {
				users: UsersState.getUsersInRoom(user.room),
				message:'test'
			})

			io.emit('refreshRoomsList', {
				rooms: UsersState.getAllActiveRooms()
			})
		}

		console.log(`User ${socket.id} disconnected`)
	})

	// Listening for a message event 
	socket.on('sendPlayerMessageToRoom', (datas) => {
		datas.socketId=socket.id

		socketing.sendPlayerMessageToRoom(datas)
	})

	// Listen for activity 
	socket.on('activity', (name) => {
		const room = UsersState.getUser(socket.id)?.room

		console.log('activity',UsersState.getUser(socket.id))
		if (room) {
			const paquet = {
				name: name,
				user:UsersState.getUser(socket.id)
			}
			socket.broadcast.to(room).emit('activity', paquet)
		}
	})
})