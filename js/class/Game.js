import * as THREE from "three";
import { _console } from "../functions/console.js";
import { _soleil } from "../functions/soleil.js";
// class
// later
// import { LoadingManager } from "./mecanics/LoadingManager.js";
import { Controls } from "./Controls.js";

// later
// import { _Deck } from "./mecanics/deck.js";

// functions
import { _cubes } from "../functions/cubes.js";
import { _cameras } from "../functions/cameras.js";
import { _stats } from "../functions/stats.js";
import { _scene } from "../functions/scenes.js";

export class Game {
	Controls = new Controls();
	_previousREFRESH = null;
	// later
	// LoadingManager = new LoadingManager();
	// _deck = null;



	init = () => {
		_console.init();
		_scene.init();
		_stats.init()

		// later
		// this._deck = new _Deck()
		// this._deck.init();

		// later
		// this.LoadingManager.setScene(this._scene)
		// this.LoadingManager.loadThemAll()
		_cubes.add()
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
	_START() {
		console.log("START");
		console.log(_scene.scene.children.length)
		let last = _scene.scene.children[_scene.scene.children.length-1].children[0]
		_console.log('last.name',last.name)
		_console.log(last.name,'castShadow',last.castShadow)
		_console.log(last.name,'receiveShadow',last.receiveShadow)


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

		_cameras.lookAtCenter(_scene.cube.position)
		_cameras.followaAt(_scene.cube.position)
		this.Controls._get_intersectionColorChange(_cameras.currentPack.camera)
		_scene.cube.checkControls(this.Controls);
		// _scene.cube.updt()
		_scene.renderer.render(_scene.scene, _cameras.currentPack.camera);
		// this.Controls.update()
	};
}