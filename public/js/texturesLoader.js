import * as THREE from "three";
import { _front } from "./front.js";
export const _texturesLoader = {
	textures: {},
	texturesDivByName: {},
	counter: 0,
	length: null,
	textureLoader: new THREE.TextureLoader(),
	files: [
		{ name: 'front', shapeType: 'cube',  path: './textures/', fileName: 'front.png'},
		{ name: 'back', shapeType: 'sphere', path: './textures/', fileName: 'back.png' },
		{ name: 'support', shapeType: 'capsule', path: './textures/', fileName: 'support.png' },
		// { name: 'side', path: './textures/', fileName: 'side.png' },
		// { name: 'top', path: './textures/', fileName: 'top.png' },
		// { name: 'Stone_Floor_Occlusion', path: './textures/stone/', fileName: 'Stylized_Stone_Floor_005_ambientOcclusion.jpg' },
		// { name: 'Stone_Floor_basecolor', path: './textures/stone/', fileName: 'Stylized_Stone_Floor_005_basecolor.jpg' },
		// { name: 'Stone_Floor_height', path: './textures/stone/', fileName: 'Stylized_Stone_Floor_005_height.png' },
		// { name: 'Stone_Floor_normal', path: './textures/stone/', fileName: 'Stylized_Stone_Floor_005_normal.jpg' },
		// { name: 'Stone_Floor_roughness', path: './textures/stone/', fileName: 'Stylized_Stone_Floor_005_roughness.jpg' },
	],
	init: function (callbackFunction) {
		this.callbackFunction = callbackFunction
		this.counter = 0
		this.length = this.files.length
		this.createModal()
		// Chargement des textures pour chaque objet
		this.files.forEach(file => {
			this.addToStack(file)
		});
	},
	checkEnd: function () {
		if (this.counter === this.length) {
			this.callbackFunction('FINITO textureLoader')
			this.clearModal()
		}
	},
	addToStack: function (file) {
		this.texturesDivByName[file.name] = _front.createDiv({
			tag: 'div',
			attributes: {
				className: 'texture-item texture-' + file.name,
				textContent: file.path + file.fileName
			},
			style: { width: '100%' }
		})

		this.modal.appendChild(this.texturesDivByName[file.name])

		this.loadTexture(file, (map) => {
			this.counter++;
			this.textures[file.name] = { map: map, name: file.name }
			console.log('texture loaded', file.fileName, this.counter + '/' + this.length)
			this.checkEnd()
		});
	},
	clearModal: function () {
		this.modal.remove()
		delete this.texturesDivByName
		delete this.modal
	},
	createModal: function () {
		console.log('attendues:', this.length)
		this.modal = _front.createDiv({
			tag: 'div',
			attributes: {
				className: 'textureloader'
			},
		})
		// for (let index = 0; index < this.length; index++) {

		// }
		this.css = `.textureloader{
			position:absolute;
			top:50%;
			left:50%;
			width: 200px;
			transform: translate( -50%, -50%);
			background-color:white;
			display:flex;
			justify-content:flex-start;
			align-item:center;
			flex-direction:column;
			.texture-item{
				background-color:pink;
				height: 25px;
				width:100%;
				padding:.5rem;
				margin-bottom:.2rem;
				overflow:hidden;
			}
		}`
		_front.addCss(this.css, 'textureloader')
		document.body.appendChild(this.modal)
	},
	loadTexture: function (file, callback) {
		// Chargement de la texture
		let fileurl = file.path + file.fileName
		this.textureLoader.load(
			fileurl,
			(texture) => {
				// La texture a été chargée avec succès !!!
				callback(texture);
			},
			(xhr) => {
				// Progression du chargement de la texture (optionnel)
				const percentLoaded = (xhr.loaded / xhr.total) * 100;
				this.texturesDivByName[file.name].style.width = (100 - percentLoaded) + '%'
				console.log('Texture chargée :' +`${percentLoaded}% ${file.fileName} `);
			},
			(error) => {
				// Gestion des erreurs
				console.error('Erreur de chargement de la texture :', error);
			}
		);
	},
};