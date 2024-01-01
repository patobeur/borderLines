import * as THREE from "three";
import { _scene } from "./scenes.js";
export let _model = {
	on: false,
	color: 0x000000,
	models: {
		front: {
			shapetype: 'cube'
		},
		back: {
			shapetype: 'sphere'
		},
		support: {
			shapetype: 'capsule'
		},
	},
	model: {
		datas: null,
		size: { x: .5, y: .5, z: .5 },
		// mesh: null,
	},
	init: function (callBackFunction) {

		this.callBackFunction = callBackFunction
		this.addModel()
		this.frontclass= document.getElementById('frontclass')
		this.backclass= document.getElementById('backclass')
		this.supportclass= document.getElementById('supportclass')
		
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
		this.model.mesh.material.color.set(this.color)
	},
	removeModel: function () {
		this.on = false
		this.model.mesh.geometry.dispose();
		this.model.mesh.material.dispose();
		_scene.scene.remove(this.model.mesh);

	},
	changeModel: function (modelName = 'front') {
		this.removeModel()
		this.addModel(modelName)
	},
	addModel: function (modelName = 'front') {
		this.on = true
		this.setShape(modelName)
		// this.model.mesh=this.getACube()
		_scene.scene.add(this.model.mesh);
	},
	getShapesDatas: function () {
		const size = this.model.size
		const volume = size.x * size.y * size.z;
		const radius = Math.cbrt(volume / (4 * Math.PI / 3)); // Calcul du rayon de la sphère équivalente
		let datas = {
			cube: {
				class:'front',
				size: { x: size.x, y: size.y, z: size.z },
				radius: radius,
				geometry: new THREE.BoxGeometry(size.x, size.y, size.z),
				material: new THREE.MeshPhongMaterial({ color: this.color })
			},
			capsule: {
				class:'support',
				size: { x: size.x, y: size.y, z: size.z },
				radius: radius,
				// CapsuleGeometry(radius : Float, length : Float, capSegments : Integer, radialSegments : Integer) 
				geometry: new THREE.CapsuleGeometry(radius, size.y, 8, 16),
				material: new THREE.MeshPhongMaterial({ color: this.color })
			},
			sphere: {
				class:'back',
				size: { x: radius * 2, y: radius * 2, z: radius * 2 },
				radius: radius,
				// SphereGeometry(radius : Float, widthSegments : Integer, heightSegments : Integer, phiStart : Float, phiLength : Float, thetaStart : Float, thetaLength : Float) 
				geometry: new THREE.SphereGeometry(radius, 32, 16),
				material: new THREE.MeshPhongMaterial({ color: this.color })
			}
		}
		return datas
	},
	setShape: function (modelName) {
		
		this.model.datas = this.getShapesDatas()[this.models[modelName].shapetype]

		this.model.datas.shapetype = this.models[modelName].shapetype
		// this.model.datas.class = this.models[modelName].class
		this.model.datas.modelName = modelName


		console.log('this.model:', this.model)

		this.model.mesh = new THREE.Mesh(
			this.model.datas.geometry,
			this.model.datas.material
		);

		this.model.mesh.name = 'model_' + this.models[modelName].shapetype;
		this.model.mesh.position.z = 0 + this.model.datas.size.z / 2
		this.model.mesh.position.y = -.5
		this.model.mesh.rotation.x = (Math.PI / 2)
		// this.model.mesh.hover = false
		this.model.datas.hover = false

		this.model.mesh.update = () => {
			this.model.mesh.rotation.y += 0.01
		}

		this.model.mesh.castShadow = true;
		this.model.mesh.receiveShadow = true;
	},
	getShape2: function (modelName) {
		let shapetype = this.models[modelName].shapetype
		let xxxdatas = this.getShapesDatas()[shapetype]

		console.log('en prepa', xxxdatas)
		
	},
}