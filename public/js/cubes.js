import * as THREE from "three";
import { _scene } from "./scenes.js";
// import { _cameras } from "./cameras.js";
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
	add: function () {
		let datas = {
			velocity:new THREE.Vector3(0, 0, 0),
			position:new THREE.Vector3(0, 0, 0),
			speedRatio: .1,
			size: { x: .5, y: .5, z: .5 },
			mass: 1 * Math.pow(10, 3),
			birthDate:new Date(),
			name:"cube",
			castShadow: true,
			receiveShadow: true,
		}

		const cubeGeometry= new THREE.BoxGeometry(datas.size.x, datas.size.y, datas.size.z);
		const cubeMaterial= new THREE.MeshPhongMaterial({ color: 0xff00ff })

		
		let groupe = new THREE.Group()
		groupe.name="Grp_"+datas.name+"_"+this.id

		let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

		cube.name= datas.name + this.id
		// cube.direction= new THREE.Vector3(0, 1, 0),
		cube.castShadow = datas.castShadow ;
		cube.receiveShadow = datas.receiveShadow;

		groupe.castShadow = datas.castShadow ;
		groupe.receiveShadow = datas.receiveShadow;

		groupe.add(cube);

		groupe.position.set(datas.position.x, datas.position.y,datas.position.z+(datas.size.z/2))
		// groupe.position.set(datas.position.x+(datas.size.x/2), datas.position.y-(datas.size.y/2),datas.position.z-(datas.size.z/2))
		_console.log(groupe.position.x, groupe.position.y, groupe.position.z)


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
		_console.log(pack.groupe.name)

	},
	init: function () {
		this.add();
	},
};

