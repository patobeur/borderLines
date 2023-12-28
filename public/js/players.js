import * as THREE from "three";
import { _scene } from "./scenes.js";
export let _players = {
	player: null,
	players: {},
	counterPlayers: {},
	init: function (player) {
		this.player = player

	},
	addTeamMate: function (user) {
		let size = new THREE.Vector3(.5, .5, .5)
		const cubeGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
		const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x00FF00 });

		const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
		cube.name = 'CUBE';
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

		this.counterPlayers++
		this.players[user.id] = {
			user:user,
			mesh:cube
		}
		_scene.scene.add(this.players[user.id].mesh);
	},
}