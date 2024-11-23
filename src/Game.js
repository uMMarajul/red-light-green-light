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
import {OrbitControls} from "three/addons";
import GunMan from "./components/GunMan.js";

class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });

        this.initSceneCameraSettings()

        this.sky = new Sky(this.scene);

        this.inputHandler = new InputHandler();
        this.clock = new THREE.Clock();
        this.gameField = new GameField(this.scene,this.onAssetLoaded.bind(this))

        this.character = new Character("You", this.onAssetLoaded.bind(this));
        this.character.loadModel();  // Start loading the model

        this.doll = new Doll("Doll", this.onAssetLoaded.bind(this));
        this.doll.loadModel();

        this.gunMan1 = new GunMan(this.scene, this.onAssetLoaded.bind(this))

        this.assetsLoaded = 0; // Counter for loaded assets
        this.totalAssets = 4; // Total number of assets to load

        this.animate = this.animate.bind(this);
        // Set loading state
        this.isGameReady = false;
    }

    initSceneCameraSettings(){
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.scene.background = new THREE.Color(0x87ceeb); // Example sky color
        this.scene.fog = new THREE.Fog(this.scene.background, 1, 5000);

        // camera

        this.camera.position.set(0, 0, 0);  // Adjusted camera position
        this.camera.lookAt(0, 0, 0);

        window.addEventListener('resize', () => {
            // Update camera aspect ratio and projection matrix
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();

            // Adjust renderer size
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });


    }

    onAssetLoaded(){
        this.assetsLoaded++;
        if (this.assetsLoaded === this.totalAssets) {
            this.onAllAssetsLoaded();
        }
    }

    onAllAssetsLoaded() {
        // Callback called when all assets are loaded
        this.isGameReady = true;
        this.animationSystem = new AnimationSystem(this.character);
        this.addCharacterToScene();
        this.gameLogic = new GameLogic(this.character, this.inputHandler, this.animationSystem, this.gunMan1);
        this.cameraController = new CameraController(this.camera, this.character.mesh, 5, 2);

        this.gameLoop = new GameLoop([
            this.character,
            this.inputHandler,
            this.doll,
            this.cameraController,
            this.gameLogic,
            this.gunMan1
        ]);

        this.start();
    }


    addCharacterToScene() {
        // Add the main character to the scene
        this.character.mesh.position.set(3, 0, (this.gameField.floor.height / 2) - 4 );  // Adjusted character position
        this.scene.add(this.character.mesh);

        // Add the Doll character to the scene
        this.doll.mesh.position.set(0, 2.5, -(this.gameField.floor.height / 2) +4  );  // Adjusted character position
        this.scene.add(this.doll.mesh);

        // add gunman to the scene

        this.gunMan1.mesh.position.set(-10,0,-(this.gameField.floor.height / 2) +4  );
        this.scene.add(this.gunMan1.mesh);
    }


    start() {
        if (this.isGameReady) {
            this.animate();
            this.gameField.startClock();

        }
    }

    animate() {
        if (!this.isGameReady) return;

        requestAnimationFrame(this.animate);
        const deltaTime = this.clock.getDelta();

        this.gameLoop.update(deltaTime);

        this.renderer.render(this.scene, this.camera);
    }
}

export default Game;
