// components/Doll.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


class Doll {
    constructor(name = "Doll", onLoadCallback) {
        this.loader = new GLTFLoader();
        this.mesh = null;
        this.animations = {};
        this.name = name;
        this.onLoadCallback = onLoadCallback;
        this.rotationToggle = true;
        this.lastRotationTime = 0;
        this.rotationSpeed = 50;
    }

    loadModel() {
        this.loader.load('../assets/model/doll.glb',  (gltf) => {
            this.mesh = gltf.scene;
            this.mesh.scale.set(1, .5, 1);
            this.mesh.rotation.y = Math.PI; // Rotate the Doll character
            if(this.onLoadCallback){
                this.onLoadCallback()
            }
        });
    }

    getRandomDelay() {
        // Generate a random number between 2 and 10 seconds
        let x = Math.random() * 20 + 5
        return x;
    }

    update(deltaTime, elapsedTime) {
        if (this.mesh) {
            if (elapsedTime - this.lastRotationTime >= this.getRandomDelay()) {
                this.rotationToggle = !this.rotationToggle; // Toggle between 0° and 360°
                this.lastRotationTime = elapsedTime; // Update the last rotation time

            }

            // Calculate target rotation
            const targetRotation = this.rotationToggle ? Math.PI  : 0;


            // Smoothly interpolate the rotation angle
            this.mesh.rotation.y += (targetRotation - this.mesh.rotation.y) * this.rotationSpeed * deltaTime;
        }
    }


}

export default Doll;
