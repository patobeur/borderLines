import * as THREE from "three";
import { _scene } from "./scenes.js";
import { Controls } from "./Controls.js";
export let _players = {
	player: null,
	players: {},
	counterPlayers: {},
	init: function (player,callBackFunction) {
		this.callBackFunction=callBackFunction
		this.addPlayer(player)
	},
	addPlayer: function (user) {
		let mesh = this.getACube(user)
		this.player = {
			user: user,
			mesh: mesh
		}
		console.log('------------------------------',user)
		this.player.mesh.futurPosition = new THREE.Vector3(0, 0, 0)
		this.player.mesh.checkControls = (Controls) => {
			if (Controls.left) this.player.mesh.futurPosition.x = this.player.mesh.position.x - this.player.mesh.speedRatio;
			if (Controls.right) this.player.mesh.futurPosition.x = this.player.mesh.position.x + this.player.mesh.speedRatio;
			if (Controls.up) this.player.mesh.futurPosition.y = this.player.mesh.position.y + this.player.mesh.speedRatio;
			if (Controls.down) this.player.mesh.futurPosition.y  = this.player.mesh.position.y - this.player.mesh.speedRatio;

			if (Controls.left || Controls.right || Controls.up || Controls.down){
				if(this.player.mesh.futurPosition != this.player.mesh.position){
					let minx = -(_scene.floor.size.x/2) + (this.player.mesh.size.x / 2);
					let maxx = (_scene.floor.size.x/2) - (this.player.mesh.size.x / 2);
					let miny = -(_scene.floor.size.y/2) - (this.player.mesh.size.y / 2);
					let maxy = (_scene.floor.size.y / 2) + (this.player.mesh.size.y / 2);
					if (!(this.player.mesh.futurPosition.x > maxx) &&
						!(this.player.mesh.futurPosition.x < minx) &&
						!(this.player.mesh.futurPosition.y > maxy) &&
						!(this.player.mesh.futurPosition.y < miny)) {
							this.player.mesh.update(this.player.mesh.futurPosition)
							this.callBackFunction.sendPlayerDatas(this.player.mesh.futurPosition)
					}
				}
			}
		}

	},
	addTeamMate: function (user) {
		console.log('user',user)
		let mesh = this.getACube(user)
		this.counterPlayers++
		this.players[user.id] = {
			user: user,
			mesh: mesh
		}
		_scene.scene.add(this.players[user.id].mesh);
	},
	getACube: function (user) {
		// let color = '0x' + user.couleur.substring(1)
		let color = user.couleur
		let size = new THREE.Vector3(.5, .5, .5)
		const cubeGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
		const cubeMaterial = new THREE.MeshPhongMaterial({ color: color });

		const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
		cube.name = 'CUBE_'+user.name;
		cube.size = size
		cube.position.z = cube.size.z / 2
		cube.velocity = new THREE.Vector3(1, 0, 0)
		cube.speedRatio = .1
		cube.hover = false

		cube.update = (pos) => {
			cube.position.copy(pos)
		}

		cube.castShadow = true;
		cube.receiveShadow = true;
		return cube
	},
}