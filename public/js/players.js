import * as THREE from "three";
import { _scene } from "./scenes.js";
import { _model } from "./models.js";
// import { _movePlayer } from "./movePlayer.js";
export let _players = {
	// models: {
	// 	un: { name: 'un'},
	// 	deux: { name: 'deux' },
	// 	trois: { name: 'trois' },
	// },
	player: false,
	players: {},
	counterPlayers: {},
	init: function (user, callBackFunction) {
		this.callBackFunction = callBackFunction
		this.addPlayer(user)
	},
	addPlayer: function (user) {

		let mesh = this.getACube(user)
		let group = new THREE.Group()
		group.add(mesh)
		this.player = {
			user: user,
			mesh: mesh,
			group: group
		}
		let pm = this.player.mesh
		let futur = new THREE.Vector3(0, 0, (this.player.user.size.z / 2)) //futur position
		let actual = pm.position
		let speedRatio = pm.speedRatio * .5
		// futur = new THREE.Vector3(0, 0, (this.player.user.size.z / 2))

		this.player.mesh.checkControls = (Controls) => {
			let move = false
			// _movePlayer.move(this.player,Controls,this.callBackFunction)
			if (Controls.left) futur.x = actual.x - speedRatio;
			if (Controls.right) futur.x = actual.x + speedRatio;
			if (Controls.up) futur.y = actual.y + speedRatio;
			if (Controls.down) futur.y = actual.y - speedRatio;

			if (Controls.left || Controls.right || Controls.up || Controls.down) {
				if (futur != actual) {
					console.log('----', this.player.user)

					let minx = -(_scene.floor.size.x / 2) + (this.player.user.size.x / 2)
					let maxx = (_scene.floor.size.x / 2) - (this.player.user.size.x / 2)
					let miny = -(_scene.floor.size.y / 2) + (this.player.user.size.y / 2)
					let maxy = (_scene.floor.size.y / 2) - (this.player.user.size.y / 2)

					let futurPos = new THREE.Vector3(0, 0, 0)
					futurPos.copy(futur)

					if (
						(futur.x < maxx) &&
						(futur.x > minx)
					) {
						move = true
						actual.x = futurPos.x + 0
						this.player.user.datas.pos.x = futurPos.x + 0
					}
					if (
						(futur.y < maxy) &&
						(futur.y > miny)
					) {
						move = true
						actual.y = futurPos.y + 0
						this.player.user.datas.pos.y = futurPos.y + 0
						// send to server
						// console.log('send callback ', this.player)
					}
					if (move) {
						console.log('i move to ', futur)
						this.callBackFunction.sendPlayerDatas(this.player)
					}
				}
			}
		}
		_scene.scene.add(this.player.mesh);
	},
	addTeamMate: function (user) {
		console.log('user', user)
		let mesh = this.getACube(user)
		mesh.checkmove = (datas) => {

		}
		this.counterPlayers++
		this.players[user.id] = {
			user: user,
			mesh: mesh
		}
		_scene.scene.add(this.players[user.id].mesh);
	},
	getACube: function (user) {
		// console.log('getACube',user)
		let model = _model.getFinallShape(user)

		const mesh = model.mesh

		mesh.name = 'CUBE_' + user.name;

		user.size = model.size

		// mesh.position.z = model.size.z / 2
		mesh.position.z = user.datas.pos.z + (user.size.z / 2)
		mesh.position.x = user.datas.pos.x
		mesh.position.y = user.datas.pos.y
		//mesh.velocity = new THREE.Vector3(1, 0, 0)

		mesh.rotation.x = (Math.PI / 2)
		mesh.speedRatio = .1
		mesh.hover = false

		mesh.update = (pos) => {
			console.log('move', pos)
			let futurPos = new THREE.Vector3(0, 0, 0)
			futurPos.copy(pos)
			mesh.position.x = futurPos.x
			mesh.position.y = futurPos.y
			mesh.position.z = 0 + (user.size.z / 2)
		}

		mesh.castShadow = true;
		mesh.receiveShadow = true;
		return mesh
	},
}