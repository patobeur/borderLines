import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

export class LoadingManager {
    progressBar=null;
    constructor() {
        console.log("LoadingManager Mounted !");
        this.progressBar=null;
        this.modal = document.createElement("div");
        this.loading = document.createElement("div");
        this.progress = [0, -1];
        this.error = false;

        this.models = {
            fire: { name: "fire", url: "../gltf/fire/scene.gltf", num: 1, upd: 0.02, scale: 3 },
            clownfish: { name: "clownfish", url: "../gltf/clownFish/scene.gltf", num: 1, upd: 0.02, scale: 3 },
            BaseCharacter: { name: "BaseCharacter", url: "../gltf/characters/BaseCharacter.gltf", num: 1, upd: 0.02, scale: 3 },
            Casual_Female: { name: "Casual_Female", url: "../gltf/characters/Casual_Female.gltf", num: 1, upd: 0.02, scale: 3 },
            Casual_Male: { name: "Casual_Male", url: "../gltf/characters/Casual_Male.gltf", num: 1, upd: 0.02, scale: 3 },
        };

        this.gltfLoader = new GLTFLoader();
    }
	setScene(scene){
		this.scene=scene
	}
    loadThemAll() {
        this.cssMaker();
        this.addProgressBar();

        const totalModels = Object.keys(this.models).length;
        let loadedModels = 0;

        const updateProgress = () => {
            loadedModels++;
            const progress = (loadedModels / totalModels) * 100;
            this.updateProgressBar(progress);

            if (loadedModels === totalModels) {
                this.hideProgressBar();
                this._onLoadDone();
            }
        };

        for (const [modelName, model] of Object.entries(this.models)) {
            this.gltfLoader.load(model.url, (gltf) => {
                console.log("-----------Started loading file:", modelName, gltf);
                gltf.userData.name = modelName;
                model.gltf = gltf;
                this.updateProgressBar(loadedModels / totalModels * 100);
                updateProgress();
            });
        }
    }

    update() {
        for (const model of Object.values(this.models)) {
            if (model.mixer) {
                model.mixer.update(model.upd);
            }
        }
    }

    _prepModelsAndAnimations() {
        // console.groupCollapsed("prepModelsAndAnimations start");

        Object.values(this.models).forEach((model, ndx) => {
            if (model.gltf.animations.length > 0) {
                model.animations = model.gltf.animations.reduce((acc, animation) => {
                    acc[animation.name] = animation;
                    return acc;
                }, {});
            }

            const clonedScene = SkeletonUtils.clone(model.gltf.scene);
            const clone = new THREE.Object3D();
            clone.add(clonedScene);

            clone.position.x = (ndx - 1) * 1;
            clone.position.y = clone.position.y;
            clone.rotation.x = Math.PI / 2;

            model.clone = clone;

            if (model.gltf.animations.length > 0) {
                const mixer = new THREE.AnimationMixer(clonedScene);
                const firstClip = model.gltf.animations[0];
                const action = mixer.clipAction(firstClip);
                action.play();
                model.mixer = mixer;
            }
// // Change MeshBasicMaterial to MeshStandardMaterial
// model.clone.traverse((child) => {
// 	if (child.isMesh) {
// 		child.material = new THREE.MeshStandardMaterial();
// 	}
// });

			this._addToScene(model.name);
        });

        // console.groupEnd();
    }

    _onLoadDone() {
        console.log("-----------done!");
        this._prepModelsAndAnimations();
        this._go();
    }

    _go() {
        this.modal.remove();
		console.log('all done')
    }
    _addToScene(modelName) {
        console.log("Adding","to scene",modelName);
        this.scene.add(this.models[modelName].clone);
        this.models[modelName].clone.position.y = -2;
    }


    addProgressBar() {
        this.showProgressBar();
        this.modal.id = "loader";
        this.loading.id = "loading";
        this.modal.prepend(this.loading);
        document.body.prepend(this.modal);
    }

    showProgressBar() {
        this.progressBar = this.createDiv({
            tag: "div",
            attributes: { id: "progress-bar" },
            style: {
                width: "0%",
                height: "20px",
                background: "#4CAF50",
                margin: "10px 0",
                transition: "width 0.5s",
            },
        });
        this.modal.appendChild(this.progressBar);
    }

    updateProgressBar(percentage) {
        if (this.progressBar) this.progressBar.style.width = percentage + "%"; 
    }

    hideProgressBar() {
        const progressBar = document.getElementById("progress-bar");
        if (this.progressBar) this.progressBar.parentNode.removeChild(progressBar);
    }

    cssMaker = () => {
        const stringcss =
            "#loader {position: absolute;background-color: rgba(255, 0, 0, 0.644);top: calc(50% - 12px);left: 25%;width: 50%;height: 25px;border-radius: 6px;overflow: hidden;}" +
            "#loader #loading {position: relative;background-color: rgba(81, 255, 0, 0.644);width: 0%;height: 100%;}";
        this.addCss(stringcss, "loader");
    };

    setProgressBar() {
        const min = this.progress[0];
        const max = this.progress[1];
        const width = Math.floor((min / (max - 1)) * 100);
        if (max > 0 && min <= max) {
            this.loading.style.width = width + "%";
        }
    }

    createDiv = (params) => {
        const element = document.createElement(params.tag);
        if (params.attributes) {
            for (const key in params.attributes) {
                if (Object.hasOwnProperty.call(params.attributes, key))
                    element[key] = params.attributes[key];
                if (params.style) {
                    for (const key2 in params.style) {
                        if (Object.hasOwnProperty.call(params.style, key2))
                            element.style[key2] = params.style[key2];
                    }
                }
            }
        }
        return element;
    };

    addCss = (string) => {
        const stringcss = string;
        const style = document.createElement("style");
        style.textContent = stringcss;
        style.id = "css";
        document.getElementsByTagName("head")[0].appendChild(style);
    };
}
