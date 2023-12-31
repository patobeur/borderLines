import * as THREE from "three";
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
import { VRButton } from 'three/addons/webxr/VRButton.js';

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
		this.users[user.id] = user
		_players.addTeamMate(user)
	}
	removeTeamPlayer = function (user) {
		let player = _players.players[user.id]
		player.mesh.geometry.dispose();
        player.mesh.material.dispose();
        _scene.scene.remove(player.mesh);
		delete this.users[user.id]
		delete _players.players[user.id]
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

		// this.addVRButton();
		// console.log(VRButton)

		this.addEventsListeners();
		this._START();
		console.log('game _START')
	};
	addVRButton = () => {
		document.body.appendChild(VRButton.createButton(_scene.renderer));
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

		if (_model.on) {
			_model.model.mesh.update()
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
		this.Controls._get_intersectionColorChange()

		// PLAYER CUBE UPDATE
		if (_players.player) _players.player.mesh.checkControls(this.Controls);

		_scene.renderer.render(_scene.scene, _cameras.currentPack.camera);
	};
}