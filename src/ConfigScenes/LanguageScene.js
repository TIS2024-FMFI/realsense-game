// js/LanguageScene.js
import {LANGUAGES, textStyle} from '../Config.js';

export class LanguageScene extends Phaser.Scene {
    constructor() {
        //super()
        super({ key: 'LanguageScene' });
    }

    init(data) {
        this.data = {};
    }

    create() {
        this.initData()
        this.initiateScreen();

    }

    initData(){
        this.numberOfPanels = 2;
        this.colors = [0x00ff00, 0xff0000];
        this.nextScene = 'CameraScene';
        this.options = [
            { language: 'sk' },
            { language: 'en' }
        ]
        this.optionTexts = [
            `${LANGUAGES.sk.language} (${LANGUAGES.sk.lang})`,
            `${LANGUAGES.en.language} (${LANGUAGES.en.lang})`
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
        for (let i = 0; i<number; i++){
            graphics.fillStyle(this.colors[i], 1); // Green for SK
            graphics.fillRect(i*width/number, 0, width/number, height);
            this.add.text(i*width/number + (width/number / 2), height / 2 - 20, this.optionTexts[i], textStyle).setOrigin(0.5);
        }
    }
}
