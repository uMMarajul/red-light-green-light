import * as THREE from 'three';

class SoundManager {
    constructor(camera, callback) {
        this.listener = new THREE.AudioListener();
        camera.add(this.listener);
        this.audioLoader = new THREE.AudioLoader();
        this.onLoadCallback = callback;

        // Sounds dictionary
        this.sounds = {
            loadingScreen: null,
            gameplayMusic: null,
            gunShot: null,
            redLight: null,
        };
    }

    loadSounds() {
        // Array to hold promises
        const soundPromises = [];

        // Helper to load a sound with a promise
        const loadSound = (path, soundKey, isPositional = false) => {
            return new Promise((resolve, reject) => {
                this.audioLoader.load(
                    path,
                    (buffer) => {
                        const sound = isPositional
                            ? new THREE.PositionalAudio(this.listener)
                            : new THREE.Audio(this.listener);
                        sound.setBuffer(buffer);
                        this.sounds[soundKey] = sound;
                        resolve();
                    },
                    undefined,
                    (error) => reject(error)
                );
            });
        };

        // Add loading tasks
        // soundPromises.push(loadSound('/sounds/loading-screen.mp3', 'loadingScreen'));
        // soundPromises.push(loadSound('/sounds/gameplay-music.mp3', 'gameplayMusic'));
        soundPromises.push(loadSound('../assets/sound/shot.mp3', 'gunShot'));
        soundPromises.push(loadSound('./assets/sound/redLightF.mp3', 'redLight'));

        // Return a promise that resolves when all sounds are loaded
        Promise.all(soundPromises).then(() => {
            this.onLoadCallback();
        });
    }

    playSound(soundName) {
        const sound = this.sounds[soundName];
        if (sound && !sound.isPlaying) {
            sound.play();
        }
    }

    stopSound(soundName) {
        const sound = this.sounds[soundName];
        if (sound && sound.isPlaying) {
            sound.stop();
        }
    }
}

export default SoundManager;
