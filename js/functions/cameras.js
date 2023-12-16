import * as THREE from 'three';
export let _cameras = {
	id:new Number(0),
	cameras:{},
	counter:new Number(0),
	currentPack:null,
	//--------------------------
	add: function (conf) {
		let pack = {
			id:this.id,
			name:(conf&&conf.name)?conf.name:'camera_'+this.id,
            groupe:new THREE.Group(),
			camera:new THREE.PerspectiveCamera(40,window.innerWidth / window.innerHeight,0.1,1000),
			// position:(conf&&conf.position) ? conf.position : new THREE.Vector3(0,0,10),
			position:new THREE.Vector3(0,0,10),
            lookAt:new THREE.Vector3(0,0,0),
            velocity: new THREE.Vector3(0,0,0),
            limits: new THREE.Vector3(50,50,50),
            speed:0.5
		}
		pack.camera.name = pack.name

        pack.groupe.add(pack.camera)
		pack.groupe.position.set(pack.position.x,pack.position.y,pack.position.z)

		this.cameras[this.id] = pack
		this.id++
		this.counter++
		if(this.currentPack===null) this.currentPack = pack;
        this.lookAtCenter(this.currentPack.lookAt)
	},
	lookAtCenter:function(vector3=false){
        let center = vector3 ? vector3 : new THREE.Vector3(0,0,0);
        this.currentPack.camera.lookAt(center);
        this.currentPack.camera.updateProjectionMatrix();
	},
	followaAt:function(vector3=false){
		this.currentPack.camera.position.set(vector3.x,vector3.y,vector3.z).add(this.currentPack.position)
	},
    // updateCameraPositionAndLookAt(obj) {
    //     // Ajuster la position de la caméra pour suivre un object
    //     const offset = new THREE.Vector3(0, -10, 30);
    //     const cameraPosition = obj.position.clone().add(offset);
    //     this.currentPack.groupe.position.copy(cameraPosition);
    //     this.currentPack.camera.lookAt(obj.position);
    // },
    // updateCameraPosition:function(camNum=0){
    //     if (this.id>0) {
    //         let cameraPack = (camNum >= 0 && this.cameras[camNum]) ? this.cameras[camNum] : this.cameras[0];
    //         if (cameraPack.groupe.position.z > 100) {
    //             cameraPack.moveDirection = -1;
    //         } 
    //         if (cameraPack.groupe.position.z < 10) {
    //             cameraPack.moveDirection = 1;
    //         }
    //         cameraPack.groupe.position.z += cameraPack.speed * cameraPack.moveDirection;
    //         console.log(
    //             cameraPack.groupe.position.z,
    //             (cameraPack.moveDirection > 0 ? 'up' : 'down'),
    //             cameraPack.moveDirection,cameraPack.speed
    //         )
    //         cameraPack.camera.updateProjectionMatrix();
    //     }
    // },
	init:function(){
		this.add({position:new THREE.Vector3(0,-3,10),name:'mainCamera'});
	},
};