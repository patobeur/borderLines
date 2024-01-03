import * as THREE from "three";
import { _scene } from "./scenes.js";
export let _movePlayer = {
	move: function (player,Controls,callBackFunction) {
		this.callBackFunction=callBackFunction
		this.player = player
		let pm = player.mesh
		pm.futurPosition = new THREE.Vector3(0, 0, 0)

		let move = false
			// _movePlayer.move(this.player,Controls,this.callBackFunction)
			if (Controls.left) futur.x = actual.x - speedRatio;
			if (Controls.right) futur.x = actual.x + speedRatio;
			if (Controls.up) futur.y = actual.y + speedRatio;
			if (Controls.down) futur.y = actual.y - speedRatio;

			if (Controls.left || Controls.right || Controls.up || Controls.down) {
				if (futur != actual) {
					console.log('----', this.player.user)

					let minx = -(_scene.floor.size.x / 2) + (this.player.user.size.x / 2)
					let maxx = (_scene.floor.size.x / 2) - (this.player.user.size.x / 2)
					let miny = -(_scene.floor.size.y / 2) + (this.player.user.size.y / 2)
					let maxy = (_scene.floor.size.y / 2) - (this.player.user.size.y / 2)

					let futurPos = new THREE.Vector3(0, 0, 0)
					futurPos.copy(futur)

					if (
						(futur.x < maxx) &&
						(futur.x > minx)
					) {
						move = true
						actual.x = futurPos.x + 0
						this.player.user.datas.pos.x = futurPos.x + 0
					}
					if (
						(futur.y < maxy) &&
						(futur.y > miny)
					) {
						move = true
						actual.y = futurPos.y + 0
						this.player.user.datas.pos.y = futurPos.y + 0
						// send to server
						// console.log('send callback ', this.player)
					}
					if (move) {
						console.log('i move to ', futur)
						this.callBackFunction.sendPlayerDatas(this.player)
					}
				}
			}




	}
};

