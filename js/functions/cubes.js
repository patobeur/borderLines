import * as THREE from "three";
import { _scene } from "./scenes.js";
import { _cameras } from "./cameras.js";
import { _console } from "./console.js";
export let _cubes = {
	id: new Number(0),
	objects: {},
	counter:new Number(0),
	//---------------
	currentPack: null,
	missile: {
			type: "missile",
			radius: 12,
			size: { x: 0, y: 0, z: 0 },
			position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
			visual: { emoji: "🎱", radius: 30 },
			mass: 1 * Math.pow(10, 3),
			velocity: { x: 0, y: 0 },
			vitesse:0,
			success:{cur:new Number(0),need:new Number(1),done:false},
			autonomie:{cur:new Number(0),max:new Number(1000)},
			birthDate:new Date(),
	},
	// player:function(){
		
	// 	this.cube.updt = function () {

	// 		let minx = -5 - (this.sizes.x / 2), maxx = 5 + (this.sizes.x / 2);
	// 		let miny = -5 - (this.sizes.y / 2), maxy = 5 + (this.sizes.y / 2);

	// 		if (this.position.x > maxx && this.velocity.x > 0) this.velocity.x = -1;
	// 		if (this.position.y > maxx && this.velocity.y > 0) this.velocity.y = -1;
	// 		if (this.position.x < minx && this.velocity.x < 0) this.velocity.x = 1;
	// 		if (this.position.y < minx && this.velocity.y < 0) this.velocity.y = 1;

	// 		this.velocity.x = (this.position.x > maxx || this.position.x < minx)
	// 			? this.velocity.x = (this.position.x > maxx) ? -1 : 1
	// 			: 0;
	// 		this.velocity.y = (this.position.y > maxx || this.position.y < minx)
	// 			? this.velocity.y = (this.position.y > maxx) ? -1 : 1
	// 			: 0;
				
	// 		if (this.velocity.x != 0) {
	// 			this.position.x += this.velocity.x * this.speedRatio;
	// 		}
	// 		if (this.velocity.y != 0) {
	// 			this.position.y += this.velocity.y * this.speedRatio;
	// 		}
	// 	}
	// },
	add: function () {
		let datas = {
			velocity:new THREE.Vector3(0, 0, 0),
			position:new THREE.Vector3(3, -5, 4),
			speedRatio: .1,
			size: { x: 1, y: 1, z: 1 },
			mass: 1 * Math.pow(10, 3),
			birthDate:new Date(),
			name:"Cube_"+this.id,
			castShadow: true,
			receiveShadow: true,
		}

		const cubeGeometry= new THREE.BoxGeometry(datas.size.x, datas.size.y, datas.size.z);
		const cubeMaterial= new THREE.MeshBasicMaterial({ color: 0xff00ff })

		
		let groupe = new THREE.Group()	
		groupe.name="Grp_Cube_"+this.id	
		let cube = new THREE.Mesh(datas.cubeGeometry, datas.cubeMaterial);
		cube.name="Cube_"+this.id
		cube.castShadow = datas.castShadow ;
		cube.receiveShadow = datas.receiveShadow;
		groupe.castShadow = datas.castShadow ;
		groupe.receiveShadow = datas.receiveShadow;

		groupe.add(cube);
		_console.log(datas.position.x, datas.position.y, datas.size.z / 2)
		groupe.position.set(datas.position.x, datas.position.y, datas.size.z / 2)


		let pack = {
			datas:datas,
			groupe:groupe,
			cube:cube
		}


		this.objects[this.id] = pack
		if(this.currentPack===null) this.currentPack = pack
		this.id++
		this.counter++
		_scene.scene.add(pack.groupe);

	},
	init: function () {
		this.add();
	},
};

