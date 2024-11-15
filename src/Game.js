// components/Game.js
import * as THREE from 'three';
import Floor from './components/Floor.js';
import Character from './components/Character.js';
import Lights from './components/Lights.js';
import InputHandler from './systems/InputHandler.js';
import AnimationSystem from './systems/AnimationSystem.js';
import GameLogic from './systems/GameLogic.js';
import GameLoop from './systems/GameLoop.js';
import Wall from './components/Wall.js';
import { Sky } from 'three/addons/objects/Sky.js';
import CameraController from './components/CameraController.js';

class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.camera.position.set(0, 0, 0);  // Adjusted camera position
        this.camera.lookAt(0, 0, 0);

        this.inputHandler = new InputHandler();
        this.clock = new THREE.Clock();

        this.floor = new Floor();
        this.scene.add(this.floor.mesh);
        this.addWalls();

        // Create the main character and add callback to start game once everything is loaded
        this.character = new Character("Player1", this.onAssetsLoaded.bind(this));
        this.character.loadModel();  // Start loading the model



        this.lights = new Lights(this.scene);
        this.addDynamicSky();

        this.animate = this.animate.bind(this);

        // Set loading state
        this.isGameReady = false;
    }

    onAssetsLoaded() {
        // Callback called when all assets are loaded
        this.isGameReady = true;
        this.animationSystem = new AnimationSystem(this.character);
        this.addCharacterToScene();
        this.gameLogic = new GameLogic(this.character, this.inputHandler, this.animationSystem);
        this.cameraController = new CameraController(this.camera, this.character.mesh, 5, 2);
        this.gameLoop = new GameLoop([
            this.character,
            this.animationSystem,
            this.inputHandler,
        ]);
        // this.addDummyCharacters();  // Add dummy characters once everything is loaded
        this.start();  // Start the game after everything is ready
    }
    addWalls() {
        const wallHeight = 15;
        const floorSize = this.floor.height; // Assuming floor dimensions are 100x100
        const wallThickness = 1;

        // Front Wall
        const frontWall = new Wall(floorSize, wallHeight, { x: 0, y: wallHeight / 2, z: -floorSize / 2 }, { x: 0, y: 0, z: 0 });
        this.scene.add(frontWall.mesh);

        // Back Wall
        const backWall = new Wall(floorSize, wallHeight, { x: 0, y: wallHeight / 2, z: floorSize / 2 }, { x: 0, y: Math.PI, z: 0 });
        this.scene.add(backWall.mesh);

        // Left Wall
        const leftWall = new Wall(floorSize, wallHeight, { x: -floorSize / 2, y: wallHeight / 2, z: 0 }, { x: 0, y: Math.PI / 2, z: 0 });
        this.scene.add(leftWall.mesh);

        // Right Wall
        const rightWall = new Wall(floorSize, wallHeight, { x: floorSize / 2, y: wallHeight / 2, z: 0 }, { x: 0, y: -Math.PI / 2, z: 0 });
        this.scene.add(rightWall.mesh);
    }

    addDynamicSky() {
        const sky = new Sky();
        sky.scale.setScalar(450000); // Scale the sky object
        this.scene.add(sky);

        const sun = new THREE.Vector3();

        const effectController = {
            turbidity: 10,
            rayleigh: 2,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.7,
            elevation: 10,
            azimuth: 180,
            exposure: this.renderer.toneMappingExposure,
        };

        const updateSun = () => {
            const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
            const theta = THREE.MathUtils.degToRad(effectController.azimuth);

            sun.setFromSphericalCoords(1, phi, theta);

            sky.material.uniforms['sunPosition'].value.copy(sun);
        };

        updateSun();
    }

    addCharacterToScene() {
        // Add the main character to the scene
        this.character.mesh.position.set(0, 0, this.floor.height / 2 );  // Adjusted character position
        this.scene.add(this.character.mesh);
    }


    start() {
        if (this.isGameReady) {
            this.animate();  // Start animation loop once everything is ready
        }
    }

    animate() {
        if (!this.isGameReady) return;

        requestAnimationFrame(this.animate);
        const deltaTime = this.clock.getDelta();

        // Update game logic
        this.gameLogic.update(deltaTime);

        this.cameraController.update();

        // Update the game loop (general updates like animations)
        this.gameLoop.update(deltaTime);

        // Update the main character and all dummy characters


        this.renderer.render(this.scene, this.camera);
    }
}

export default Game;
