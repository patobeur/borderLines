import * as THREE from "three";
import { _scene } from "./scenes.js";
import { _texturesLoader } from "./texturesLoader.js";
export let _model = {
	rotation: 0,
	on: false,
	color: 0x000000,
	models: {
		front: { shapetype: 'cube' },
		back: { shapetype: 'sphere' },
		support: { shapetype: 'capsule' },
	},
	MYMODEL: {
		datas: null
	},
	init: function (callBackFunction) {

		this.callBackFunction = callBackFunction
		this.addModel()
		this.frontclass = document.getElementById('frontclass')
		this.backclass = document.getElementById('backclass')
		this.supportclass = document.getElementById('supportclass')

		this.frontclass.addEventListener('click', (e) => {
			e.preventDefault()
			this.changeModel('front')
		})
		this.backclass.addEventListener('click', (e) => {
			e.preventDefault()
			this.changeModel('back')
		})
		this.supportclass.addEventListener('click', (e) => {
			e.preventDefault()
			this.changeModel('support')
		})

	},
	setModelColor: function (color) {
		this.color = color
		this.MYMODEL.mesh.material.color.set(this.color)
	},
	removeModel: function () {
		this.on = false
		this.MYMODEL.mesh.geometry.dispose();
		this.MYMODEL.mesh.material.dispose();
		_scene.scene.remove(this.MYMODEL.mesh);

	},
	changeModel: function (modelName = 'front') {
		this.on = false
		this.removeModel()
		this.addModel(modelName)
	},
	addModel: function (modelName = 'front') {
		this.on = true
		this.setShape(modelName)
		// this.MYMODEL.mesh=this.getACube()
		_scene.scene.add(this.MYMODEL.mesh);
	},
	getShapesDatas: function () {
		let mms = { x: 1, y: 1, z: 1 }
		const volume = mms.x * mms.y * mms.z;
		const radius = Math.cbrt(volume / (4 * Math.PI / 3)); // Calcul du rayon de la sphère équivalente
		let textures = {
			side: _texturesLoader.textures['support'].faces
		}
		let datas = {
			cube: {
				modelName: 'front',
				size: { x: mms.x + 0, y: mms.y + 0, z: mms.z + 0 },
				volume: volume + 0,
				radius: radius + 0,
				geometry: new THREE.BoxGeometry(mms.x, mms.y, mms.z),
				material: new THREE.MeshPhongMaterial({
					color: this.color,
					map: _texturesLoader.textures['front'].map
				}),
			},
			capsule: {
				modelName: 'support',
				size: { x: mms.x / 1.5, y: mms.y / 1.5, z: mms.z * 1.5 },
				volume: volume + 0,
				radius: (radius / 2) + 0,
				// CapsuleGeometry(radius : Float, length : Float, capSegments : Integer, radialSegments : Integer) 
				geometry: new THREE.CapsuleGeometry(radius / 1.5, radius, 8, 16),
				material: new THREE.MeshPhongMaterial({
					color: this.color,
					map: _texturesLoader.textures['support'].map,
				})
			},
			sphere: {
				modelName: 'back',
				size: { x: radius * 2, y: radius * 2, z: radius * 2 },
				volume: volume + 0,
				radius: radius + 0,
				// SphereGeometry(radius : Float, widthSegments : Integer, heightSegments : Integer, phiStart : Float, phiLength : Float, thetaStart : Float, thetaLength : Float) 
				geometry: new THREE.SphereGeometry(radius, 32, 16),
				// material: new THREE.MeshPhongMaterial({ color: this.color })
				material: new THREE.MeshPhongMaterial({
					color: this.color,
					map: _texturesLoader.textures['back'].map,
				})

			}
		}
		return datas
	},
	setShape: function (modelName = 'front') {

		this.MYMODEL.datas = this.getShapesDatas()[this.models[modelName].shapetype]

		this.MYMODEL.datas.shapetype = this.models[modelName].shapetype
		this.MYMODEL.datas.modelName = modelName


		this.MYMODEL.size = this.MYMODEL.datas.size

		this.MYMODEL.mesh = new THREE.Mesh(
			this.MYMODEL.datas.geometry,
			this.MYMODEL.datas.material
		);

		this.MYMODEL.mesh.material.map = _texturesLoader.textures[this.MYMODEL.datas.modelName].map


		this.MYMODEL.mesh.name = 'model_' + this.models[modelName].shapetype;
		this.MYMODEL.mesh.position.z = 0 + this.MYMODEL.datas.size.z / 2
		this.MYMODEL.mesh.position.y = -.5
		this.MYMODEL.mesh.rotation.x = (Math.PI / 2)
		// this.MYMODEL.mesh.hover = false
		this.MYMODEL.datas.hover = false

		this.MYMODEL.mesh.update = () => {
			this.rotation += 0.01
			this.MYMODEL.mesh.rotation.y = this.rotation
		}

		this.MYMODEL.mesh.castShadow = true;
		this.MYMODEL.mesh.receiveShadow = true;

		console.log('model.js setShape this.MYMODEL:', this.MYMODEL)
	},
	getFinallShape: function (user) {
		let modelName = user.datas.conf.modelName
		this.color = user.couleur
		modelName = user.datas.conf.modelName
		let shapetype = this.models[modelName].shapetype
		let datas = this.getShapesDatas()[shapetype]

		datas.modelName = modelName
		datas.shapetype = shapetype
		let mat = datas.material2
			? [datas.material, datas.material, datas.material2, datas.material, datas.material, datas.material]
			: datas.material;

		let mesh = new THREE.Mesh(
			datas.geometry,
			mat
		);

		if (datas.material2) {
			mesh.material.bumpMap = datas.material2
			mesh.material.bumpScale = 0.025
		}

		// mesh.material.map = _texturesLoader.textures[datas.modelName].map
		mesh.name = 'model_' + shapetype + '_' + datas.modelName;
		// mesh.hover = false
		datas.hover = false
		mesh.castShadow = true;
		mesh.receiveShadow = true;

		let model = {
			datas: datas,
			size: datas.size,
			mesh: mesh
		}
		return model
	},
}