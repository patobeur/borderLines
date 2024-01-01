import { Game } from "./Game.js";
import { _console } from "./js/console.js";
import { _front } from "./js/front.js";
import { _names } from "./js/names.js";
import { _colors } from "./js/colors.js";
import { _players } from "./js/players.js";
import { _model } from "./js/models.js";
import { _texturesLoader } from "./js/texturesLoader.js";
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
	chatRoom: document.getElementById('room'),
	// sendForm: document.getElementById('formsender'),
	joinForm: document.getElementById('formjoin'),
	joinButtonA: document.getElementById('joina'),
	joinButtonB: document.getElementById('joinb'),
	joinButtonC: document.getElementById('joinc'),
	// ------------------------------------------------
	colorInput: document.getElementById('couleur'),
	nameInput: document.getElementById('name'),
	// name
	randomname: document.getElementById('randomname'),
	// color
	randomcolor: document.getElementById('randomcolor'),
	// models
	frontclass: document.getElementById('frontclass'),
	backclass: document.getElementById('backclass'),
	supportclass: document.getElementById('supportclass'),

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
				sendPlayerDatas: (player) => {
					console.log('sendPlayerDatas:player', player)
					let newPaquet = {
						name: player.user.name,
						id: player.user.id,
						pos: player.user.datas.pos,
						other:{x:1}
					}
					console.log('send to server', newPaquet)
					this.socket.emit('newuserposition', newPaquet)
					// console.log('this.socket.emit(',newPaquet)
				}
			}
		});
		_texturesLoader.init((callbackDatas)=>{
			console.log(callbackDatas)
			this.init2()
		})
	},
	//---------------------
	//---------------------
	init2: function () {
		_model.init();
		this.socketRun();
	},
	//---------------------
	//---------------------
	sendEnterRoom: function (room) {

		if (this.nameInput.value != '') {
			this.socket.emit('enterRoom', {
				name: this.nameInput.value,
				couleur: this.colorInput.value,
				room: room,
				datas:{modelName: _model.MYMODEL.datas.modelName}
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
		if (this.nameInput.value === '') this.nameInput.value = _names.getAName()

		let color = _colors.getAColor()
		_model.setModelColor(color.rgb);
		this.colorInput.value = color.hex;

		this.randomcolor.addEventListener('click', (e) => {
			let color = _colors.getAColor()
			_model.setModelColor(color.rgb)
			this.colorInput.value = color.hex
		});
		this.colorInput.addEventListener('input', ()=>{
			_model.setModelColor(this.colorInput.value)
		});
		this.randomname.addEventListener('click', (e) => {
			this.nameInput.value = _names.getAName()
		});






		// ecoute les envois de message
		this.sendForm.addEventListener('submit', (e) => {
			e.preventDefault()
			this.sendPlayerMessageToRoom()
		});
		this.joinForm.addEventListener('submit', (e) => {
			e.preventDefault()
		});
		this.joinButtonA.addEventListener('click', (e) => {
			e.preventDefault()
			if (this.nameInput.value != '') {
				this.sendEnterRoom('A')
			}
			else this.getAName()
		});
		this.joinButtonB.addEventListener('click', (e) => {
			e.preventDefault()
			if (this.nameInput.value != '') {
				this.sendEnterRoom('B')
			}
			else this.getAName()
		});
		this.joinButtonC.addEventListener('click', (e) => {
			e.preventDefault()
			if (this.nameInput.value != '') {
				this.sendEnterRoom('C')
			}
			else this.getAName()
		})
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
				console.log('-----####addNewUsers: -',this.user.name)
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
			console.log('user:',userPaquet)
			this.activity.textContent = `${userPaquet.name} is typing... `

			// Clear after 3 seconds 
			clearTimeout(this.activityTimer)
			this.activityTimer = setTimeout(() => {
				this.activity.textContent = ""
			}, 3000)
		})
		this.socket.on('updPlayerById', (datas) => {
			console.log('from server ', datas)
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
			_model.removeModel()
			this.usersOld = {}
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

			// initialization
			this.GAME.initPlayer(this.user)
		})
	}
}