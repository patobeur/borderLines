import * as THREE from "three";
import { _scene } from "./scenes.js";
export let _floors = {
	floor: {},
	init: function() {
		let cubeside = 10.5;
		let size = { x:10, y:10, z: 1 }
		const floorGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
		const floorMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
		// const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xdedede });

		this.floor = new THREE.Mesh(floorGeometry, floorMaterial);

		this.floor.position.set(0, 0, -.5)
		// this.floor.rotation.x = (Math.PI/2) 

		this.floor.size = {  x:size.x, y:size.y, z: size.z }
		// this.floor.position.z = -1
		this.floor.name = 'floor';
		this.floor.castShadow = true;
		this.floor.receiveShadow = true;
	},
	
			// floorGridHelper: () => {
			// 	const size = this.floor.size.x;
			// 	const divisions = this.floor.size.x / .5;

			// 	const gridHelper = new THREE.GridHelper(size, divisions);
			// 	// gridHelper.name = 'floorgridHelper';
			// 	gridHelper.rotateX(Math.PI / 2)
			// 	gridHelper.position.set(0, 0, .4)
			// 	this.scene.add(gridHelper);
			// },
};

