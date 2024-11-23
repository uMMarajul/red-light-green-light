// systems/AnimationSystem.js
class AnimationSystem {
    constructor(character) {
        this.character = character;
    }

    update(isMoving) {
        if (isMoving) {
            this.character.playAnimation('walk');
        } else {
            // this.character.stopAnimations();
            // this.character.playAnimation('stop');
            this.character.playAnimation('idle');
        }
    }
}

export default AnimationSystem;
