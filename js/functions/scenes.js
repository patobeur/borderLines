import * as THREE from "three";
import { _cameras } from "./cameras.js";
export let _scene = {
	scene: null,
	renderer: null,
	_sets: null,
	//---------------
	cube: null,
	floor: null,
	_setThemAll: function () {
		this._sets = {
			scene: () => {
				this.scene = new THREE.Scene();
			},
			axesHelper: () => {
				// const axesHelper = new THREE.AxesHelper(1000);
				// axesHelper.position.set(0, 0, 0);
				// axesHelper.name = 'WorldAxessHelper';
				// this.scene.add(axesHelper);
			},
			floor: () => {
				// Ajouter un cube au milieu de la scène
				const floorGeometry = new THREE.BoxGeometry(11, 11, 0.1);
				const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xdedede });
				this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
				this.floor.position.set(0, 0, -.5)
				this.floor.name = 'floor';
				this.floor.castShadow = false;
				this.floor.receiveShadow = true;
				this.scene.add(this.floor);
			},
			floorGridHelper: () => {
				const size = 11;
				const divisions = 21;

				const gridHelper = new THREE.GridHelper(size, divisions);
				// gridHelper.name = 'floorgridHelper';
				gridHelper.rotateX(Math.PI / 2)
				this.scene.add(gridHelper);
			},
			player: () => {
				// le cube que tu déplace !
				let sizes = new THREE.Vector3(.5, .5, 1)
				const cubeGeometry = new THREE.BoxGeometry(sizes.x, sizes.y, sizes.z);
				const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
				this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
				this.cube.name = 'CUBE';
				this.cube.castShadow = true;
				this.cube.receiveShadow = true;
				this.cube.sizes = sizes
				this.cube.position.z = this.cube.sizes.z / 2
				this.cube.velocity = new THREE.Vector3(1, 0, 0)
				this.cube.speedRatio = .1
				this.cube.updt = function () {

					let minx = -5 - (this.sizes.x / 2), maxx = 5 + (this.sizes.x / 2);
					let miny = -5 - (this.sizes.y / 2), maxy = 5 + (this.sizes.y / 2);

					if (this.position.x > maxx && this.velocity.x > 0) this.velocity.x = -1;
					if (this.position.y > maxx && this.velocity.y > 0) this.velocity.y = -1;
					if (this.position.x < minx && this.velocity.x < 0) this.velocity.x = 1;
					if (this.position.y < minx && this.velocity.y < 0) this.velocity.y = 1;

					this.velocity.x = (this.position.x > maxx || this.position.x < minx)
						? this.velocity.x = (this.position.x > maxx) ? -1 : 1
						: 0;
					this.velocity.y = (this.position.y > maxx || this.position.y < minx)
						? this.velocity.y = (this.position.y > maxx) ? -1 : 1
						: 0;
						
					if (this.velocity.x != 0) {
						this.position.x += this.velocity.x * this.speedRatio;
					}
					if (this.velocity.y != 0) {
						this.position.y += this.velocity.y * this.speedRatio;
					}
				}
				this.scene.add(this.cube);
			},
			addMoreCubes: () => {
				let i = 0;
				[{ x: -5.25, y: -5.25, z: 0 }, { x: 5.25, y: 5.25, z: 0 }, { x: -5.25, y: 5.25, z: 0 }, { x: 5.25, y: -5.25, z: 0 },]
					.forEach(pos => {i++;this.addCubes(pos,i)});
			},
			sun: () => {
				let sunConfig = {
					name: 'soleil',
					color: 0xffffff,
					power: 1,
					position: new THREE.Vector3(0, 1, 2),
					rotation: new THREE.Vector3(0.2, 0.2, 0.2),
					size: (5, 16, 5),
					mat: {
						color: 0xFFFFFF00,
						emissive: 0xFFFFFF,
						emissiveIntensity: 2,
					}
				}


				// une spehre la ou est le soleil
				const sphereGeometry = new THREE.SphereGeometry(.3, 32, 32);
				const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFF00 });
				const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
				sphere.castShadow = false; //default is false
				sphere.receiveShadow = false; //default
				sphere.position.set(sunConfig.position.x, sunConfig.position.y, sunConfig.position.z);
				this.scene.add(sphere);


				this.Sun = new THREE.DirectionalLight(
					sunConfig.color,
					sunConfig.power
				);
				this.Sun.position.set(sunConfig.position.x, sunConfig.position.y, sunConfig.position.z);

				this.Sun.shadow.mapSize.width = 512; // default
				this.Sun.shadow.mapSize.height = 512; // default
				this.Sun.shadow.camera.near = 0.5; // default
				this.Sun.shadow.camera.far = 500; // default

				this.Sun.direction = { x: 0, y: 0, z: 0 }
				this.scene.add(this.Sun);

				// Add helper for the shadow camera
				// const helper = new THREE.CameraHelper(this.Sun.shadow.camera);
				// this.scene.add(helper);

				console.log('fff', this.Sun)

			},
			lights: () => {
				const ambient = new THREE.AmbientLight(0x555555, 1);
				this.scene.add(ambient);

				const pointLight2 = new THREE.PointLight(0xffffff, 1);
				pointLight2.position.set(2, 2, 3);
				this.scene.add(pointLight2);

				const pointLight = new THREE.PointLight(0xffffff, 1);
				pointLight.position.set(0, 100, 100);
				this.scene.add(pointLight);
			},
			renderer: () => {
				this.renderer = new THREE.WebGLRenderer({ antialias: true });
				this.renderer.shadowMap.enabled = true;
				this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
				this.renderer.setSize(window.innerWidth, window.innerHeight);
				this.renderer.setPixelRatio(devicePixelRatio);
				this.renderer.setClearColor(0xaaaaaa);
				document.body.appendChild(this.renderer.domElement);
			},
			cameras: () => {
				_cameras.init();
			},
		};
		for (const key in this._sets) {
			if (Object.hasOwnProperty.call(this._sets, key)) {
				this._sets[key](this);
			}
		}
	},
	addCubes: function (vector3,id) {
		// Encore un cube
		const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 5);
		const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
		let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

		cube.position.set(vector3.x, vector3.y, vector3.z)
		cube.name="Cube_"+id
		cube.velocity = new THREE.Vector3(0, 0, 0)
		cube.castShadow = true;
		cube.receiveShadow = true;
		this.scene.add(cube);
	},
	init: function () {
		this._setThemAll();
	},
};

