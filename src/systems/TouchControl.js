// components/TouchControl.js
class TouchControl {
    constructor(character) {
        this.character = character;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.touchThreshold = 50;  // Minimum distance to consider as a swipe

        this.initTouchEvents();
    }

    initTouchEvents() {
        window.addEventListener('touchstart', this.onTouchStart.bind(this), false);
        window.addEventListener('touchmove', this.onTouchMove.bind(this), false);
        window.addEventListener('touchend', this.onTouchEnd.bind(this), false);
    }

    onTouchStart(event) {
        const touch = event.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
    }

    onTouchMove(event) {
        const touch = event.touches[0];
        this.touchEndX = touch.clientX;
        this.touchEndY = touch.clientY;
    }

    onTouchEnd(event) {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;

        // If swipe is above the threshold, move the character
        if (Math.abs(deltaX) > this.touchThreshold) {
            // Move horizontally
            if (deltaX > 0) {
                this.character.moveRight();
            } else {
                this.character.moveLeft();
            }
        }

        if (Math.abs(deltaY) > this.touchThreshold) {
            // Move vertically
            if (deltaY > 0) {
                this.character.moveForward();
            } else {
                this.character.moveBackward();
            }
        }
    }
}

export default TouchControl;
