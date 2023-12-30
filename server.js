import express from 'express'
import { Server } from "socket.io"
import path from 'path'
import { fileURLToPath } from 'url'
import { UsersState } from './src/usersState.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 3500
const ADMIN = "Admin"

const app = express()

app.use(express.static(path.join(__dirname, "public")))

const expressServer = app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`)
})
const io = new Server(expressServer, {
	cors: {
		origin: process.env.NODE_ENV === "production" ? false : [
			"http://192.168.17.125:3500",
			"http://localhost:5500",
			"http://127.0.0.1:5500"
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
			// remove player for all users in prevroom
			io.to(this.prevRoom).emit(
				'removePlayerFromRoom',
				{id:id,name:name}
			)
			// remove player in prevroom
			this.socket.emit(
				'removePlayerFromRoom',
				{id:id,name:name}
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
		
		console.log('----MESSAGE receive from FROM ---------------')
		console.log(datas)
		const user = UsersState.getUser(datas.socketId)
		if(user && datas && datas.name && datas.room && datas.text){
			const room = user.room
			const name = user.name
			if(name === datas.name && room === datas.room){
					console.log('---user------',user)
					console.log('-this.socket.id--------',this.socket.id)
					console.log(datas)
					io.to(room).emit('message', `[${UsersState.getTime()}][${room}][${name}] ${datas.text}`)
			}
		}

	}
}
io.on('connection', (socket) => {
	socketing.init(socket)
	// Upon connection - only to user 
	// socket.on('checkName', ({ name, room }) => {

	// })
	socket.on('enterRoom', ({ name, couleur, room }) => {

		socketing.prevRoom = UsersState.getUser(socket.id)?.room

		// leave previous room if prevRoom
		if (socketing.prevRoom) socketing.leaveRoom({id:socket.id,name:socket.name})

		socketing.user = UsersState.activateUserInNewRoom(socket.id, name, couleur, room)
		socketing.users = UsersState.getUsersInRoom(socketing.user.room)
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
		const pos = data.pos;
		// const name = data.name;
		// no check
		// no verif
		// nothing
		UsersState.setUserPos(socket.id,pos);
		
		const usersCount = UsersState.getUsersInRoom(socketing.user.room).length

		if(usersCount > 1){
			io.to(socketing.user.room).emit('updPlayerById', {
				id: socket.id,
				pos: pos
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

		if (room) {
			const paquet = {
				name: name,
				user:UsersState.getUser(socket.id)
			}
			socket.broadcast.to(room).emit('activity', paquet)
		}
	})
})