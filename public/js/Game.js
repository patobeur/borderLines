import * as THREE from "three";
import { _console } from "./console.js";
import { _soleil } from "./soleil.js";
// class
// later
// import { LoadingManager } from "./mecanics/LoadingManager.js";
import { Controls } from "./Controls.js";

// later
// import { _Deck } from "./mecanics/deck.js";

// functions
// import { _cubes } from "../functions/cubes.js";
import { _cameras } from "./cameras.js";
import { _stats } from "./stats.js";
import { _scene } from "./scenes.js";
import { _player } from "./player.js";
import { VRButton } from 'three/addons/webxr/VRButton.js';

export class Game {
	_datas = null;
	_previousREFRESH = null;
	// later
	// LoadingManager = new LoadingManager();
	// _deck = null;

	
	initPlayer= function (user){
		this.user = user
		if(_scene.cube===null) _scene._playerInit(this.callBackFunction)
	}
	initOtherPlayers = function (users){
		// this.user = user
		// if(_scene.cube===null) _scene._playerInit(this.callBackFunction)
	}
	init =function (datas) {
		// move: function(){
		console.log('game initiated')
		console.log(datas)
		let {user,users,rooms,socket,callBackFunction} = datas
		this.user=user;
		this.users=users;
		this.rooms=rooms;
		this.socket=socket;
		this.callBackFunction=callBackFunction;
		console.log(this.callBackFunction)

		// console.log(VRButton)

		_stats.init()
		this.Controls = new Controls();
		_scene.init();

		// _cubes.init()

		// later
		// this._deck = new _Deck()
		// this._deck.init();

		// later
		// this.LoadingManager.setScene(this._scene)
		// this.LoadingManager.loadThemAll()
		
		this.addVRButton();
		this.addEventsListeners();
		this._START();
	};
	addVRButton = () => {
		document.body.appendChild( VRButton.createButton( _scene.renderer ) );
	};
	addEventsListeners = () => {
		window.addEventListener("resize", () => {
			const newWidth = window.innerWidth;
			const newHeight = window.innerHeight;
			_cameras.currentPack.camera.aspect = newWidth / newHeight;
			_cameras.currentPack.camera.updateProjectionMatrix();
			_scene.renderer.setSize(newWidth, newHeight);
		});
	};
	_START() {
		console.log("STARTED");
		// console.log(_scene.scene.children.length)
		_scene.renderer.render(_scene.scene, _cameras.currentPack.camera);
		this._REFRESH();
	}
	_REFRESH = () => {
		requestAnimationFrame((t) => {
			_stats.begin();
			// ----------
			if (this._previousREFRESH === null) this._previousREFRESH = t;
			this._STEP(t - this._previousREFRESH);
			this._previousREFRESH = t;
			this._REFRESH();
			// ----------
			_stats.end();
		});
	};
	_STEP = (timeElapsed) => {
		timeElapsed = timeElapsed * 0.001;

		_soleil.rotation()

		if(_player.cube) {
			_cameras.lookAtCenter(_player.cube.position)
			_cameras.followaAt(_player.cube.position)
		}
		else {
			_cameras.lookAtCenter(new THREE.Vector3(0,0,0))
			_cameras.followaAt(new THREE.Vector3(0,0,0))
		}
		_cameras.currentPack.camera.updateProjectionMatrix();
		this.Controls._get_intersectionColorChange()
		
		if(_player.cube) _player.cube.checkControls(this.Controls);
		
		// _scene.cube.updt()
		_scene.renderer.render(_scene.scene, _cameras.currentPack.camera);
		// this.Controls.update()
	};
}