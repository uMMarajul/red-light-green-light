import * as THREE from 'three';

class Bullet {
    constructor(scene, startPosition, targetMesh) {
        this.scene = scene;
        this.targetMesh = targetMesh;

        // Create the bullet mesh
        const geometry = new THREE.SphereGeometry(.3, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.mesh = new THREE.Mesh(geometry, material);

        this.mesh.position.copy(startPosition);
        this.scene.add(this.mesh);

        // Compute direction vector


        this.speed = 10; // Bullet speed (units per second)
        this.isActive = true; // Bullet is active until it collides or exits bounds
    }

    update(deltaTime) {
        if (!this.isActive) return;

        this.direction = new THREE.Vector3().subVectors(this.targetMesh.position, this.mesh.position).normalize();

        // Move the bullet
        this.mesh.position.add(this.direction.clone().multiplyScalar(this.speed * deltaTime));

        // Collision detection
        if (this.checkCollision() || this.isOutOfBounds()) {
            this.destroy();
        }
    }

    checkCollision() {
        // Simple bounding box collision detection
        const characterBoundingBox = new THREE.Box3().setFromObject(this.targetMesh);
        const bulletBoundingBox = new THREE.Box3().setFromObject(this.mesh);

        return characterBoundingBox.intersectsBox(bulletBoundingBox);
    }

    isOutOfBounds() {
        // Check if the bullet is outside the game field bounds
        return Math.abs(this.mesh.position.x) > 50 ||
            Math.abs(this.mesh.position.y) > 50 ||
            Math.abs(this.mesh.position.z) > 50; // Adjust bounds as necessary
    }

    destroy() {
        this.isActive = false;
        this.scene.remove(this.mesh); // Remove the bullet from the scene
    }
}

export default Bullet;
