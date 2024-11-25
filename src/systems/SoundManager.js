import * as THREE from 'three';

class SoundManager {
    constructor(listener) {
        this.audioLoader = new THREE.AudioLoader();
        this.listener = listener;

        // Sounds dictionary
        this.sounds = {
            loadingScreen: null,
            gameplayMusic: null,
            gunShot: null,
            dollToggle: null,
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
        soundPromises.push(loadSound('/sounds/loading-screen.mp3', 'loadingScreen'));
        soundPromises.push(loadSound('/sounds/gameplay-music.mp3', 'gameplayMusic'));
        soundPromises.push(loadSound('/sounds/gunshot.mp3', 'gunShot', true));
        soundPromises.push(loadSound('/sounds/doll-toggle.mp3', 'dollToggle'));

        // Return a promise that resolves when all sounds are loaded
        return Promise.all(soundPromises);
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
