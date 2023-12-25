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
			"http://localhost:5500",
			"http://127.0.0.1:5500",
			"http://127.0.0.1:3500"
		]
	}
})
let socketing = {
	user:null,
	prevRoom:false,
	socket:false,
	leaveRoom:function (name){
		if (this.prevRoom) {
			this.socket.leave(this.prevRoom)
			io.to(this.prevRoom).emit(
				'message', 
				UsersState.buildMsg(
					ADMIN, 
					`${name} has left the room`
				)
			)
			io.to(this.prevRoom).emit(
				'removePlayerFromRoom',
				{name:name}
			)
			this.socket.emit(
				'removePlayerFromRoom',
				{name:name}
			)
			this.updatePrevRoomUserList()
		}
	},
	updatePrevRoomUserList:function (){
		io.to(this.prevRoom).emit('userList', {
			users: UsersState.getUsersInRoom(this.prevRoom)
		})
	},
	init:function (socket){
		this.socket = socket
		console.log(`User ${socket.id} connected`)
		console.log('AllActiveRooms',UsersState.getAllActiveRooms())
		console.log('Users',UsersState.getUsers(socket.id))

		this.socket.emit(
			'message',
			UsersState.buildMsg(
				ADMIN,
				"Welcome to Chat App!"
			)
		)
	},
}
io.on('connection', (socket) => {
	socketing.init(socket)
	// Upon connection - only to user 

	socket.on('enterRoom', ({ name, room }) => {

		// leave previous room 
		socketing.prevRoom = UsersState.getUser(socket.id)?.room
		if (socketing.prevRoom) socketing.leaveRoom()

		socketing.user = UsersState.activateUser(socket.id, name, room)

		// join room 
		socket.join(socketing.user.room)
		
		// To user who joined 
		socket.emit('message', UsersState.buildMsg(ADMIN, `You have joined the ${socketing.user.room} chat room`))

		// send Welcome Paquet message
		socket.emit('welcome', {
			user:socketing.user,
			users:UsersState.getUsersInRoom(socketing.user.room)
		})
		
		// To everyone else 
		socket.broadcast.to(socketing.user.room).emit('message', UsersState.buildMsg(ADMIN, `${socketing.user.name} has joined the room`))

		// Update user list for room 
		io.to(socketing.user.room).emit('userList', {
			users: UsersState.getUsersInRoom(socketing.user.room)
		})

		// Update rooms list for everyone 
		io.emit('roomList', {
			rooms: UsersState.getAllActiveRooms()
		})
		// Update rooms list for everyone in the room
		io.to(socketing.user.room).emit('addPlayer', {
			rooms: UsersState.getAllActiveRooms()
		})
	})

	// newuserposition
	socket.on('newuserposition', (data) => {
		console.log('-----#------------------#---------------#---------------')
		const pos = {x:data.pos.x,y:data.pos.y,z:data.pos.z}
		UsersState.setUserPos(socket.id,pos)

		UsersState.users.forEach(element => {
	
			console.log(element.name,element.datas.pos)
		});










		
	})

	// When user disconnects - to all others 
	socket.on('disconnect', () => {
		const user = UsersState.getUser(socket.id)
		UsersState.userLeavesApp(socket.id)

		if (user) {
			io.to(user.room).emit('message', UsersState.buildMsg(ADMIN, `${user.name} has left the room`))

			io.to(user.room).emit('userList', {
				users: UsersState.getUsersInRoom(user.room)
			})

			io.emit('roomList', {
				rooms: UsersState.getAllActiveRooms()
			})
		}

		console.log(`User ${socket.id} disconnected`)
	})

	// Listening for a message event 
	socket.on('message', ({ name, text }) => {
		const room = UsersState.getUser(socket.id)?.room
		if (room) {
			io.to(room).emit('message', UsersState.buildMsg(name, text))
		}
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