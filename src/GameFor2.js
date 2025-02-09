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
    scene: [LanguageScene, PlayerScene, DifficultyScene], preload: preload,
};

function preload() {
    this.load.image('TimerBG', 'images/timerBG.png');
    this.load.image('Wood', 'images/wood.png');
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

export class GameFor2 extends Phaser.Scene{
    initialTime = 120;
    hardObject = true;
    language_sk = true;
    language_en = false;
    greenScreen;
    timer;
    scorePlayer1;
    scorePlayer2;
    waste_left;
    waste_right;
    room;
    targets = [];
    balls = [];
    bins = ['binYellow', 'binBlue', 'binGreen', 'binRed', 'binYellow', 'binBlue', 'binGreen', 'binRed',];
    bin_image = {};
    target_bin = {};

    constructor() {
        super({ key: 'GameFor2' });
    }

    preload() {
        this.load.image('TimerBG', 'images/timerBG.png');
        this.load.image('Wood', 'images/wood.png');
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
        this.hardObject = this.data.difficulty !== 'easy';
    }

    create() {
        this.room = new Room();
        this.room.init(this);

        this.createMiddleLine(this);                     // vytvorenie stredovej oddeľovacej čiary

        this.waste_left = new Waste(this, this.cameras.main.width / 4, this.cameras.main.height / 4, true, this.hardObject);
        this.waste_right = new Waste(this, 3*this.cameras.main.width / 4, this.cameras.main.height / 4, true, this.hardObject);

        const bins = ['binYellow', 'binBlue', 'binGreen', 'binRed'];
        const names_sk = ["Plast", "Papier", "Sklo", "Kov"];
        const names_en = ["Plastic", "Paper", "Glass", "Metal"];

        const names = this.language_sk ? names_sk : names_en;

        this.createBinGroup(this, bins, names, 0.7, 7, 1.7, this.calculateFirstGroupPosition);
        this.createBinGroup(this, bins, names, 7.7, 13, 1.7, this.calculateSecondGroupPosition);

        this.timer = new Timer();
        this.timer.init(this, 'TimerBG', this.initialTime, true, () => {
            this.createGreenScreen(this);
        });
        this.scorePlayer1 = new Score();
        this.scorePlayer1.init(this, 'Wood', this.cameras.main.width/5, this.language_sk)
        this.scorePlayer2 = new Score();
        this.scorePlayer2.init(this, 'Wood', this.cameras.main.width, this.language_sk);
      
      window.addEventListener('pointerup', (pointer) => this.handleMouseClick(pointer));
    }

    createBinGroup(scene, bins, names_sk, start, end, step, positionCalculator) {
        let counter = 1;
        let bin = 0;

        for (let i = start; i < end; i += step) {
            const {positionArray, xText, yText} = positionCalculator(scene, i, counter);

            if (!this.hardObject) {
                this.drawText(scene, xText, yText, names_sk[bin]);
            }

            const container = new Container(scene, positionArray[0], positionArray[1], positionArray[2], bins[bin]);
            container.binImage.setDepth(0);
            let target = new Target(scene, positionArray[0] + 0.01, positionArray[1], positionArray[2], 'target');
            this.target_bin[target]=this.bins[bin];
            target.targetImage.setDepth(0);
            target.targetType = 'trash';
            this.targets.push(target);

            bin++;
            counter++;
        }
    }

    calculateFirstGroupPosition(scene, i, counter) {
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
    calculateSecondGroupPosition(scene, i, counter) {
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

    createGreenScreen(scene) {
        this.greenScreen = scene.add.rectangle(
            scene.cameras.main.width / 2,
            scene.cameras.main.height / 2,
            scene.cameras.main.width,
            scene.cameras.main.height,
            0x006400
        );

        this.greenScreen.setDepth(999);
        this.greenScreen.setVisible(true);
        this.greenScreen.setInteractive();

        const message = this.getScoreMessage();

        const scoreText = scene.add.text(
            scene.cameras.main.width / 2,
            scene.cameras.main.height / 2,
            message,
            {
                fontSize: '32px',
                color: '#ffffff',
                fontStyle: 'bold',
                align: 'center'
            }
        );

        scoreText.setOrigin(0.5);
        scoreText.setDepth(1000);

        this.greenScreen.on('pointerdown', () => {
            this.resetGame(scene);
        });
    }

    getScoreMessage() {
        const player1Score = this.scorePlayer1.getScore();
        const player2Score = this.scorePlayer2.getScore();

        if (this.language_sk) {
            if (player1Score > player2Score) {
                return `Vyhral hráč 1 so skórom: ${player1Score}`;
            } else if (player2Score > player1Score) {
                return `Vyhral hráč 2 so skórom: ${player2Score}`;
            } else {
                return `Remíza`;
            }
        } else {
            if (player1Score > player2Score) {
                return `Winner is player 1 with score: ${player1Score}`;
            } else if (player2Score > player1Score) {
                return `Winner is player 2 with score: ${player2Score}`;
            } else {
                return `The game ended in a draw`;
            }
        }
    }

    resetGame(scene) {
        window.location.reload();
    }

    createMiddleLine(scene) {
        const verticalLine = scene.add.graphics();
        verticalLine.lineStyle(10, 0x000000, 1);
        const midX = scene.cameras.main.width / 2; // Stred obrazovky na osi x
        verticalLine.beginPath();
        verticalLine.moveTo(midX, 0); // Začiatok čiary
        verticalLine.lineTo(midX, scene.cameras.main.height); // Koniec čiary
        verticalLine.strokePath();
    }

    drawText(scene, x, y, name) {
        const text = scene.add.text(
            x,
            y,
            name, // Názov kontajnera
            { fontSize: '20px', fill: '#000', fontFamily: 'Comic Sans MS',stroke: '#fff', strokeThickness: 4, align: 'center' }
        );
        text.setOrigin(0.5, 0.5);
        text.setDepth(1);
    }

    handleMouseClick(data) {
        let thrownBy = data.x < this.cameras.main.width / 2 ? 'left' : 'right';
        const ball = new Ball(this, data.x, data.y, 0, 'ball', 0, this.targets);
        ball.moveAlongParabola(-0.0005, 4, data.y, 0, 15, 1, 1);
        ball.thrownBy = thrownBy;
        this.balls.push(ball);
    }

    update() {
        this.balls.forEach((ball, ballIndex) => {
            if (ball.hasFinishedMoving()) {
                console.log(ball)
                this.checkBallTargetCollision(ball, ballIndex); // Check for collision
            }
        });
    }

    checkBallTargetCollision(ball, index) {
        const hitThreshold = 20;
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
        this.balls.splice(index, 1);
    }

    handleCollision(ball, target, targetIndex) {
        if (target.targetType === 'trash') {
            if (ball.thrownBy === 'left') {
                this.wasteInLeftBin(target, targetIndex);
            } else if (ball.thrownBy === 'right') {
                this.wasteInRightBin(target, targetIndex);
            }
        }
    }

    wasteInRightBin(target, targetIndex) {
        const targetBinColor = this.bins[targetIndex];
        if (targetBinColor) {
            const targetBinWastes = this.bin_image[targetBinColor];
            console.log(targetBinColor);
            if (targetBinWastes.includes(this.waste_right.getImageKey())) {
                this.scorePlayer2.addScore(10);
                this.waste_right.destroy();
                this.waste_right.generateNew();
            } else {
                this.scorePlayer2.addScore(-5);
            }
        }
    }

    wasteInLeftBin(target, targetIndex) {
        const targetBinColor = this.bins[targetIndex];
        if (targetBinColor) {
            const targetBinWastes = this.bin_image[targetBinColor];
            if (targetBinWastes.includes(this.waste_left.getImageKey())) {
                this.scorePlayer1.addScore(10);
                this.waste_left.destroy();
                this.waste_left.generateNew();
            } else {
                this.scorePlayer1.addScore(-5);
            }
        }
    }
}

