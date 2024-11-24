// Main.js
import { Container } from "./Container.js";
import { Target } from "./Target.js";
import Room from "./Room.js";
import {Waste} from "./Waste.js";
import { Timer } from "./Timer.js";

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

const game = new Phaser.Game(config);   // inicializácia Phaser
let shouldDrawText = true; // Podmienka na vykreslenie textu
let language_sk = false;    // Podmienka na vykreslenie slovenského textu
let language_en = true;     // Podmienka na vykreslenie anglického textu
if(language_sk){
    language_en = false;
}
let greenScreen;
let timer;

//načítanie potrebných obrázkov
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

//vytvorenie scény
function create() {
    const room = new Room(this);        //vytvorenie miestnosti
    createMiddleLine(this);                     // vytvorenie stredovej oddeľovacej čiary
    //vytváranie odpadu
    const waste_left = new Waste(this, this.cameras.main.width / 4, this.cameras.main.height / 4);
    const waste_right = new Waste(this, 3*this.cameras.main.width / 4, this.cameras.main.height / 4);

    const bins = ['binYellow', 'binBlue', 'binGreen', 'binRed'];
    const names_sk = ["Plast", "Papier", "Sklo", "Kov"];
    const names_en = ["Plastic", "Paper", "Glass", "Metal"];

    //vytváranie odapadu
    if(language_sk){
        createBinGroup(this, bins, names_sk, 0.7, 7, 1.7, calculateFirstGroupPosition);
        createBinGroup(this, bins, names_sk, 7.7, 13, 1.7, calculateSecondGroupPosition);
    }else{
        createBinGroup(this, bins, names_en, 0.7, 7, 1.7, calculateFirstGroupPosition);
        createBinGroup(this, bins, names_en, 7.7, 13, 1.7, calculateSecondGroupPosition);
    }

    // Vytvorenie časovača
    timer = new Timer(this, 120, true, () => {
        createGreenScreen(this);
    });
}

//vytvaranie kontajnerov
function createBinGroup(scene, bins, names_sk, start, end, step, positionCalculator) {
    let counter = 1;
    let bin = 0;

    for (let i = start; i < end; i += step) {
        const {positionArray, xText, yText} = positionCalculator(scene, i, counter);

        if (shouldDrawText) {
            drawText(scene, xText, yText, names_sk[bin]);
        }

        const container = new Container(scene, positionArray[0], positionArray[1], positionArray[2], bins[bin]);
        container.binImage.setDepth(0);
        new Target(scene, positionArray[0] + 0.01, positionArray[1], positionArray[2], 'target');

        bin++;
        counter++;
    }
}

//kalkulacia pozicie lavej skupiny kontajnerov
function calculateFirstGroupPosition(scene, i, counter) {
    let positionArray, xText, yText;

    if (counter === 1) {
        positionArray = [i / 10, 0.2, 25];
        xText = (i / 10 + 0.02) * scene.cameras.main.width / 1.5;
        yText = 0.22 * scene.cameras.main.height * 3.7;
    } else if (counter === 4) {
        positionArray = [i / 10 - 0.11, 0.2, 25];
        xText = (i / 10 + 0.05) * scene.cameras.main.width / 1.5;
        yText = 0.22 * scene.cameras.main.height * 3.7;
    } else {
        positionArray = [i / 10 + 0.05, 0.2, 100];
        xText = (i / 10 + 0.05) * scene.cameras.main.width / 1.5;
        yText = positionArray[1] * scene.cameras.main.height * 3.7;
    }
    return { positionArray, xText, yText };
}
//kalkulacia pozicie pravej skupiny kontajnerov
function calculateSecondGroupPosition(scene, i, counter) {
    let positionArray, xText, yText;

    if (counter === 1) {
        positionArray = [i / 10 - 0.1, 0.2, 25];
        xText = (i / 10 + 0.12) * scene.cameras.main.width / 1.5;
        yText = 0.22 * scene.cameras.main.height * 3.7;
    } else if (counter === 4) {
        positionArray = [i / 10 - 0.22, 0.2, 25];
        xText = (i / 10 + 0.13) * scene.cameras.main.width / 1.5;
        yText = 0.22 * scene.cameras.main.height * 3.7;
    } else {
        positionArray = [i / 10 + 0.12, 0.2, 100];
        xText = (i / 10 + 0.12) * scene.cameras.main.width / 1.5;
        yText = positionArray[1] * scene.cameras.main.height * 3.7;
    }

    return { positionArray, xText, yText };
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
    greenScreen.setDepth(1000);
    greenScreen.setVisible(true);
    greenScreen.setInteractive();
    greenScreen.on('pointerdown', () => {
        resetGame(scene);
    });
}

//Funkcia na reset hry po dokončení času
function resetGame(scene) {
    greenScreen.setVisible(false);
    timer.reset(120);
    timer.initializeEvent();
}

//Funkcia na vykreslenie stredovej čiary
function createMiddleLine(scene) {
    const verticalLine = scene.add.graphics();
    verticalLine.lineStyle(10, 0x000000, 1);
    const midX = scene.cameras.main.width / 2; // Stred obrazovky na osi x
    verticalLine.beginPath();
    verticalLine.moveTo(midX, 0); // Začiatok čiary
    verticalLine.lineTo(midX, scene.cameras.main.height); // Koniec čiary
    verticalLine.strokePath();
}

//Funkcia na vykreslenie textu
function drawText(scene, x, y, name) {
    const text = scene.add.text(
        x,
        y,
        name, // Názov kontajnera
        { fontSize: '20px', fill: '#fff', fontFamily: 'Arial', align: 'center' } // Štýl textu
    );
    text.setOrigin(0.5, 0.5);
    text.setDepth(1);
}

// Resize the game when the window is resized
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
