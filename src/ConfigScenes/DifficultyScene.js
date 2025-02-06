// js/DifficultyScene.js
import {LANGUAGES, textStyle} from '../Config.js';

export class DifficultyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DifficultyScene' });
        this.language = 'en'; // Default language
    }

    init(data) {
        this.data = data;
    }

    preload() {
        this.load.image('easy', 'images/Configuration/Difficulty/easy.png');
        this.load.image('medium', 'images/Configuration/Difficulty/medium.png');
        this.load.image('hard', 'images/Configuration/Difficulty/hard.png');

    }

    create() {
        this.initData()
        this.initiateScreen();

    }

    initData() {
        this.nextScene = 'ConfigScene';

        if(this.data.players === 1){
            this.numberOfPanels = 3;
            this.colors = [0xFFFFFF, 0xff8800, 0xff0000];
            this.options = [
                {difficulty: 'easy'},
                {difficulty: 'medium'},
                {difficulty: 'hard'}
            ]
            this.optionTexts = [
                `${LANGUAGES[this.data.language].easy}`,
                `${LANGUAGES[this.data.language].medium}`,
                `${LANGUAGES[this.data.language].hard}`
            ]
        }else{
            this.numberOfPanels = 2;
            this.colors = [0x00ff00, 0xff0000 ];
            this.options = [
                {difficulty: 'easy'},
                {difficulty: 'medium'}
            ]
            this.optionTexts = [
                `${LANGUAGES[this.language].easy}`,
                `${LANGUAGES[this.language].medium}`
            ]
        }
    }

    initiateScreen() {
        const graphics = this.add.graphics();
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.makePanels(this.numberOfPanels, graphics, width, height)

        let panelWidth = width/this.numberOfPanels;

        this.input.on('pointerdown', (pointer) => {
            console.log(this.optionTexts[(pointer.x / panelWidth)|0]+" selected");
            let newData = {...this.data,...this.options[(pointer.x / panelWidth)|0]}
            this.scene.start(this.nextScene, newData);
            console.log(newData);
        });
    }

    makePanels(number, graphics, width, height){
        for (let i = 0; i<number; i++){
            graphics.fillStyle(this.colors[0], 1); // Green for SK
            this.image = this.add.image(i*width/number + (width/number / 2), height / 2 - 20, this.options[i].difficulty);
            this.image.setDepth(2);
            this.image.setScale(1.5);
            graphics.fillRect(i*width/number, 0, width/number, height);
            // this.add.text(i*width/number + (width/number / 2), height / 2 - 20, this.optionTexts[i], textStyle).setOrigin(0.5);
        }
    }
}