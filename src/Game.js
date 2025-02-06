// Main.js
import { Container } from "./Container.js";
import { Target } from "./Target.js";
import {Room} from "./Room.js";
import { Waste } from "./Waste.js";
import { Timer } from "./Timer.js";
import { Score } from "./Score.js";
import { PlayerScene } from './ConfigScenes/PlayerScene.js';
import { LanguageScene } from './ConfigScenes/LanguageScene.js';
import { DifficultyScene } from "./ConfigScenes/DifficultyScene.js";
import Ball from './Ball.js';
import {ConfigScene} from "./ConfigScenes/ConfigScene.js"; // Import the Ball class
import Ball from './Ball.js'; // Import the Ball class

const targets = [];
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [LanguageScene, PlayerScene, DifficultyScene, ConfigScene], preload: preload,

};


function preload() {
    this.load.image('TimerBG', 'images/timerBG.png');
    this.load.image('Wood', 'images/wood.png');
    this.load.image('backWall', 'images/background.png');
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
    this.load.image('candle', 'images/BLACK/candle.png');
    this.load.image('ceramics', 'images/BLACK/ceramics.png');
    this.load.image('diapers', 'images/BLACK/diapers.png');
    this.load.image('shoes', 'images/BLACK/shoes.png');
    this.load.image('tshirt', 'images/BLACK/tshirt.png');
    this.load.image('box', 'images/BLUE/box_BLUE.png');
    this.load.image('newspaper', 'images/BLUE/newspaper_BLUE.png');
    this.load.image('newspaper_roll', 'images/BLUE/newspaper_roll_BLUE.png');
    this.load.image('paper_cup', 'images/BLUE/paper_cup_BLUE.png');
    this.load.image('fries', 'images/BLUE/fries.png');
    this.load.image('package', 'images/BLUE/package.png');
    this.load.image('toilettePaper', 'images/BLUE/toilettePaper.png');
    this.load.image('box2', 'images/BLUE/box2.png');
    this.load.image('eggs', 'images/BLUE/eggs.png');
    this.load.image('stick', 'images/BLUE/stick.png');
    this.load.image('apple2', 'images/BROWN/apple2_BROWN.png');
    this.load.image('apple', 'images/BROWN/apple_BROWN.png');
    this.load.image('banana', 'images/BROWN/banana_BROWN.png');
    this.load.image('beet', 'images/BROWN/beet_BROWN.png');
    this.load.image('orange', 'images/BROWN/orange_BROWN.png');
    this.load.image('bread', 'images/BROWN/bread.png');
    this.load.image('egg', 'images/BROWN/egg.png');
    this.load.image('flower', 'images/BROWN/flower.png');
    this.load.image('leaves', 'images/BROWN/leaves.png');
    this.load.image('tea', 'images/BROWN/tea.png');
    this.load.image('bottle', 'images/GREEN/bottle_GREEN.png');
    this.load.image('broken_bottle', 'images/GREEN/broken_bottle_GREEN.png');
    this.load.image('glass', 'images/GREEN/glas_GREEN.png');
    this.load.image('mirror', 'images/GREEN/mirror_GREEN.png');
    this.load.image('shards', 'images/GREEN/shards_GREEN.png');
    this.load.image('glass', 'images/GREEN/glass.png');
    this.load.image('glasses', 'images/GREEN/glasses.png');
    this.load.image('jug', 'images/GREEN/jug.png');
    this.load.image('glass2', 'images/GREEN/glass2.png');
    this.load.image('parfume', 'images/GREEN/parfume.png');
    this.load.image('buckle', 'images/RED/buckle_RED.png');
    this.load.image('can', 'images/RED/can_RED.png');
    this.load.image('key', 'images/RED/key_RED.png');
    this.load.image('pot', 'images/RED/pot_RED.png');
    this.load.image('scissors', 'images/RED/scissors_RED.png');
    this.load.image('can2', 'images/RED/can.png');
    this.load.image('foil', 'images/RED/foil.png');
    this.load.image('fork', 'images/RED/fork.png');
    this.load.image('screw', 'images/RED/screw.png');
    this.load.image('spoon', 'images/RED/spoon.png');
    this.load.image('bag', 'images/YELLOW/bag_YELLOW.png');
    this.load.image('bottle2', 'images/YELLOW/bottle_YELLOW.png');
    this.load.image('crumpled_bottle', 'images/YELLOW/crumpled bottle_YELLOW.png');
    this.load.image('cup', 'images/YELLOW/cup_YELLOW.png');
    this.load.image('packing', 'images/YELLOW/packing_YELLOW.png');
    this.load.image('chips', 'images/YELLOW/chips.png');
    this.load.image('cleaner', 'images/YELLOW/cleaning.png');
    this.load.image('soap', 'images/YELLOW/soap.png');
    this.load.image('toothpaste', 'images/YELLOW/toothpaste.png');
    this.load.image('yogurt', 'images/YELLOW/yogurt.png');
}


