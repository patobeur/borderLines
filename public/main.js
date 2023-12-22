const socket = io('ws://localhost:3500')

const messageContainer = document.getElementById('messagecontainer')
const usersList = document.getElementById('userscontainer')
const roomList = document.getElementById('roomscontainer')
const activity = document.getElementById('activity')
const msgInput = document.getElementById('message')
const nameInput = document.getElementById('name')
const chatRoom = document.getElementById('room')

const sendForm = document.getElementById('formsender')
const joinForm = document.getElementById('formjoin')

import { Game } from "./js/class/Game.js";

let GAME = new Game();
GAME.init();


function sendMessage(e) {
	e.preventDefault()
	if (nameInput.value && msgInput.value && chatRoom.value) {
		socket.emit('message', {
			name: nameInput.value,
			text: msgInput.value
		})
		msgInput.value = ""
	}
	msgInput.focus()
}


function enterRoom(e) {
	e.preventDefault()
	if (nameInput.value && chatRoom.value) {
		socket.emit('enterRoom', {
			name: nameInput.value,
			room: chatRoom.value
		})
	}
	msgInput.focus()
}

sendForm.addEventListener('submit', sendMessage)
joinForm.addEventListener('submit', enterRoom)

msgInput.addEventListener('keypress', () => {
	console.log(nameInput.value, "ca ecris")
	socket.emit('activity', nameInput.value)
})

//---------------------
// Listen for messages 
socket.on("message", (data) => {
	activity.textContent = ""
	const { name, text, time } = data
	

	let div = document.createElement('div')
	let paquetClass =''
	if (name === nameInput.value) paquetClass = ' own'
	if (name !== nameInput.value && name !== 'Admin') paquetClass = ' other'
	div.className = 'message'+paquetClass

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
	messageContainer.appendChild(div)

	messageContainer.scrollTop = messageContainer.scrollHeight
})

let activityTimer
socket.on("activity", (userPaquet) => {
	console.log(userPaquet.user.datas.pos)
	activity.textContent = `${userPaquet.name} is typing... `

	// Clear after 3 seconds 
	clearTimeout(activityTimer)
	activityTimer = setTimeout(() => {
		activity.textContent = ""
	}, 3000)
})

socket.on('userList', ({ users }) => {
	showUsers(users)
})
socket.on('addPlayer', (user) => {
	GAME.addPlayerCube({ x: 2, y: 2, z: 0 },'11111111111')
	console.log('addcube clicked')
})

socket.on('roomList', ({ rooms }) => {
	showRooms(rooms)
})

function showUsers(users) {
	usersList.textContent = ''
	if (users) {
		usersList.innerHTML = `<em>Users in ${chatRoom.value}:</em>`
		users.forEach((user, i) => {
			usersList.textContent += ` ${user.name}`
			if (users.length > 1 && i !== users.length - 1) {
				usersList.textContent += ","
			}
		})
	}
}

function showRooms(rooms) {
	roomList.textContent = ''
	if (rooms) {
		roomList.innerHTML = '<em>Active Rooms:</em>'
		rooms.forEach((room, i) => {
			roomList.textContent += ` ${room}`
			if (rooms.length > 1 && i !== rooms.length - 1) {
				roomList.textContent += ","
			}
		})
	}
}