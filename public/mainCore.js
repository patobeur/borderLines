import { Game } from "./js/class/Game.js";
export let Core = {
	GAME: new Game(),
	socket: false,
	user: false,
	users: false,
	rooms: false,
	activityTimer: false,
	//-----------------------------------------------------------
	messageContainer: document.getElementById('messagecontainer'),
	usersList: document.getElementById('userscontainer'),
	roomList: document.getElementById('roomscontainer'),
	activity: document.getElementById('activity'),
	msgInput: document.getElementById('message'),
	nameInput: document.getElementById('name'),
	chatRoom: document.getElementById('room'),
	sendForm: document.getElementById('formsender'),
	joinForm: document.getElementById('formjoin'),
	init(datas) {
		this.socket= datas.socket;
		this.GAME.init({
			user: this.user,
			users: this.users,
			rooms: this.rooms,
		});
		this.socketRun();
	},
	sendFirstMessage:function(data){
		
		activity.textContent = ""
		const { name, text, time } = data

		let div = document.createElement('div')
		let paquetClass = ''
		// if (name === this.user.name) paquetClass = ' own'
		// if (name !== this.user.name && name !== 'Admin') paquetClass = ' other'
		div.className = 'message' + paquetClass

		if (name !== 'Admin') {
			const paquet = document.createElement('div')
			paquet.className = 'message-paquet'

			const div2 = document.createElement('div')
			div2.className = 'message-author'


			const spanName = document.createElement('span')
			spanName.className = 'span-name'
			spanName.textContent = name
			const spanTime = document.createElement('span')
			spanTime.className = 'span-time'
			spanTime.textContent = time
			div2.appendChild(spanName)
			div2.appendChild(spanTime)

			paquet.appendChild(div2)

			const messagediv = document.createElement('div')
			messagediv.className = 'message-text'
			messagediv.textContent = text
			paquet.appendChild(messagediv)


			div.appendChild(paquet)






		} else {
			div.className = 'message admin'
		}
		this.messageContainer.appendChild(div)

		this.messageContainer.scrollTop = this.messageContainer.scrollHeight
	
	},
	addListener: function () {
		this.sendForm.addEventListener('submit', this.sendMessage)
		this.joinForm.addEventListener('submit', (e)=>{
			e.preventDefault()
			if (this.nameInput.value != '') {
				this.enterRoom()
			}
		})
		this.msgInput.addEventListener('keypress', () => {
			if(this.user.name){
				console.log(this.user.name, "ca ecris")
				this.socket.emit(
					'activity',
					this.user.name)
			}
		})
	},
	enterRoom:function () {
		if (this.nameInput.value != '') {
			console.log(this.nameInput.value+' entering room A')
			this.socket.emit('enterRoom', {
				name: this.nameInput.value,
				room: "A"
			})
		}
		this.msgInput.focus()
	},
	sendMessage: function (e) {
		e.preventDefault()
		if (this.nameInput.value != '' && this.msgInput.value !='' && this.user.room != false) {
			this.socket.emit('message', {
				name: this.nameInput.value,
				text: this.msgInput.value
			})
			this.msgInput.value = ""
		}
		this.msgInput.focus()
	},
	showUsers: function () {
		this.usersList.textContent = ''
		if (this.users != false) {
			this.usersList.innerHTML = `<em>Users in ${this.user.room}:</em>`
			this.users.forEach((user, i) => {
				this.usersList.textContent += ` ${this.user.name} ${this.user.datas.pos.x},${this.user.datas.pos.y},${this.user.datas.pos.z}`
				if (this.users.length > 1 && i !== this.users.length - 1) {
					this.usersList.textContent += ","
				}
			})
		}
	},
	showRooms: function (rooms) {
		this.rooms=rooms
		this.roomList.textContent = ''
		if (this.rooms) {
			this.roomList.innerHTML = '<em>Active Rooms:</em>'
			this.rooms.forEach((room, i) => {
				this.roomList.textContent += ` ${room}`
				if (this.rooms.length > 1 && i !== this.rooms.length - 1) {
					this.roomList.textContent += ","
				}
			})
		}
	},
	socketRun: function () {
		this.addListener()
		//---------------------
		// Listen for messages 
		this.socket.on("message", (data) => {
			this.sendFirstMessage(data)
		})

		// from server
		this.socket.on("activity", (userPaquet) => {
			console.log(userPaquet.user.datas.pos)
			this.activity.textContent = `${userPaquet.name} is typing... `

			// Clear after 3 seconds 
			clearTimeout(this.activityTimer)
			this.activityTimer = setTimeout(() => {
				this.activity.textContent = ""
			}, 3000)
		})

		this.socket.on('userList', ({ users }) => {
			this.showUsers()
		})
		// this.socket.on('addPlayer', (user) => {
		// 	GAME.addPlayerCube({ x: 2, y: 2, z: 0 },'11111111111')
		// 	console.log('addcube clicked')
		// })

		this.socket.on('roomList', ({ rooms }) => {

			this.showRooms(rooms)
		})

		this.socket.on('welcome', (paquet) => {
			this.user = paquet.user
			this.users = paquet.users
			this.nameValue = this.user.name
			this.chatRoomValue = this.user.room

			console.log('welcome ' + this.user.name, this.user.room)
			this.GAME.addPlayerCube({ x: 2, y: 2, z: 0 }, '11111111111')
			console.log('addcube clicked')
		})
	}
}