export class Game extends Phaser.Scene{
    initialTime = 10;
    room;
    easyGame = false;
    mediumGame = true;
    hardGame = false;
    language_sk = true;
    language_en = false;
    greenScreen;
    timer = null;
    score;
    camera;
    balls = [];
    waste;
    target_bin = {};
    bin_image ={};
    bins = ['binYellow', 'binBlue', 'binGreen', 'binRed', 'binBrown', 'binBlack'];
    targets = [];
    containers = [];


    constructor() {
        super({ key: 'Game' });
    }

    preload() {
        this.load.image('TimerBG', 'images/timerBG.png');
        this.load.image('Wood', 'images/wood.png');
        this.load.image('backWall', 'images/background.png');
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
        this.load.image('candle', 'images/BLACK/candle.png');
        this.load.image('ceramics', 'images/BLACK/ceramics.png');
        this.load.image('diapers', 'images/BLACK/diapers.png');
        this.load.image('shoes', 'images/BLACK/shoes.png');
        this.load.image('tshirt', 'images/BLACK/tshirt.png');
        this.load.image('box', 'images/BLUE/box_BLUE.png');
        this.load.image('newspaper', 'images/BLUE/newspaper_BLUE.png');
        this.load.image('newspaper_roll', 'images/BLUE/newspaper_roll_BLUE.png');
        this.load.image('paper_cup', 'images/BLUE/paper_cup_BLUE.png');
        this.load.image('fries', 'images/BLUE/fries.png');
        this.load.image('package', 'images/BLUE/package.png');
        this.load.image('toilettePaper', 'images/BLUE/toilettePaper.png');
        this.load.image('box2', 'images/BLUE/box2.png');
        this.load.image('eggs', 'images/BLUE/eggs.png');
        this.load.image('stick', 'images/BLUE/stick.png');
        this.load.image('apple2', 'images/BROWN/apple2_BROWN.png');
        this.load.image('apple', 'images/BROWN/apple_BROWN.png');
        this.load.image('banana', 'images/BROWN/banana_BROWN.png');
        this.load.image('beet', 'images/BROWN/beet_BROWN.png');
        this.load.image('orange', 'images/BROWN/orange_BROWN.png');
        this.load.image('bread', 'images/BROWN/bread.png');
        this.load.image('egg', 'images/BROWN/egg.png');
        this.load.image('flower', 'images/BROWN/flower.png');
        this.load.image('leaves', 'images/BROWN/leaves.png');
        this.load.image('tea', 'images/BROWN/tea.png');
        this.load.image('bottle', 'images/GREEN/bottle_GREEN.png');
        this.load.image('broken_bottle', 'images/GREEN/broken_bottle_GREEN.png');
        this.load.image('glass', 'images/GREEN/glas_GREEN.png');
        this.load.image('mirror', 'images/GREEN/mirror_GREEN.png');
        this.load.image('shards', 'images/GREEN/shards_GREEN.png');
        this.load.image('glass3', 'images/GREEN/glass.png');
        this.load.image('glasses', 'images/GREEN/glasses.png');
        this.load.image('jug', 'images/GREEN/jug.png');
        this.load.image('glass2', 'images/GREEN/glass2.png');
        this.load.image('parfume', 'images/GREEN/parfume.png');
        this.load.image('buckle', 'images/RED/buckle_RED.png');
        this.load.image('can', 'images/RED/can_RED.png');
        this.load.image('key', 'images/RED/key_RED.png');
        this.load.image('pot', 'images/RED/pot_RED.png');
        this.load.image('scissors', 'images/RED/scissors_RED.png');
        this.load.image('can2', 'images/RED/can.png');
        this.load.image('foil', 'images/RED/foil.png');
        this.load.image('fork', 'images/RED/fork.png');
        this.load.image('screw', 'images/RED/screw.png');
        this.load.image('spoon', 'images/RED/spoon.png');
        this.load.image('bag', 'images/YELLOW/bag_YELLOW.png');
        this.load.image('bottle2', 'images/YELLOW/bottle_YELLOW.png');
        this.load.image('crumpled_bottle', 'images/YELLOW/crumpled bottle_YELLOW.png');
        this.load.image('cup', 'images/YELLOW/cup_YELLOW.png');
        this.load.image('packing', 'images/YELLOW/packing_YELLOW.png');
        this.load.image('chips', 'images/YELLOW/chips.png');
        this.load.image('cleaner', 'images/YELLOW/cleaning.png');
        this.load.image('soap', 'images/YELLOW/soap.png');
        this.load.image('toothpaste', 'images/YELLOW/toothpaste.png');
        this.load.image('yogurt', 'images/YELLOW/yogurt.png');
    }

