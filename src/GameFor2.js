// Main.js
import { Container } from "./Container.js";
import { Target } from "./Target.js";
import Room from "./Room.js";
import {Waste} from "./Waste.js";

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
    scene: {
        preload: preload,
        create: create
    }// Add the language scene first
    // scene : [LanguageScene, MenuScene],
};

// Initialize Phaser
const game = new Phaser.Game(config);

let shouldDrawText = true; // Podmienka na vykreslenie textu

function preload() {
    this.load.image('binRed', 'images/red.png');
    this.load.image('binBlue', 'images/blue.png');
    this.load.image('binGreen', 'images/green.png');
    this.load.image('binYellow', 'images/yellow.png');
    this.load.image('binBrown', 'images/brown.png');
    this.load.image('binBlack', 'images/black.png');
    this.load.image('backWall', 'images/background.png');
    this.load.image('target', 'images/target2.png');
    this.load.image('bulb', 'images/BLACK/bulb_BLACK.png');
    this.load.image('button', 'images/BLACK/button_BLACK.png');
    this.load.image('CD', 'images/BLACK/CD_BLACK.png');
    this.load.image('teddy', 'images/BLACK/teddy_BLACK.png');
    this.load.image('toothbrush', 'images/BLACK/toothbrush_BLACK.png');
    this.load.image('box', 'images/BLUE/box_BLUE.png');
    this.load.image('newspaper', 'images/BLUE/newspaper_BLUE.png');
    this.load.image('newspaper_roll', 'images/BLUE/newspaper_roll_BLUE.png');
    this.load.image('paper_cup', 'images/BLUE/paper_cup_BLUE.png');
    this.load.image('apple2', 'images/BROWN/apple2_BROWN.png');
    this.load.image('apple', 'images/BROWN/apple_BROWN.png');
    this.load.image('banana', 'images/BROWN/banana_BROWN.png');
    this.load.image('beet', 'images/BROWN/beet_BROWN.png');
    this.load.image('orange', 'images/BROWN/orange_BROWN.png');
    this.load.image('bottle', 'images/GREEN/bottle_GREEN.png');
    this.load.image('broken_bottle', 'images/GREEN/broken_bottle_GREEN.png');
    this.load.image('glass', 'images/GREEN/glas_GREEN.png');
    this.load.image('mirror', 'images/GREEN/mirror_GREEN.png');
    this.load.image('shards', 'images/GREEN/shards_GREEN.png');
    this.load.image('buckle', 'images/RED/buckle_RED.png');
    this.load.image('can', 'images/RED/can_RED.png');
    this.load.image('key', 'images/RED/key_RED.png');
    this.load.image('pot', 'images/RED/pot_RED.png');
    this.load.image('scissors', 'images/RED/scissors_RED.png');
    this.load.image('bag', 'images/YELLOW/bag_YELLOW.png');
    this.load.image('bottle2', 'images/YELLOW/bottle_YELLOW.png');
    this.load.image('crumpled_bottle', 'images/YELLOW/crumpled bottle_YELLOW.png');
    this.load.image('cup', 'images/YELLOW/cup_YELLOW.png');
    this.load.image('packing', 'images/YELLOW/packing_YELLOW.png');
}

function create() {
    // Create a room instance

    const room = new Room(this);

    const bins = ['binYellow', 'binBlue', 'binGreen', 'binRed'];
    const names = ["Plast", "Papier", "Sklo", "Kov"]; // Názvy kontajnerov
    let bin = 0;
    let counter = 1;
    let x_text = 0;
    let y_text = 0;
    // Vytvorenie zvislej čiary v strede
    const verticalLine = this.add.graphics();
    verticalLine.lineStyle(10, 0x000000, 1);
    const midX = this.cameras.main.width / 2; // Stred obrazovky na osi x
    verticalLine.beginPath();
    verticalLine.moveTo(midX, 0); // Začiatok čiary
    verticalLine.lineTo(midX, this.cameras.main.height); // Koniec čiary
    verticalLine.strokePath();

    for(let i = 0.7; i < 7; i += 1.7) {
        let positionArray = [];
        if(counter == 1) {
            positionArray = [i / 10, 0.2,25]; // x, y, z
            x_text = (i / 10 + 0.02) *  this.cameras.main.width / 1.5;
            y_text = 0.22 * this.cameras.main.height * 3.7;
        }else if(counter==4){
            positionArray = [i / 10 -0.11, 0.2,25]; // x, y, z      kvoli sur systemu, ktory je left handed, musela som to posunut pre krajsie vykreslovanie
            x_text = (i / 10 + 0.05) * this.cameras.main.width / 1.5;
            y_text = 0.22 * this.cameras.main.height * 3.7;
        }else{
            positionArray = [i / 10 + 0.05, 0.2,100]; // x, y, z
            x_text = (i / 10 + 0.05) * this.cameras.main.width / 1.5;
            y_text = positionArray[1] * this.cameras.main.height * 3.7;
        }
        counter++;
        if (shouldDrawText) {
            // Pridaj text na kontajner
            console.log('x:', positionArray[0]);
            console.log('y:', positionArray[1]);
            const text = this.add.text(
                x_text,
                y_text,
                names[bin], // Názov kontajnera
                { fontSize: '20px', fill: '#fff', fontFamily: 'Arial', align: 'center' } // Štýl textu
            );
            text.setOrigin(0.5, 0.5);
            text.setDepth(1);
        }
        const container = new Container(this, positionArray[0], positionArray[1], positionArray[2], bins[bin]);
        container.binImage.setDepth(0);
        new Target(this, positionArray[0]+0.01, positionArray[1], positionArray[2], 'target');
        bin++;
    }
    counter = 1;
    bin = 0;
    for(let i = 7.7; i < 13; i += 1.7) {
        let positionArray = [];
        if(counter == 1) {
            positionArray = [i / 10 - 0.1, 0.2,25]; // x, y, z
            x_text = (i / 10 + 0.12) *  this.cameras.main.width / 1.5;
            y_text = 0.22 * this.cameras.main.height * 3.7;
        }else if(counter==4){
            positionArray = [i / 10 - 0.22, 0.2,25]; // x, y, z      kvoli sur systemu, ktory je left handed, musela som to posunut pre krajsie vykreslovanie
            x_text = (i / 10 + 0.13) * this.cameras.main.width / 1.5;
            y_text = 0.22 * this.cameras.main.height * 3.7;
        }else{
            positionArray = [i / 10 + 0.12, 0.2,100]; // x, y, z
            x_text = (i / 10 + 0.12) * this.cameras.main.width / 1.5;
            y_text = positionArray[1] * this.cameras.main.height * 3.7;
        }
        counter++;
        if (shouldDrawText) {
            // Pridaj text nad kontajner
            console.log('x:', positionArray[0]);
            console.log('y:', positionArray[1]);
            const text = this.add.text(
                x_text,
                y_text,
                names[bin], // Názov kontajnera
                { fontSize: '20px', fill: '#fff', fontFamily: 'Arial', align: 'center' } // Štýl textu
            );
            text.setOrigin(0.5, 0.5); // Nastav stred textu
            text.setDepth(1);
        }
        const container = new Container(this, positionArray[0], positionArray[1], positionArray[2], bins[bin]);
        container.binImage.setDepth(0);
        new Target(this, positionArray[0]+0.01, positionArray[1], positionArray[2], 'target');
        bin++;
    }
}

// Resize the game when the window is resized
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
