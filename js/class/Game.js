import * as THREE from "three";
// class
// later
// import { LoadingManager } from "./mecanics/LoadingManager.js";
import { Controls } from "./Controls.js";

// later
// import { _Deck } from "./mecanics/deck.js";

// functions
import { _cameras } from "../functions/cameras.js";
import { _stats } from "../functions/stats.js";
import { _scene } from "../functions/scenes.js";

export class Game {
	Controls = new Controls();
	// later
	// LoadingManager = new LoadingManager();
	_previousREFRESH = null;
	_deck = null;
	init = () => {
		_scene.init();
		_stats.init()

		// later
		// this._deck = new _Deck()
		// this._deck.init();

		// later
		// this.LoadingManager.setScene(this._scene)
		// this.LoadingManager.loadThemAll()

		this.addEventsListeners();
		this._START();
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
	checkControls = () => {
		// console.log(this.Controls)
		if (this.Controls.left) _scene.cube.position.x -= _scene.cube.speedRatio;
		if (this.Controls.right) _scene.cube.position.x += _scene.cube.speedRatio;
		if (this.Controls.up) _scene.cube.position.y += _scene.cube.speedRatio;
		if (this.Controls.down) _scene.cube.position.y -= _scene.cube.speedRatio;
		if (this.Controls.space) _scene.cube.position.z += _scene.cube.speedRatio;
	};
	_START() {
		console.log("START");
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

		_scene.cube.updt()

		_cameras.lookAtCenter(_scene.cube.position)
		_cameras.followaAt(_scene.cube.position)
		this.Controls._get_intersectionColorChange(_cameras.currentPack.camera)
		this.checkControls();
		_scene.renderer.render(_scene.scene, _cameras.currentPack.camera);
		// this.Controls.update()
	};
}