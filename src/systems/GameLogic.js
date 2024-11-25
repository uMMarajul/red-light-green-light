// systems/GameLogic.js
import {CharacterAnimationEnum} from "../helper/GameEnums.js"

const WALKING_SPEED = 0.01;
const ROTATION_SPEED = 0.01;

class GameLogic {
    constructor(character, inputHandler, animationSystem, gunMan, doll, soundManager) {
        this.character = character;
        this.inputHandler = inputHandler;
        this.animationSystem = animationSystem;
        this.gunMan = gunMan;
        this.doll = doll;
        this.soundManager = soundManager;

        this.dollRotationToggle = true;
        this.lastDollRotationTime = 0;
        this.rotationSpeed = 50; // Speed for smooth rotation
        this.randomDelay = this.getRandomDelay(); // Initialize the first random delay
    }

    getRandomDelay() {
        return Math.floor(Math.random() * (4 - 2 + 1) + 2); // Random delay between 3-6 seconds
    }

    updateDollRotation(deltaTime, elapsedTime) {
        // Check if the elapsed time since the last rotation exceeds the random delay
        if (elapsedTime - this.lastDollRotationTime >= this.randomDelay) {
            console.log(`Rotating doll after ${this.randomDelay} seconds`);

            // Toggle rotation state
            this.dollRotationToggle = !this.dollRotationToggle;

            // Update the last rotation time
            this.lastDollRotationTime = elapsedTime;

            // Generate a new random delay for the next rotation
            this.randomDelay = this.getRandomDelay();

            // Play sound when doll toggles rotation
            this.dollRotationToggle
                ? this.soundManager.playSound('greenLight')
                : this.soundManager.playSound('redLight');
        }

        // Calculate the target rotation angle
        const targetRotation = this.dollRotationToggle ? Math.PI : 0;
        const currentRotation = this.doll.getCurrentRotation();

        // Smoothly interpolate rotation
        const newRotation = currentRotation + (targetRotation - currentRotation) * this.rotationSpeed * deltaTime;
        this.doll.setRotation(newRotation);
    }

    firByGunMan() {
        this.gunMan.fireBullet(this.character);
        this.soundManager.playSound('gunShot');
    }

    update(deltaTime, elapsedTime) {
        if (this.character.isDying) {
            this.animationSystem.update(CharacterAnimationEnum.DIE);
            return;
        }

        if (!this.character.isAlive) {
            return;
        }

        let isMoving = CharacterAnimationEnum.IDLE;

        // Handle character movement
        if (this.inputHandler.isKeyPressed('ArrowUp')) {
            this.character.mesh.position.z -= WALKING_SPEED * Math.cos(this.character.mesh.rotation.y);
            this.character.mesh.position.x -= WALKING_SPEED * Math.sin(this.character.mesh.rotation.y);
            isMoving = CharacterAnimationEnum.WALK;
        }
        if (this.inputHandler.isKeyPressed('ArrowDown')) {
            this.character.mesh.position.z += WALKING_SPEED * Math.cos(this.character.mesh.rotation.y);
            this.character.mesh.position.x += WALKING_SPEED * Math.sin(this.character.mesh.rotation.y);
            isMoving = CharacterAnimationEnum.WALK;
        }
        if (this.inputHandler.isKeyPressed('ArrowLeft')) {
            this.character.mesh.rotation.y += ROTATION_SPEED;
            isMoving = CharacterAnimationEnum.WALK;
        }
        if (this.inputHandler.isKeyPressed('ArrowRight')) {
            this.character.mesh.rotation.y -= ROTATION_SPEED;
            isMoving = CharacterAnimationEnum.WALK;
        }

        // If the doll is facing forward and character moves, fire gunman
        if (!this.dollRotationToggle && isMoving === CharacterAnimationEnum.WALK && this.character.isAlive && !this.character.isDying) {
            this.firByGunMan();
        }

        // Update doll rotation logic
        this.updateDollRotation(deltaTime, elapsedTime);

        // Update animations
        this.animationSystem.update(isMoving);
    }
}

export default GameLogic;
