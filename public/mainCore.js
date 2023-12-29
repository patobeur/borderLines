import { Game } from "./Game.js";
import { _console } from "./js/console.js";
import { _front } from "./js/front.js";
import { _players } from "./js/players.js";
export let Core = {
	GAME: new Game(),
	socket: false,
	user: false,
	users: {},
	rooms: {},
	activityTimer: false,
	//-----------------------------------------------------------
	messageContainer: document.getElementById('messagecontainer'),
	joinContainer: document.getElementById('joincontainer'),
	// senderContainer: document.getElementById('sendercontainer'),
	usersList: document.getElementById('userscontainer'),
	roomList: document.getElementById('roomscontainer'),
	activity: document.getElementById('activity'),
	// msgInput: document.getElementById('message'),
	nameInput: document.getElementById('name'),
	chatRoom: document.getElementById('room'),
	// sendForm: document.getElementById('formsender'),
	joinForm: document.getElementById('formjoin'),
	joinButtonA: document.getElementById('joina'),
	joinButtonB: document.getElementById('joinb'),
	joinButtonC: document.getElementById('joinc'),
	init(datas) {

		_console.init();
		this.senderContainer = _console.sendercontainer;
		this.msgInput = _console.messageInput;
		this.sendForm = _console.formsender;

		this.socket = datas.socket;
		this.GAME.init({
			// user: this.user,
			// users: this.users,
			// rooms: this.rooms,
			// socket: this.socket,
			callBackFunction: {
				sendPlayerDatas: (data) => {
					this.socket.emit('newuserposition', {
						name: this.user.name,
						pos: data
					})
				}
			}
		});
		this.socketRun();
	},
	//---------------------
	//---------------------
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
			console.log('----MESSAGE SENDED FROM ---------------', this.user.name)
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
	//---------------------
	//---------------------
	messageRecuConsole: function (message) {
		_console.log(`messageRecuConsole ${message}`)
	},
	addListener: function () {
		this.sendForm.addEventListener('submit', (e) => {
			e.preventDefault()
			this.sendPlayerMessageToRoom()
		}),
			this.joinForm.addEventListener('submit', (e) => {
				e.preventDefault()
			}),
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
	removeThreeUser: function (users = false) {
		console.log('removeThreeUser')
		for (const key in users) {
			if (Object.hasOwnProperty.call(users, key)) {
				const element = users[key];
				console.log(element)

			}
		}
	},
	refreshUsersListInRoom: function (users = false) {
		if (users) {
			this.usersList.textContent = ''
			this.users = users
			this.users.forEach((user, i) => {
				let name = user.name
				let classPlus = ''
				if (name === this.user.name) {
					classPlus = ' moi'
				}
				let userDiv = _front.createDiv({ tag: 'span', attributes: { className: 'player-span' + classPlus, textContent: name } })
				this.usersList.appendChild(userDiv)
			})
		}
	},
	removePlayerFromRoom: function (name) {
		console.log('---------------------------------------')
		console.log('remove player :', name)
	},
	refreshRoomsList: function (rooms) {
		this.rooms = rooms
		this.roomList.textContent = ''
		if (this.rooms) {
			this.rooms.forEach((room, i) => {
				let classPlus = ''
				if (room === this.user.room) {
					classPlus = ' moi'
				}
				let roomDiv = _front.createDiv({ tag: 'span', attributes: { className: 'room-span' + classPlus, textContent: room } })
				this.roomList.appendChild(roomDiv)
			})
			let icoDiv = _front.createDiv({ tag: 'span', attributes: { className: 'ico-span', textContent: 'R' } })
			this.roomList.appendChild(icoDiv)
		}
	},
	addNewUsers: function (users) {
		for (const key in users) {
			const user = users[key];
			if (user.id != this.user.id) {
				if (typeof this.GAME.users[user.id] === 'undefined') {
					this.GAME.addTeamPlayer(user)
				}
			}
		}
	},
	removeMissingUsers: function (users) {
		const usersById = {}
		users.forEach(element => {
			usersById[element.id] = element
		});
		let currentUsersInGame = this.GAME.users
		for (const key in currentUsersInGame) {
			const user = currentUsersInGame[key];
			if (this.user.id != user.id) {
				if (typeof usersById[user.id] === 'undefined') {
					this.GAME.removeTeamPlayer(user)
				}
			}
		}
	},
	socketRun: function () {
		this.addListener()
		//---------------------
		// requested from server
		//---------------------
		// Listen for message send
		this.socket.on("message", (data) => this.messageRecuConsole(data))

		this.socket.on("activity", (userPaquet) => {
			console.log(userPaquet)
			this.activity.textContent = `${userPaquet.name} is typing... `

			// Clear after 3 seconds 
			clearTimeout(this.activityTimer)
			this.activityTimer = setTimeout(() => {
				this.activity.textContent = ""
			}, 3000)
		})
		this.socket.on('updPlayerById', (datas) => {
			let { id, pos } = datas
			if (this.socket.id != id) {
				_players.players[id].mesh.update(pos)
			}
		})
		this.socket.on('updPlayerByName', (datas) => {
			let { name, pos } = datas
			console.log('move of ', name, pos)

		})

		this.socket.on('refreshRoomsList', ({ rooms }) => {
			this.refreshRoomsList(rooms)
		})

		this.socket.on('removePlayerFromRoom', ({ name }) => {
			this.removePlayerFromRoom(name)
		})

		this.socket.on('refreshUsersListInRoom', ({ users, message }) => {
			this.refreshUsersListInRoom(users)
			this.removeMissingUsers(users)
			this.addNewUsers(users)

			_console.log(message)
			this.usersOld = this.users

			// ????????????????
			// this.removeThreeUser(this.users)
		})
		this.socket.on('welcome', (paquet) => {
			this.usersOld = {}
			this.user = paquet.user
			this.users = paquet.users
			// this.refreshUsersListInRoom(this.users)
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

			// initialization
			this.GAME.initPlayer(this.user)
		})
	}
}