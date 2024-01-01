import * as THREE from "three";
import { _scene } from "./scenes.js";
import { _model } from "./models.js";
import { Controls } from "./Controls.js";
export let _players = {
	models: {
		un: { name: 'un', size: { x: .5, y: .5, z: 1 } },
		deux: { name: 'deux', size: { x: 1, y: 1, z: 1 } },
		trois: { name: 'trois', size: { x: 1, y: 1, z: 1 } },
	},
	player: false,
	players: {},
	counterPlayers: {},
	init: function (user, callBackFunction) {
		this.callBackFunction = callBackFunction
		this.addPlayer(user)
	},
	addPlayer: function (user) {

		let mesh = this.getACube(user)
		this.player = {
			user: user,
			mesh: mesh
		}
		let pm = this.player.mesh
		pm.futurPosition = new THREE.Vector3(0, 0, 0)
		pm.checkControls = (Controls) => {
			if (Controls.left) pm.futurPosition.x = pm.position.x - pm.speedRatio;
			if (Controls.right) pm.futurPosition.x = pm.position.x + pm.speedRatio;
			if (Controls.up) pm.futurPosition.y = pm.position.y + pm.speedRatio;
			if (Controls.down) pm.futurPosition.y = pm.position.y - pm.speedRatio;

			if (Controls.left || Controls.right || Controls.up || Controls.down) {
				if (pm.futurPosition != pm.position) {
					let minx = -(_scene.floor.size.x / 2) + (pm.size.x / 2);
					let maxx = (_scene.floor.size.x / 2) - (pm.size.x / 2);
					let miny = -(_scene.floor.size.y / 2) - (pm.size.y / 2);
					let maxy = (_scene.floor.size.y / 2) + (pm.size.y / 2);
					if (!(pm.futurPosition.x > maxx) &&
						!(pm.futurPosition.x < minx) &&
						!(pm.futurPosition.y > maxy) &&
						!(pm.futurPosition.y < miny)) {

						// pm.update(pm.futurPosition)


						
			console.log('i move to ',pm.futurPosition)

			let posf = new THREE.Vector3(0, 0, 0)
			posf.copy(pm.futurPosition)
			pm.position.x = posf.x
			pm.position.y = posf.y
			pm.position.z = posf.z + (pm.size.z/2)



						this.player.user.datas.pos = pm.futurPosition
						// send to server
						// console.log('send callback ', this.player)
						this.callBackFunction.sendPlayerDatas(this.player)
					}
				}
			}
		}
		_scene.scene.add(pm);
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
		console.log(user)
		user.model = this.models['un']
		let mode = _model.getShape2(user.datas.conf.modelName)
		// let color = '0x' + user.couleur.substring(1)
		let color = user.datas.couleur
		let size = new THREE.Vector3(user.model.size.x, user.model.size.y, user.model.size.z)

		// const cubeGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
		// const cubeMaterial = new THREE.MeshPhongMaterial({ color: color });
		// const mesh = new THREE.Mesh(cubeGeometry, cubeMaterial);

		//CapsuleGeometry(radius : Float, length : Float, capSegments : Integer, radialSegments : Integer) 
		const capsgeometry = new THREE.CapsuleGeometry( .5, .5, 8, 16 ); 
		const capsmaterial = new THREE.MeshBasicMaterial( {color: color} ); 
		const mesh = new THREE.Mesh( capsgeometry, capsmaterial ); 

		mesh.name = 'CUBE_' + user.name;
		mesh.size = size
		mesh.position.z = mesh.size.z / 2
		//mesh.velocity = new THREE.Vector3(1, 0, 0)
		mesh.rotation.x = (Math.PI/2) 
		mesh.speedRatio = .1
		mesh.hover = false

		mesh.update = (pos) => {
			console.log('move',pos)
			let posf = new THREE.Vector3(0, 0, 0)
			posf.copy(pos)
			mesh.position.x = posf.x
			mesh.position.y = posf.y
			mesh.position.z = posf.z + (mesh.size.z/2)
		}

		mesh.castShadow = true;
		mesh.receiveShadow = true;
		return mesh
	},
}