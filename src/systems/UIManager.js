import {createLoadingScreen, createStartButton} from "../helper/Utils.js";

export default class UIManager {
    constructor(startGameCallback, restartGameCallback) {
        this.startGameCallback = startGameCallback;
        this.restartGameCallback =restartGameCallback;
        this.loadingScreen = createLoadingScreen();
        this.startButton = this.createStartButton(this.startGameCallback);
        this.createGameOverScreen(this.restartGameCallback);
    }

    createStartButton(onStart) {
        const startButton = createStartButton();
        startButton.addEventListener('click', () => {
            startButton.style.display = 'none';
            onStart();
        });
        return startButton;
    }


    hideLoadingScreen() {
        if (this.loadingScreen) document.body.removeChild(this.loadingScreen);
    }

    showStartButton() {
        if (this.startButton) this.startButton.style.display = 'block';
    }


    createGameOverScreen() {
        this.gameOverScreen = document.createElement('div');
        this.gameOverScreen.style.position = 'absolute';
        this.gameOverScreen.style.top = '0';
        this.gameOverScreen.style.left = '0';
        this.gameOverScreen.style.width = '100%';
        this.gameOverScreen.style.height = '100%';
        this.gameOverScreen.style.background = 'rgba(0, 0, 0, 0.5)';
        this.gameOverScreen.style.display = 'flex';
        this.gameOverScreen.style.flexDirection = 'column';
        this.gameOverScreen.style.justifyContent = 'center';
        this.gameOverScreen.style.alignItems = 'center';
        this.gameOverScreen.style.color = 'white';
        this.gameOverScreen.style.fontSize = '2em';
        this.gameOverScreen.style.display = 'none'; // Hidden by default

        const gameOverText = document.createElement('div');
        gameOverText.innerText = 'Game Over';
        this.gameOverScreen.appendChild(gameOverText);

        const restartButton = document.createElement('button');
        restartButton.innerText = 'Restart';
        restartButton.style.marginTop = '1em';
        restartButton.style.padding = '0.5em 1em';
        restartButton.style.fontSize = '1.2em';
        restartButton.addEventListener('click', () => {
            this.gameOverScreen.style.display = 'none';
            this.restartGameCallback();
        });
        this.gameOverScreen.appendChild(restartButton);

        document.body.appendChild(this.gameOverScreen);
    }

    showGameOverScreen() {
        this.gameOverScreen.style.display = 'flex';
    }
}
