import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import Bullet from "./Bullet.js";
import * as THREE from 'three'

class GunMan{
    constructor(scene, callback, gunman = null) {
        this.onLoadCallback = callback;
        this.loader = new GLTFLoader();
        this.loadModel()
        this.bullets = [];
        this.scene = scene;


    }
    loadModel() {
        this.loader.load('../assets/bot.glb',  (gltf) => {
            this.mesh = gltf.scene;
            this.mesh.scale.set(2, 2, 2);
            if(this.onLoadCallback){
                this.onLoadCallback()
            }
        });
    }

    fireBullet(targetMesh) {
        const startPosition = this.mesh.position.clone();
        const bullet = new Bullet(this.scene, startPosition, targetMesh);
        this.bullets.push(bullet);
    }

    update(deltaTime) {
        // Update all bullets
        this.bullets = this.bullets.filter(bullet => {
            bullet.update(deltaTime);
            return bullet.isActive;
        });
    }

}

export default GunMan;
