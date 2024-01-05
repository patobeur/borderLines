import * as THREE from "three";
export let _renderer = {
	renderer:null,
	init:function () {
		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
		});

		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

		// Set background color.
		this.renderer.setClearColor(0x000010, 1.0);

		document.body.appendChild(this.renderer.domElement);

		console.log('renderer ok')
	},
};

