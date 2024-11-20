// Main.js
import { Container } from "./Container.js";
import { Target } from "./Target.js";
import Room from "./Room.js";
import {Waste} from "./Waste.js";
import { Timer } from "./Timer.js";
import PowerBar from "./PowerBar.js";

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
        create: create,
        update: update
    }// Add the language scene first
    // scene : [LanguageScene, MenuScene],
};

const game = new Phaser.Game(config);   // inicializácia Phaser
let easyGame = true;        //level hry - na počet kontajnerov
let shouldDrawText = true; // Podmienka na vykreslenie textu
let language_sk = false; // Podmienka na vykreslenie slovenského textu
let language_en = true; // Podmienka na vykreslenie anglického textu textu
if (language_sk) {
    language_en = false;
}
let greenScreen;
let timer;
let powerBar;

//načítanie potrebných obrázkov
function preload() {
    this.load.image('binRed', 'images/red.png');
    this.load.image('binBlue', 'images/blue.png');
    this.load.image('binGreen', 'images/green.png');
    this.load.image('binYellow', 'images/yellow.png');
    this.load.image('binOrange', 'images/brown.png');
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

//vytvorenie scény
function create() {
    const room = new Room(this);
    //vytváranie powerbaru
    powerBar = new PowerBar(
        this,
        this.cameras.main.width / 2,
        50,
        this.cameras.main.width * 0.6,
        20
    );
    // Ovládanie powerbaru
    this.input.on('pointerdown', () => {
        powerBar.start();
    });

    this.input.on('pointerup', (pointer) => {
        powerBar.stop();
    });

    //vykreslenie kontajnerov
    if(easyGame){
        createContainers(this, 3, 13, 3);
    }else{
        createContainers(this, 2, 14, 2);
    }

    //vytvorenie odpadu
    const waste = new Waste(this, this.cameras.main.width / 2, this.cameras.main.height / 4);

    // Vytvorenie časovača
    timer = new Timer(this, 120, false, () => {
        createGreenScreen(this);
    });
}

//Funkcia na vytvorenie kontajnerov
function createContainers(scene, from, to, plus){
    let bin = 0;
    const bins = ['binYellow', 'binBlue', 'binGreen', 'binRed', 'binOrange', 'binBlack'];
    const names_sk = ["Plast", "Papier", "Sklo", "Kov", "Bioodpad", "Komunálny\nodpad"];
    const names_en = ["Plastic", "Paper", "Glass", "Metal", "Bio\nwaste", "Municipal\nwaste"];
    for (let i = from; i < to; i += plus) {
        const positionArray = [i / 10 + 0.05, 0.2, 100]; // x, y, z
        if (shouldDrawText && language_sk) {
            drawText(scene, positionArray[0], positionArray[1], names_sk[bin]);
        }else if(shouldDrawText && language_en){
            drawText(scene, positionArray[0], positionArray[1], names_en[bin]);
        }

        const container = new Container(scene, positionArray[0], positionArray[1], positionArray[2], bins[bin]);
        container.binImage.setDepth(0);

        new Target(scene, positionArray[0] + 0.01, positionArray[1], positionArray[2], 'target');

        bin++;
    }
}

// Funkcia na vytvorenie zelenej obrazovky
function createGreenScreen(scene) {
    greenScreen = scene.add.rectangle(
        scene.cameras.main.width / 2,
        scene.cameras.main.height / 2,
        scene.cameras.main.width,
        scene.cameras.main.height,
        0x00ff00
    );
    greenScreen.setVisible(false);
    greenScreen.setInteractive();
    greenScreen.on('pointerdown', () => {
        resetGame(scene);
    });
}

//funkcia na update zatiaľ len powerbaru
function update(time, delta) {
    if (powerBar) {
        powerBar.update(delta);
    }
}

// funkcia na vykreslenie textu
function drawText(scene, x, y, textContent) {
    const text = scene.add.text(
        x * scene.cameras.main.width / 1.5,
        y * scene.cameras.main.height * 3.7,
        textContent,
        { fontSize: '20px', fill: '#fff', fontFamily: 'Arial', align: 'center' }
    );
    text.setOrigin(0.5, 0.5);
    text.setDepth(1);
}

//funkcia na resetovanie hry
function resetGame(scene) {
    greenScreen.setVisible(false);
    timer.reset(120);
    new Waste(scene);
}

// zmenň veľkosť hry, keď je zmenená veľkosť obrazovky
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
