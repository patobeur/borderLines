import * as THREE from "three";
import { _console } from "./js/console.js";
import { _soleil } from "./js/soleil.js";
// class
// later
// import { LoadingManager } from "./mecanics/LoadingManager.js";
import { Controls } from "./js/Controls.js";

// later
// import { _Deck } from "./mecanics/deck.js";

// functions
// import { _cubes } from "../functions/cubes.js";
import { _cameras } from "./js/cameras.js";
import { _stats } from "./js/stats.js";
import { _scene } from "./js/scenes.js";
import { _player } from "./js/player.js";
import { _players } from "./js/players.js";
import { VRButton } from 'three/addons/webxr/VRButton.js';

export class Game {
	_datas = null;
	_previousREFRESH = null;

	user = false;
	// socket= false;
	users = {};
	rooms = {};

	// later
	// LoadingManager = new LoadingManager();
	// _deck = null;

	addTeamPlayer = function (user) {
		console.log('addTeamPlayer ', user.name)
		this.users[user.id] = user
		_players.addTeamMate(this.users[user.id])
	}
	removeTeamPlayer = function (user) {
		let player = _players.players[user.id]
		player.mesh.geometry.dispose();
        player.mesh.material.dispose();
        _scene.scene.remove(player.mesh);
		delete this.users[user.id]
	}

	initPlayer = function (user) {
		this.user = user
		if (_scene.cube === null) _scene._playerInit(this.callBackFunction)
	}
	init = function (datas) {
		console.log('game initiated')
		console.log(datas)
		// let { user, users, rooms, socket, callBackFunction } = datas
		let { callBackFunction } = datas
		// this.user = user;
		// this.users = users;
		// this.rooms = rooms;
		// this.socket = socket;
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

		if (_player.cube) {
			_cameras.lookAtCenter(_player.cube.position)
			_cameras.followaAt(_player.cube.position)
		}
		else {
			_cameras.lookAtCenter(new THREE.Vector3(0, 0, 0))
			_cameras.followaAt(new THREE.Vector3(0, 0, 0))
		}
		_cameras.currentPack.camera.updateProjectionMatrix();
		this.Controls._get_intersectionColorChange()

		// PLAYER CUBE UPDATE
		if (_player.cube) _player.cube.checkControls(this.Controls);

		_scene.renderer.render(_scene.scene, _cameras.currentPack.camera);
	};
}