export const UsersState = {
	users: [],
	setUsers: function (newUsersArray) {
		this.users = newUsersArray
	},
	getTime: function(){
		return new Intl.DateTimeFormat('default', {
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric'
		}).format(new Date())
	},
	buildMsg: function (name, text) {
		return {
			name,
			text,
			time: this.getTime()
		}
	},
	activateUser: function (id, name, room) {
		let datas = {
			pos : {x:0,y:0,z:0},
			time : this.getTime()
		}
		const user = { id, name, room, datas}
		this.setUsers([
			...this.users.filter(user => user.id !== id),
			user
		])
		return user
	},
	userLeavesApp: function (id) {
		this.setUsers(
			this.users.filter(user => user.id !== id)
		)
	},
	getUser: function (id) {
		return this.users.find(user => user.id === id)
	},
	getUsersInRoom: function (room) {
		return this.users.filter(user => user.room === room)
	},
	getAllActiveRooms: function () {
		return Array.from(new Set(this.users.map(user => user.room)))
	}



}