// components/Floor.js
import * as THREE from 'three';

class Floor {
    constructor() {
        this.width = 50;
        this.height = 50;
        this.mesh = this.createFloor();

    }

    createFloor() {
        // Create geometry for the floor
        const geometry = new THREE.PlaneGeometry(this.width, this.height);  // Width and height of the plane

        // Load texture
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('../assets/groundtexturre.jpg');  // Replace with your texture path

        // Adjust texture properties
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);  // Repeats texture across the surface

        // Create material with texture
        const material = new THREE.MeshStandardMaterial({ map: texture });

        // Create and position the floor mesh
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2;  // Rotate to lie flat
        mesh.rotation.x = -Math.PI / 2;  // Rotate to lie flat
        mesh.receiveShadow = true;  // Enable shadow receiving

        return mesh;
    }
}

export default Floor;
