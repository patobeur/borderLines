import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { _console } from "./js/console.js";
import { _soleil } from "./js/soleil.js";
import { _model } from "./js/models.js";
// class
// later
// import { LoadingManager } from "./mecanics/LoadingManager.js";
import { Controls } from "./js/Controls.js";

// functions
// import { _cubes } from "./js/cubes.js";
import { _cameras } from "./js/cameras.js";
import { _stats } from "./js/stats.js";
import { _scene } from "./js/scenes.js";
import { _players } from "./js/players.js";

import { _renderer } from "./js/renderer.js";
import { _vr } from "./js/vr.js";

export class Game {
	_datas = null;
	_previousREFRESH = null;

	user = false;
	// socket= false;
	users = {};

	// later
	// LoadingManager = new LoadingManager();
	// _deck = null;

	addTeamPlayer = function (user) {
		console.log('addTeamPlayer ', user.name)

		this.users[user.id] = user // ???????????? in use

		_players.addTeamMate(user)
	}
	removeTeamPlayer = function (user) {
		_players.removeTeamMate(user)
		delete this.users[user.id]
	}

	initPlayer = function (user) {
		this.user = user
		if (!_players.player) _players.init(
			this.user,
			this.callBackFunction
		)
		// if (_scene.cube === null) _scene._playerInit(this.callBackFunction)
	}
	init = function (datas) {
		let { callBackFunction } = datas
		this.callBackFunction = callBackFunction;


		_stats.init()
		this.Controls = new Controls();
		_scene.init();

		// later
		// this.LoadingManager.setScene(this._scene)
		// this.LoadingManager.loadThemAll()


		this.addEventsListeners();
		
		_vr.addVRButton();
		this._START();
		console.log('game _START')
	};
	// addVRButton = () => {
	// 	document.body.appendChild(VRButton.createButton(_renderer.renderer));
	// };
	addEventsListeners = () => {
		window.addEventListener("resize", () => {
			const newWidth = window.innerWidth;
			const newHeight = window.innerHeight;
			_cameras.currentPack.camera.aspect = newWidth / newHeight;
			_cameras.currentPack.camera.updateProjectionMatrix();
			_renderer.renderer.setSize(newWidth, newHeight);
		});
	};
	_START() {
		console.log("STARTED");
		// this.ORBITOR = new OrbitControls(_cameras.currentPack.camera, _scene.renderer.domElement);
		// _renderer.renderer.render(_scene.scene, _cameras.currentPack.camera);

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

		if (_model.on) {
			_model.MYMODEL.mesh.update()
		}
		if (_players.player) {
			_cameras.lookAtCenter(_players.player.mesh.position)
			_cameras.followaAt(_players.player.mesh.position)
		}
		else {
			_cameras.lookAtCenter(new THREE.Vector3(0, 0, 0))
			_cameras.followaAt(new THREE.Vector3(0, 0, 0))
		}
		_cameras.currentPack.camera.updateProjectionMatrix();
		
		// if(this.ORBITOR) this.ORBITOR.update(); // Mettre à jour OrbitControls

		// this.Controls._get_intersectionColorChange()

		// PLAYER CUBE UPDATE
		if (_players.player) _players.player.mesh.checkControls(this.Controls);


		// vr
		_renderer.renderer.xr.updateCamera( _cameras.currentPack.camera );

		_renderer.renderer.render(_scene.scene, _cameras.currentPack.camera);
	};
}