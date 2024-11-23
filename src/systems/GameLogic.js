// systems/GameLogic.js


const WALKING_SPEED = 0.01;
const ROTATION_SPEED = 0.01;

class GameLogic {
    constructor(character, inputHandler, animationSystem, gunMan) {
        this.character = character;
        this.inputHandler = inputHandler;
        this.animationSystem = animationSystem;
        this.gunMan = gunMan;
    }


    firByGunMan() {
        this.gunMan.fireBullet(this.character.mesh);
    }

    update(deltaTime, elapsedTime) {

        let isMoving = false;
        // Handle movement based on input
        if (this.inputHandler.isKeyPressed('ArrowUp')) {
            this.character.mesh.position.z -= WALKING_SPEED * Math.cos(this.character.mesh.rotation.y);
            this.character.mesh.position.x -= WALKING_SPEED * Math.sin(this.character.mesh.rotation.y);
            isMoving = true;
        }
        if (this.inputHandler.isKeyPressed('ArrowDown')) {
            this.character.mesh.position.z += WALKING_SPEED * Math.cos(this.character.mesh.rotation.y);
            this.character.mesh.position.x += WALKING_SPEED * Math.sin(this.character.mesh.rotation.y);
            isMoving = true;
        }
        if (this.inputHandler.isKeyPressed('ArrowLeft')) {
            this.character.mesh.rotation.y += ROTATION_SPEED;
            isMoving = true;
        }
        if (this.inputHandler.isKeyPressed('ArrowRight')) {
            this.character.mesh.rotation.y -= ROTATION_SPEED;
            isMoving = true;
        }

        if(elapsedTime%2 === 0) this.firByGunMan();

        // Update animation based on movement
        this.animationSystem.update(isMoving);

    }
}

export default GameLogic;
