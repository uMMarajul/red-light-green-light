// systems/GameLogic.js
import {CharacterAnimationEnum} from "../helper/GameEnums.js"

const WALKING_SPEED = 0.01;
const ROTATION_SPEED = 0.01;

class GameLogic {
    constructor(character, inputHandler, animationSystem, gunMan, doll) {
        this.character = character;
        this.inputHandler = inputHandler;
        this.animationSystem = animationSystem;
        this.gunMan = gunMan;
        this.doll = doll;
    }


    firByGunMan() {
        this.gunMan.fireBullet(this.character);
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
        // Handle movement based on input
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

        if (this.doll.rotationToggle === false && isMoving === CharacterAnimationEnum.WALK && this.character.isAlive && !this.character.isDying) {
            this.firByGunMan();
        }

        this.animationSystem.update(isMoving);

    }
}

export default GameLogic;
