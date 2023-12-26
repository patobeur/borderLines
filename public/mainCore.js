import { Game } from "./js/Game.js";
import { _console } from "./js/console.js";
import { _front } from "./js/front.js";
export let Core = {
	GAME: new Game(),
	socket: false,
	user: false,
	users: false,
	rooms: false,
	activityTimer: false,
	//-----------------------------------------------------------
	messageContainer: document.getElementById('messagecontainer'),
	joinContainer: document.getElementById('joincontainer'),
	senderContainer: document.getElementById('sendercontainer'),
	usersList: document.getElementById('userscontainer'),
	roomList: document.getElementById('roomscontainer'),
	activity: document.getElementById('activity'),
	msgInput: document.getElementById('message'),
	nameInput: document.getElementById('name'),
	chatRoom: document.getElementById('room'),
	sendForm: document.getElementById('formsender'),
	joinForm: document.getElementById('formjoin'),
	joinButtonA: document.getElementById('joina'),
	joinButtonB: document.getElementById('joinb'),
	joinButtonC: document.getElementById('joinc'),
	init(datas) {
		this.socket = datas.socket;
		this.GAME.init({
			user: this.user,
			users: this.users,
			rooms: this.rooms,
			socket: this.socket,
			callBackFunction: {
				sendPlayerDatas: (data) => {
					this.sendPos(data)
				}
			}
		});
		this.socketRun();
	},
	// messageRecu1: function (data) {
	// 	console.log(data)
	// 	activity.textContent = ""
	// 	const { name, text, time, room } = data
	// 	_console.log(`[${time}][${room}][${name}] ${text}`)
	// },
	messageRecu: function (message) {
		_console.log(`${message}`)

		// let div = document.createElement('div')
		// let paquetClass = ''

		// if (name === this.user.name) paquetClass = ' own'
		// if (name !== this.user.name && name !== 'Admin') paquetClass = ' other'

		// div.className = 'message' + paquetClass

		// const paquet = document.createElement('div')
		// paquet.className = 'message-paquet'

		// const div2 = document.createElement('div')
		// div2.className = 'message-author'

		// const spanName = document.createElement('span')
		// spanName.className = 'span-name'
		// spanName.textContent = name
		// const spanTime = document.createElement('span')
		// spanTime.className = 'span-time'
		// spanTime.textContent = time
		// div2.appendChild(spanName)
		// div2.appendChild(spanTime)

		// paquet.appendChild(div2)

		// const messagediv = document.createElement('div')
		// messagediv.className = 'message-text'
		// messagediv.textContent = text
		// paquet.appendChild(messagediv)

		// div.appendChild(paquet)

		// // if (name !== 'Admin') {
		// // } else {
		// // 	div.className = 'message admin'
		// // }
		// this.messageContainer.appendChild(div)

		// this.messageContainer.scrollTop = this.messageContainer.scrollHeight


	},
	addListener: function () {
		this.sendForm.addEventListener('submit', (e) => {
			e.preventDefault()
				this.sendPlayerMessageToRoom()
		}),
		this.joinForm.addEventListener('submit', (e) => {
			e.preventDefault()
		}),
		// this.joinForm.addEventListener('submit', (e) => {
		// 	e.preventDefault()
		// 	console.log(e.target)
		// 	if (this.nameInput.value != '') {
		// 		this.sendEnterRoom()
		// 	}
		// }),
		this.joinButtonA.addEventListener('click', (e) => {
			e.preventDefault()
			if (this.nameInput.value != '') {
				this.sendEnterRoom('A')
			}
		}),
		this.joinButtonB.addEventListener('click', (e) => {
			e.preventDefault()
			if (this.nameInput.value != '') {
				this.sendEnterRoom('B')
			}
		}),
		this.joinButtonC.addEventListener('click', (e) => {
			e.preventDefault()
			if (this.nameInput.value != '') {
				this.sendEnterRoom('C')
			}
		})
		// this.msgInput.addEventListener('keypress', () => {
		// 	if (this.user.name) {
		// 		console.log(this.user.name, "ca ecris")

		// 		this.socket.emit(
		// 			'activity',
		// 			this.user.name)
		// 	}
		// })
	},
	sendPos: function (data) {	
		// if (this.user.name) {
			this.socket.emit('newuserposition', {
				name:this.user.name,
				pos: data
			})
		// }
	},
	sendEnterRoom: function (room) {
		if (this.nameInput.value != '') {
			this.socket.emit('enterRoom', {
				name: this.nameInput.value,
				room: room
			})
		}
		this.msgInput.focus()
	},
	sendPlayerMessageToRoom: function () {
		if (this.user.name && this.msgInput.value != '' && this.user.room != false) {
			console.log('----MESSAGE SENDED FROM ---------------',this.user.name)
			console.log(this.user)
			this.socket.emit('sendPlayerMessageToRoom', {
				name: this.user.name,
				text: this.msgInput.value,
				room: this.user.room
			})
			this.msgInput.value = ""
			this.msgInput.focus()
		}
	},
	showUsers: function () {
		this.usersList.textContent = ''
		if (this.users != false) {
				this.usersList.textContent=''
			this.users.forEach((user, i) => {
				let userDiv = _front.createDiv({tag:'span',attributes:{className:'player-span',textContent:user.name}})
				this.usersList.appendChild(userDiv)
			})
		}
	},
	removePlayerFromRoom: function (name) {
		console.log('---------------------------------------')
		console.log('remove player :',name)
	},
	showRooms: function (rooms) {
		this.rooms = rooms
			this.roomList.textContent = ''
		if (this.rooms) {
			this.rooms.forEach((room, i) => {
				let roomDiv = _front.createDiv({tag:'span',attributes:{className:'room-span',textContent:room}})
				this.roomList.appendChild(roomDiv)
			})
			let icoDiv = _front.createDiv({tag:'span',attributes:{className:'ico-span',textContent:'R'}})
			this.roomList.appendChild(icoDiv)
		}
	},
	socketRun: function () {
		this.addListener()
		//---------------------
		// requested from server
		//---------------------
		// Listen for message send
		this.socket.on("message", (data) => this.messageRecu(data))

		this.socket.on("activity", (userPaquet) => {
			console.log(userPaquet)
			this.activity.textContent = `${userPaquet.name} is typing... `

			// Clear after 3 seconds 
			clearTimeout(this.activityTimer)
			this.activityTimer = setTimeout(() => {
				this.activity.textContent = ""
			}, 3000)
		})
		this.socket.on('updPlayerByName', (datas) => {
			let {name, pos} = datas
			console.log('move of ',name,pos)
		})
		this.socket.on('userList', ({ users, message }) => {
			this.users = users
			console.log(this.users)
			this.showUsers()
		})
		// this.socket.on('addPlayer', (user) => {
		// 	GAME.addPlayerCube({ x: 2, y: 2, z: 0 },'11111111111')
		// 	console.log('addcube clicked')
		// })

		this.socket.on('roomList', ({ rooms }) => {
			this.showRooms(rooms)
		})

		this.socket.on('removePlayerFromRoom', ({ name }) => {
			console.log('-----------removePlayerFromRoom-------------------',name)
			this.removePlayerFromRoom(name)
		})

		this.socket.on('welcome', (paquet) => {
			this.user = paquet.user
			this.users = paquet.users
			const log = paquet.message


// let newpaquet = {
// 	name:this.user.name,
// 	text:paquet.message,
// 	time:paquet.datas.name,
// 	room:this.user.room,
// }
this.joinContainer.classList.add('ok')
this.joinContainer.remove()
_console.log(log)
// 			this.messageRecu1(newpaquet)

			console.log('welcome ' + this.user.name, this.user.room)
			console.log('welcome2 paquet ',paquet)

			// initialization
			this.GAME.initPlayer(this.user)
		})
	}
}