    init(data) {
        this.data = data;
        this.bin_image['binBlack'] = ['bulb', 'button', 'CD', 'ceramics', 'diapers', 'shoes', 'teddy', 'toothbrush', 'tshirt', 'candle'];
        this.bin_image['binBlue'] = ['box2', 'box', 'eggs', 'fries', 'newspaper', 'newspaper_roll', 'package', 'paper_cup', 'stick', 'toilettePaper'];
        this.bin_image['binBrown'] = ['apple', 'apple2', 'banana', 'beet', 'bread', 'egg', 'flower', 'leaves', 'orange', 'tea'];
        this.bin_image['binGreen'] = ['bottle', 'broken_bottle', 'glass', 'glass2', 'glasses', 'jug', 'mirror', 'parfume', 'shards', 'glass3'];
        this.bin_image['binRed'] = ['buckle', 'can', 'can2', 'foil', 'fork', 'key', 'pot', 'scissors', 'screw', 'spoon'];
        this.bin_image['binYellow'] = ['bag', 'bottle2', 'chips', 'cleaner', 'crumpled_botle', 'cup', 'packing', 'soap', 'toothpaste', 'yogurt'];

        // Set language flags
        this.language_sk = this.data.language === 'sk';
        this.language_en = this.data.language === 'en';

        // Set difficulty flags
        const difficultyLevels = ['easy', 'medium', 'hard'];
        this.easyGame = this.data.difficulty === 'easy';
        this.mediumGame = this.data.difficulty === 'medium';
        this.hardGame = !difficultyLevels.includes(this.data.difficulty) || this.data.difficulty === 'hard';
    }

    create() {
        this.room = new Room();
        this.room.init(this, []);


        if (this.easyGame) {
            this.createContainers(this, 3, 13, 3);
        } else {
            this.createContainers(this, 2, 14, 2);
        }

        this.waste = new Waste(this, this.cameras.main.width / 2, this.cameras.main.height / 4, this.easyGame, this.mediumGame);

        this.room.targets = this.targets;
        this.timer = new Timer();
        this.timer.init(this, 'TimerBG', this.initialTime, false, () => {
            this.createGreenScreen(this);
        });

        this.score = new Score();
        this.score.init(this, 'Wood', this.cameras.main.width, this.language_sk);

        window.addEventListener('pointerup', (pointer) => this.handleMouseClick(pointer));
    }

    createContainers(scene, from, to, plus) {
        let bin = 0;
        const names_sk = ["Plast", "Papier", "Sklo", "Kov", "Bioodpad", "Komunálny\nodpad"];
        const names_en = ["Plastic", "Paper", "Glass", "Metal", "Bio\nwaste", "Municipal\nwaste"];
        for (let i = from; i < to; i += plus) {
            const positionArray = [i / 10 + 0.05, 0.2, 100]; // x, y, z
            if(!this.hardGame){
                if (this.language_sk) {
                    this.drawText(scene, positionArray[0], positionArray[1], names_sk[bin]);
                } else if (this.language_en) {
                    this.drawText(scene, positionArray[0], positionArray[1], names_en[bin]);
                }
            }

            const container = new Container(scene, positionArray[0], positionArray[1], positionArray[2], this.bins[bin]);

            container.binImage.setDepth(0);
            const offsetTarget = 1.6;
            const target = new Target(scene, positionArray[0] + 0.01, positionArray[1], positionArray[2], 'target');

            // Correctly map the target to the bin
            this.target_bin[target] = this.bins[bin];
            console.log("Mapped target:", target, "to bin:", this.bins[bin]); // Debugging

            target.targetImage.setDepth(0);

            target.targetType = 'trash';
            this.targets.push(target);
            bin++;

            this.containers.push(container);
        }
    }

    createGreenScreen(scene) {
        // Vytvorenie tmavšej zelenej obrazovky
        this.greenScreen = scene.add.rectangle(
            scene.cameras.main.width / 2,
            scene.cameras.main.height / 2,
            scene.cameras.main.width,
            scene.cameras.main.height,
            0x006400 // Tmavozelená farba
        );

        this.greenScreen.setDepth(999);
        this.greenScreen.setVisible(true);
        this.greenScreen.setInteractive();

        // Vytvorenie bieleho textu v strede obrazovky
        const scoreText = scene.add.text(
            scene.cameras.main.width / 2, // X pozícia (stred)
            scene.cameras.main.height / 2, // Y pozícia (stred)
            `SCORE: ${this.score.getScore()}`, // Text na zobrazenie
            {
                fontSize: '32px', // Veľkosť písma
                color: '#ffffff', // Biela farba textu
                fontStyle: 'bold', // Tučný text
                align: 'center'
            }
        );

        scoreText.setOrigin(0.5); // Nastavenie, aby text bol centrovaný
        scoreText.setDepth(1000); // Zabezpečí, že text je nad zelenou obrazovkou

        // Obsluha kliknutia na zelenú obrazovku
        this.greenScreen.on('pointerdown', () => {
            this.resetGame(scene);
        });
    }

