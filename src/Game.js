// Main.js
import { Container } from "./Container.js";
import Room from "./Room.js";
import { PlayerScene } from './ConfigScenes/PlayerScene.js';
import { LanguageScene } from './ConfigScenes/LanguageScene.js';
import { LabelScene } from './ConfigScenes/LabelScene.js';
import {DifficultyScene} from "./ConfigScenes/DifficultyScene.js";
// import {ConfigScene} from "./ConfigScenes/ConfigScene.js";

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: 0,
            debug: false
        }
    },
    // scene: {
    //     preload: preload,
    //     create: create
    // }// Add the language scene first
    scene : [LanguageScene, PlayerScene, LabelScene,DifficultyScene],
    // scene: [ConfigScene],
    // scene : [LanguageScene, PlayerScene, LabelScene],
};

// Initialize Phaser
const game = new Phaser.Game(config);

function preload() {
    this.load.image('binRed', 'images/red.png');
    this.load.image('binBlue', 'images/blue.png');
    this.load.image('binBlack', 'images/black.png');
    this.load.image('binGreen', 'images/green.png');
    this.load.image('binYellow', 'images/yellow.png');
    this.load.image('backWall', 'images/background.png');
    this.load.image('binOrange', 'images/orange.png');
}

function create() {
    // Create a room instance

    const room = new Room(this);

    const bins = ['binRed', 'binBlue', 'binBlack', 'binGreen', 'binYellow', 'binOrange'];
    let bin = 0;
    for(let i = 2; i < 14; i += 2) {
        const positionArray = [i / 10 + 0.05, 0.2,100]; // x, y, z
        new Container(this, positionArray[0], positionArray[1], positionArray[2], bins[bin]);
        bin++;
    }
}

// Resize the game when the window is resized
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
