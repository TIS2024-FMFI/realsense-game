// js/ConfigScene.js
import {LANGUAGES, textStyle} from '../Config.js';

export class ConfigScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ConfigScene' });
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
        this.colors = [0x00ff00, 0xff0000 ];
        this.nextScene = 'LanguageScene';
        this.options = [
            {dummy: 'DUMMY1'},
            {dummy: 'DUMMY2'}

            // { language: 'sk' },
            // { language: 'en' }
        ]
        this.optionTexts = [
            "Dummy1",
            "Dummy2"
            // `${LANGUAGES.sk.language} (${LANGUAGES.sk.lang})`,
            // `${LANGUAGES.en.language} (${LANGUAGES.en.lang})`
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
            this.scene.start(this.nextScene, { language: 'sk' });

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
