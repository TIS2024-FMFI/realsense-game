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
let language_sk = false; // Podmienka na vykreslenie textu
let language_en = true;
if (language_sk) {
    language_en = false;
}
let timerText; // Text časovača
let timeLeft = 120; // 2 minúty v sekundách
let timerEvent;
let timerBackground; // Sivý štvorcový podklad pre časovač
let greenScreen; // Zelená obrazovka

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

function create() {
    const room = new Room(this);

    const bins = ['binYellow', 'binBlue', 'binGreen', 'binRed', 'binOrange', 'binBlack'];
    const names_sk = ["Plast", "Papier", "Sklo", "Kov", "Bioodpad", "Komunálny\nodpad"];
    const names_en = ["Plastic", "Paper", "Glass", "Metal", "Bio\nwaste", "Municipal\nwaste"];
    let bin = 0;

    for (let i = 2; i < 14; i += 2) {
        const positionArray = [i / 10 + 0.05, 0.2, 100]; // x, y, z
        if (shouldDrawText && language_sk) {
            drawText(this, positionArray[0], positionArray[1], names_sk[bin]);
        }else if(shouldDrawText && language_en){
            drawText(this, positionArray[0], positionArray[1], names_en[bin]);
        }

        const container = new Container(this, positionArray[0], positionArray[1], positionArray[2], bins[bin]);
        container.binImage.setDepth(0);

        new Target(this, positionArray[0] + 0.01, positionArray[1], positionArray[2], 'target');

        bin++;
    }
    const waste = new Waste(this);
    createTimerBackground(this);
    createTimerText(this);
    initializeTimerEvent(this);
    createGreenScreen(this);
}

// Funkcia na vytvorenie sivého podkladu pre časovač
function createTimerBackground(scene) {
    const squareSize = 100;
    const margin = 20;
    timerBackground = scene.add.rectangle(
        scene.cameras.main.width - margin - squareSize / 2,
        squareSize / 2 + margin,
        squareSize,
        squareSize,
        0x808080
    );
    timerBackground.setDepth(1);
}

// Funkcia na vytvorenie textu časovača
function createTimerText(scene) {
    timerText = scene.add.text(
        timerBackground.x,
        timerBackground.y,
        formatTime(timeLeft),
        { fontSize: '24px', fill: '#fff', fontFamily: 'Arial' }
    );
    timerText.setOrigin(0.5, 0.5);
    timerText.setDepth(2);
}

// Funkcia na inicializáciu časovača
function initializeTimerEvent(scene) {
    timerEvent = scene.time.addEvent({
        delay: 1000, // 1 sekunda
        callback: updateTimer,
        callbackScope: scene,
        loop: true
    });
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

//funkcia na update časovača
function updateTimer() {
    timeLeft -= 1;
    timerText.setText(formatTime(timeLeft));
    if (timeLeft <= 0) {
        timerEvent.remove(false);
        showGreenScreen(this);
    }
}

//funkcia na formatovanie času
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

//funkcia na zobrazenie zelenej obrazovky
function showGreenScreen(scene) {
    greenScreen.setVisible(true);
    scene.children.bringToTop(greenScreen);
}

//funkcia na resetovanie hry
function resetGame(scene) {
    greenScreen.setVisible(false);
    timeLeft = 120;
    timerText.setText(formatTime(timeLeft));
    timerEvent.reset({
        delay: 1000,
        callback: updateTimer,
        callbackScope: scene,
        loop: true
    });
    new Waste(scene);
}

// zmenň veľkosť hry, keď je zmenená veľkosť obrazovky
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
