import * as THREE from "three";
import { _scene } from "./scenes.js";
export let _soleil = {
	sun:null,
	sunGroupe:null,
	floorSize:null,
	config: {
		name: 'soleil',
		color: 0xffffff,
		power: 1,
		position: null,
		size: {x:.5, y:.5, z:.5},
		rotationSpeed:0.0001,
		mat: {
			color: 0xFFFFFF00,
			emissive: 0xFFFFFF,
			emissiveIntensity: 2,
		}
	},
	add: function () {
		this.config.position = new THREE.Vector3(
			this.floorSize.x/2,
			this.floorSize.y/2,
			this.floorSize.x/2
		)
		this.groupe = new THREE.Group()
		this.groupe.name = 'grp_sun'
		this.groupe.position.set(
			this.config.position.x - (this.config.size.x/2),
			this.config.position.y - (this.config.size.y/2),
			this.config.position.z - (this.config.size.x/2),
		);
		// -------------------------------------------------
		// une sphere là ou est le soleil
		const sphereGeometry = new THREE.SphereGeometry(this.config.size.x, 32, 32);
		const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFF00, transparent:true, opacity:.5 });
		const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
		this.groupe.add(sphere);
		// une autre sphere pour le soleil
		const soleilGeometry = new THREE.SphereGeometry(this.config.size.x*.6, 16, 16);
		const soleilMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00});
		const soleilAvatar = new THREE.Mesh(soleilGeometry, soleilMaterial);
		this.groupe.add(soleilAvatar);
		
		// -------------------------------------------------
		// le vrai soleil
		this.sun = new THREE.DirectionalLight(
			this.config.color,
			this.config.power
		);
		this.sun.shadow.mapSize.width = 512; // default
		this.sun.shadow.mapSize.height = 512; // default
		this.sun.shadow.camera.near = 0.5; // default
		this.sun.shadow.camera.far = 500; // default
		this.sun.name = 'sun'

		// this.sun.direction = { x: 0, y: 0, z: 0 }
		this.groupe.add(this.sun);

		this.sun.castShadow = true;
		this.sun.receiveShadow = false;

		
		
		// Add helper for the shadow camera
		// const helper = new THREE.CameraHelper(this.sun.shadow.camera);
		// this.scene.add(helper);
		

		
		console.log('__________________________________________________________')
		
		console.log('this.groupe.position', this.groupe.position)
		console.log('this.sun.position', this.sun.position)

		_scene.scene.add(this.groupe);

	},
	rotation(centerV3=(0,0,0)) {

		var center = new THREE.Vector3(centerV3)
	
		var relative = new THREE.Vector3(
			this.groupe.position.x - center.x,
			this.groupe.position.y - center.y,
			this.groupe.position.z - center.z
		);
	

		var newPos = new THREE.Vector3(
			relative.x * Math.cos(this.config.rotationSpeed) - relative.z * Math.sin(this.config.rotationSpeed),
			relative.y * Math.cos(this.config.rotationSpeed) + relative.x * Math.sin(this.config.rotationSpeed),
			relative.x * Math.sin(this.config.rotationSpeed) + relative.z * Math.cos(this.config.rotationSpeed)
		);
		this.groupe.position.x = newPos.x + center.x;
		this.groupe.position.y = newPos.y + center.y;
		this.groupe.position.z = newPos.z + center.z;
	},
	init: function (floorsize) {
		this.floorSize = floorsize
		this.add();
	},
};

