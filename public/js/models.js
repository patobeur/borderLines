import * as THREE from "three";
import { _scene } from "./scenes.js";
export let _model = {
	on: false,
	color: 0xff0000,
	models: {
		un: { name: 'un', size: { x: .5, y: .5, z: .5 } },
		deux: { name: 'deux', size: { x: 1, y: 1, z: 1 } },
		trois: { name: 'trois', size: { x: 1, y: 1, z: 1 } },
	},
	model: false,
	init: function (callBackFunction) {
		this.model = this.models['un']

		this.callBackFunction = callBackFunction
		this.addModel()
	},
	setModelColor: function (color) {
		this.color = color
		this.model.mesh.material.color.set(this.color)
	},
	removeModel: function () {
		this.on = false
		this.model.mesh.geometry.dispose();
		this.model.mesh.material.dispose();
		_scene.scene.remove(this.model.mesh);

	},
	addModel: function () {
		this.on = true
		let mesh = this.getACube()
		this.model = {
			mesh: mesh
		}
		_scene.scene.add(this.model.mesh);
	},
	getACube: function () {
		// let color = '0x' + user.couleur.substring(1)
		let size = new THREE.Vector3(1, 1, 1)
		const cubeGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
		const cubeMaterial = new THREE.MeshPhongMaterial({ color: this.color });

		const mesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
		mesh.name = 'CUBE_model';
		mesh.size = size
		mesh.position.z = mesh.size.z / 2
		mesh.position.y = -.5
		mesh.hover = false

		mesh.update = () => {
			// let posf = new THREE.Vector3(0,0,0)
			// posf.copy(pos)
			mesh.rotation.z += 0.01
			// mesh.position.y=posf.y
			// mesh.position.z=posf.z
		}

		mesh.castShadow = true;
		mesh.receiveShadow = true;
		return mesh
	},
}