    update(time, delta) {
        this.balls.forEach((ball, ballIndex) => {
            // Check if the ball has finished moving
            if (ball.hasFinishedMoving()) {
                console.log("BALL", ball);
                this.checkBallTargetCollision(ball, ballIndex); // Check for collision
            }
        });
    }

    checkBallTargetCollision(ball, ballIndex) {
        const hitThreshold = 20; // Adjust based on your target and ball sizes
        let hit = false;

        this.targets.forEach((target, targetIndex) => {
            // Calculate the distance between the ball and the target
            const distance = Phaser.Math.Distance.Between(
                ball.sprite.x,
                ball.sprite.y,
                target.targetImage.x,
                target.targetImage.y
            );

            if (distance <= hitThreshold) {
                console.log(`Ball hit target at (${target.targetImage.x}, ${target.targetImage.y})!`);

                // Handle the collision
                this.handleCollision(ball, target, targetIndex);
            }
        });

        ball.sprite.destroy();
        this.balls.splice(ballIndex, 1);
    }

    handleCollision(ball, target, targetIndex) {
        if (ball.sprite && ball.sprite.destroy) {
            ball.sprite.destroy();
        }
        if (target.targetType === 'trash') {
            this.handleTrashHit(target, targetIndex);
        } else {
            this.handleRegularHit(target, targetIndex);
        }
    }

    drawText(scene, x, y, textContent) {
        const WIDTH_SCALE = 1.5;
        const HEIGHT_SCALE = 3.7;
        const text = scene.add.text(
            x * scene.cameras.main.width / WIDTH_SCALE,
            y * scene.cameras.main.height * HEIGHT_SCALE,
            textContent,
            { fontSize: '30px', fill: '#000', fontFamily: 'Comic Sans MS',stroke: '#fff', strokeThickness: 4, align: 'center' }
        );
        text.setOrigin(0.5, 0.5);
        text.setDepth(1);
    }

    resetGame(scene) {
        // Obnoví stránku (refresh browseru)
        window.location.reload();
    }

    handleMouseClick(data) {
        const parabolaMouse = {
            a: -0.0005,  // Controls the curvature
            b: 4,    // Controls the initial upward/forward velocity
            c: data.y,   // Small vertical offset for realism
            x: data.x,
            y: data.y,
            avgX: 0,  // Default for horizontal average (adjust if needed)
        }

        parabolaMouse.z = 0;
        const ball = new Ball(this, parabolaMouse.x, parabolaMouse.y, parabolaMouse.z, 'ball', parabolaMouse.avgX, this.targets);
        ball.moveAlongParabola(parabolaMouse.a, parabolaMouse.b, parabolaMouse.c, parabolaMouse.z, 15, 1, 1);
        this.balls.push(ball);
        console.log(`Ball created at (${ball.x}, ${ball.y})`);
        console.log(targets);
        // this.wasteInRightBin(this.targets[0]);
    }

    handleRegularHit(target) {
        console.log('Regular target hit!');
        this.score.addScore(20); // Add appropriate points

        // Additional logic for regular target hit
        // e.g., play sound, spawn particles, etc.
    }

    handleTrashHit(target, targetIndex) {
        console.log('Trash target hit!');
        this.wasteInRightBin(target, targetIndex);
    }

    wasteInRightBin(target, targetIndex) {
        const targetBinColor = this.bins[targetIndex];

        console.log("Target:", target, "Mapped Bin Color:", targetBinColor); // Debugging

        if (targetBinColor) {
            const targetBinWastes = this.bin_image[targetBinColor];
            console.log("Bin Wastes:", targetBinWastes);

            const currentWasteKey = this.waste.getImageKey();
            console.log("Current Waste Key:", currentWasteKey);

            if (targetBinWastes.includes(currentWasteKey)) {
                this.score.addScore(10);
                this.waste.destroy();
                this.waste.generateNew();
            } else {
                this.score.addScore(-5);
            }
        } else {
            console.error("No bin mapping found for target:", target);
        }
    }

}
/*
// Resize game on window resize
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});


 */
