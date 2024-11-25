// components/Game.js
import * as THREE from 'three';
import Character from './components/Character.js';
import InputHandler from './systems/InputHandler.js';
import AnimationSystem from './systems/AnimationSystem.js';
import GameLogic from './systems/GameLogic.js';
import GameLoop from './systems/GameLoop.js';
import Sky from './components/Sky.js'
import CameraController from './components/CameraController.js';
import Doll from "./components/Doll.js";
import GameField from "./components/GameField.js";
import GunMan from "./components/GunMan.js";
import AssetManager from "./systems/AssetManager.js";
import UIManager from "./systems/UIManager.js";

class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });

        this.assetManager = new AssetManager(4, this.onAssetsLoaded.bind(this));
        this.uiManager = new UIManager(this.start.bind(this), this.restart.bind(this));

        this.isGameReady = false;

        this.initScene();
        this.initSky();
        this.loadAssets();

        this.clock = new THREE.Clock();

    }

    initScene(){
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.scene.background = new THREE.Color(0x87ceeb); // Default background color
        this.scene.fog = new THREE.Fog(this.scene.background, 1, 5000);

        this.camera.position.set(0, 0, 0);
        this.camera.lookAt(0, 0, 0);

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

    }

    initSky() {
        this.sky = new Sky(this.scene);
    }

    loadAssets() {
        this.gameField = new GameField(this.scene, () => this.assetManager.assetLoaded());
        this.character = new Character('You', () => this.assetManager.assetLoaded());
        this.character.loadModel();
        this.doll = new Doll('Doll', () => this.assetManager.assetLoaded());
        this.doll.loadModel();
        this.gunMan = new GunMan(this.scene, () => this.assetManager.assetLoaded());
        this.gunMan.loadModel();
    };

    onAssetsLoaded() {
        this.uiManager.hideLoadingScreen();
        this.uiManager.showStartButton();
    }


    addCharacterToScene() {

        this.character.mesh.position.set(3, 0, (this.gameField.floor.height / 2) - 4 );  // Adjusted character position
        this.scene.add(this.character.mesh);

        this.doll.mesh.position.set(0, 2.5, -(this.gameField.floor.height / 2) +4  );  // Adjusted character position
        this.scene.add(this.doll.mesh);


        this.gunMan.mesh.position.set(-10,0,-(this.gameField.floor.height / 2) +4  );
        this.scene.add(this.gunMan.mesh);
    }


    start() {
        this.animationSystem = new AnimationSystem(this.character);
        this.gameLogic = new GameLogic(this.character, new InputHandler(), this.animationSystem, this.gunMan, this.doll);
        this.cameraController = new CameraController(this.camera, this.character.mesh, 5, 2);
        this.addCharacterToScene();
        this.gameLoop = new GameLoop([
            this.character,
            this.gameLogic,
            this.cameraController,
            this.gunMan,
            this.doll,
        ]);
        this.isGameReady = true;
        this.gameField.startClock();
        this.animate();
    }
    restart() {
        // Logic to restart the game
        window.location.reload(); // Simplest way to reload everything
    }

    checkGameOver() {
        if (!this.character.isAlive) {
            this.uiManager.showGameOverScreen();
            this.gameField.stopClock();
            return true;
        }
    }

    animate() {
        if (!this.isGameReady) return;
        this.checkGameOver();

        requestAnimationFrame(this.animate.bind(this));
        const deltaTime = this.clock.getDelta();

        this.gameLoop.update(deltaTime);

        this.renderer.render(this.scene, this.camera);
    }
}

export default Game;
