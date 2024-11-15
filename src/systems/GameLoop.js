// systems/GameLoop.js
class GameLoop {
    constructor(components) {
        this.components = components; // An array of all updatable components or systems
    }

    update(deltaTime) {
        this.components.forEach((component) => {
            if (component.update) {
                component.update(deltaTime);
            }
        });
    }
}

export default GameLoop;
