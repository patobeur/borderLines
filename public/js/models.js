import * as THREE from "three";
import { _scene } from "./scenes.js";
export let _model = {
	rotation:0,
	on: false,
	color: 0x000000,
	models: {
		front: {shapetype: 'cube'},
		back: {shapetype: 'sphere'},
		support: {shapetype: 'capsule'},
	},
	MYMODEL: {
		datas: null,
		size: { x:1, y:1, z: 1 },
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
		const size = this.MYMODEL.size
		const volume = size.x * size.y * size.z;
		const radius = Math.cbrt(volume / (4 * Math.PI / 3)); // Calcul du rayon de la sphère équivalente
		let datas = {
			cube: {
				modelName:'front',
				size: { x: size.x, y: size.y, z: size.z },
				radius: radius,
				geometry: new THREE.BoxGeometry(size.x, size.y, size.z),
				material: new THREE.MeshPhongMaterial({ color: this.color })
			},
			capsule: {
				modelName:'support',
				size: { x: size.x, y: size.y, z: size.z },
				radius: radius,
				// CapsuleGeometry(radius : Float, length : Float, capSegments : Integer, radialSegments : Integer) 
				geometry: new THREE.CapsuleGeometry(radius, size.y, 8, 16),
				material: new THREE.MeshPhongMaterial({ color: this.color })
			},
			sphere: {
				modelName:'back',
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
		
		this.MYMODEL.datas = this.getShapesDatas()[this.models[modelName].shapetype]

		this.MYMODEL.datas.shapetype = this.models[modelName].shapetype
		this.MYMODEL.datas.modelName = modelName


		this.MYMODEL.size=this.MYMODEL.datas.size
		
		console.log('this.MYMODEL:', this.MYMODEL)

		this.MYMODEL.mesh = new THREE.Mesh(
			this.MYMODEL.datas.geometry,
			this.MYMODEL.datas.material
		);

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
		
	},
	getFinallShape: function (modelName,user) {
		this.color = user.couleur
		let shapetype = this.models[modelName].shapetype
		let datas = this.getShapesDatas()[shapetype]
		datas.modelName = modelName



		let mesh = new THREE.Mesh(
			datas.geometry,
			datas.material
		);
		
		mesh.name = 'model_' + shapetype + '_' + modelName;
		// mesh.hover = false
		datas.hover = false
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		
		let model = {
			datas:datas,
			size:datas.size,
			mesh:mesh
		}
		return model
	},
}