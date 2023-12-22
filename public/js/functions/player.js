import * as THREE from "three";
import { _scene } from "./scenes.js";
export let player= () => {
	// le cube que tu déplace !
	let size = new THREE.Vector3(.5, .5, 1)
	const cubeGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
	// const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
	const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
	this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
	this.cube.name = 'CUBE';
	this.cube.size = size
	this.cube.position.z = this.cube.size.z / 2
	this.cube.velocity = new THREE.Vector3(1, 0, 0)
	this.cube.speedRatio = .1
	this.cube.hover = false
	this.cube.futurPosition = new THREE.Vector3(0, 0, 0)
	this.cube.checkControls = (Controls) => {
		
		// this.cube.futurPosition.copy(this.cube.position)
		if (Controls.left) this.cube.futurPosition.x = this.cube.position.x - this.cube.speedRatio;
		if (Controls.right) this.cube.futurPosition.x = this.cube.position.x + this.cube.speedRatio;
		if (Controls.up) this.cube.futurPosition.y = this.cube.position.y + this.cube.speedRatio;
		if (Controls.down) this.cube.futurPosition.y  = this.cube.position.y - this.cube.speedRatio;

		if(this.cube.futurPosition != this.cube.position){
			let minx = -(this.floor.size.x/2) + (this.cube.size.x / 2);
			let maxx = (this.floor.size.x/2) - (this.cube.size.x / 2);
			let miny = -(this.floor.size.y/2) - (this.cube.size.y / 2);
			let maxy = (this.floor.size.y / 2) + (this.cube.size.y / 2);
			if (!(this.cube.futurPosition.x > maxx) &&
				!(this.cube.futurPosition.x < minx) &&
				!(this.cube.futurPosition.y > maxy) &&
				!(this.cube.futurPosition.y < miny)) {
					this.cube.updt()
				}
		}
		
		// if (Controls.space) this.cube.futurPosition.z += this.cube.speedRatio;
	};
	this.cube.updt = () => {
		this.cube.position.copy(this.cube.futurPosition)
	}
	this.cube.castShadow = true;
	this.cube.receiveShadow = true;
	this.scene.add(this.cube);
}