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
	ghostmesh:false,
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

		this.ghostmesh = this.player.mesh.clone()
		_scene.scene.add(this.ghostmesh)
		// this.ghostmesh.material.transparent = .5
		this.ghostmesh.material.opacity = 0.9;


		let pm = this.player.mesh
		let futur = new THREE.Vector3(0, 0, (this.player.user.size.z / 2)) //futur position
		let actual = this.player.mesh.position
		let speedRatio = this.player.mesh.speedRatio * .5

		this.player.mesh.checkControls = (Controls) => {
			// _movePlayer.move(this.player,Controls,this.callBackFunction)
			if (Controls.left) futur.x = actual.x - speedRatio;
			if (Controls.right) futur.x = actual.x + speedRatio;
			if (Controls.up) futur.y = actual.y + speedRatio;
			if (Controls.down) futur.y = actual.y - speedRatio;

			if (Controls.left || Controls.right || Controls.up || Controls.down) {
				let move = false
				if (futur != actual) {

					let futurPos = new THREE.Vector3(0, 0, 0)
					futurPos.copy(futur)



					let minx = -(_scene.floor.size.x / 2) + (this.player.user.size.x / 2)
					let maxx = (_scene.floor.size.x / 2) - (this.player.user.size.x / 2)
					let miny = -(_scene.floor.size.y / 2) + (this.player.user.size.y / 2)
					let maxy = (_scene.floor.size.y / 2) - (this.player.user.size.y / 2)

					if (
						(futur.x < maxx) &&
						(futur.x > minx)
					) {
						move = true
						this.ghostmesh.position.x = futurPos.x + 0
					}
					if (
						(futur.y < maxy) &&
						(futur.y > miny)
					) {
						move = true
						this.ghostmesh.position.y = futurPos.y + 0
					}



					let myMeshBoundingBox = new THREE.Box3().setFromObject(this.ghostmesh);

					if ( this.detectCollisions(myMeshBoundingBox) === false ) {
						if (move ) {
							console.log('move and sending pos', this.ghostmesh.position)
							this.player.mesh.position.copy(this.ghostmesh.position)

							this.player.user.datas.pos.x = this.ghostmesh.position.x + 0
							this.player.user.datas.pos.y = this.ghostmesh.position.y + 0
							this.player.user.datas.pos.z = this.ghostmesh.position.z - (this.player.user.size.z / 2)


							console.log(this.player.user.datas.pos)
							console.log(this.player.mesh.position)

							this.callBackFunction.sendPlayerDatas(this.player)
						}
					}
					else {
						// this.ghostmesh = this.player.mesh.clone()
						this.ghostmesh.position.copy(this.player.mesh.position)
						// this.player.mesh.position.copy(this.ghostmesh.position)
					}
				}
			}
		}
		_scene.scene.add(this.player.mesh);
	},
	addTeamMate: function (user) {
		console.log('addTeamMate', user.name, user)
		let mesh = this.getACube(user)
		mesh.checkmove = (datas) => {

		}
		this.counterPlayers++

		let group = new THREE.Group()
		group.add(mesh)

		this.players[user.id] = {
			user: user,
			mesh: mesh,
			group:group
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

		// mesh.bbbox = new THREE.Box3().setFromObject(mesh);
		// mesh.bbbox.copy( mesh.geometry.boundingBox ).applyMatrix4( mesh.matrixWorld );

		mesh.update = (pos) => {
			console.log('move', pos)
			let futurPos = new THREE.Vector3(0, 0, 0)
			futurPos.copy(pos)
			mesh.position.x = futurPos.x
			mesh.position.y = futurPos.y
			mesh.position.z = 0 + (user.size.z / 2)
			// mesh.bbbox.copy( mesh.geometry.boundingBox ).applyMatrix4( mesh.matrixWorld );
		}

		mesh.castShadow = true;
		mesh.receiveShadow = true;
		mesh.geometry.computeBoundingBox();
		return mesh
	},
	detectCollisions: function (myMeshBoundingBox) {

		
		// console.log('myMeshBoundingBox', this.player.mesh.bbbox)
		// console.log('bbbox', this.player.mesh.bbbox)

		let overLapping = false;

		for (const userId in this.players) {
			const player = this.players[userId];
			let otherMeshBoundingBox = new THREE.Box3().setFromObject(player.mesh);
			if (myMeshBoundingBox.intersectsBox(otherMeshBoundingBox)) {
				console.log("Collision détectée avec l'objet " + player.user.name);
				return true
			}
		}
		return overLapping

	}
}