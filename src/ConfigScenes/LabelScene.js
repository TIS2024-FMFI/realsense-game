// js/LabelScene.js
import {LANGUAGES, textStyle} from '../Config.js';

export class LabelScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LabelScene' });
        this.language = 'EN'; // Default language
    }

    init(data) {
        this.data = data;
    }

    create() {
        this.initData()
        this.initiateScreen();

    }

    initData(){
        this.numberOfPanels = 2;
        this.colors = [0x00ff00,  0xff0000];
        this.nextScene = 'DifficultyScene';
        this.options = [
            {labels: true},
            {labels: false}
        ]
        this.optionTexts = [
            `${LANGUAGES[this.data.language].labelsTrue}`,
            `${LANGUAGES[this.data.language].labelsFalse}`
        ]
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
        const colors = [0xff0000, 0xff8800, 0xffff00, 0x00ff00];
        for (let i = 0; i<number; i++){
            graphics.fillStyle(this.colors[i], 1); // Green for SK
            graphics.fillRect(i*width/number, 0, width/number, height);
            this.add.text(i*width/number + (width/number / 2), height / 2 - 20, this.optionTexts[i], textStyle).setOrigin(0.5);
        }
    }
}