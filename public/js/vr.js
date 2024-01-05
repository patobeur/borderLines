import * as THREE from "three";
import { _renderer } from "./renderer.js";
import { _cameras } from "./cameras.js";
import { _scene } from "./scenes.js";
import { VRButton } from 'three/addons/webxr/VRButton.js';
export let _vr = {
	controller0:null,
	controller1:null,
	init:function () {
		
		// Turn on VR support
		_renderer.renderer.xr.enabled = true;

		this.setControllers()
		console.log('vr controllers ok')
	},
	setControllers:function () {
		this.controller0 = _renderer.renderer.xr.getController(0);
		this.controller1 = _renderer.renderer.xr.getController(1);
		this.controller0.addEventListener('select', this.onSelect0);
		this.controller1.addEventListener('select', this.onSelect1);
		_scene.scene.add(this.controller0);
		_scene.scene.add(this.controller1);

	},
	onselect01:function () {
		// select
	},
	onselect1:function () {
		// select
	},
	renderCamera:function(){
		_renderer.renderer.xr.updateCamera( _cameras.currentPack.camera );
	},
	addVRButton:function(){
		document.body.appendChild(VRButton.createButton(_renderer.renderer));
	}
};

