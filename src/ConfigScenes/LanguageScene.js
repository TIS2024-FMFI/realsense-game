// js/LanguageScene.js
import {LANGUAGES, textStyle} from '../Config.js';

export class LanguageScene extends Phaser.Scene {
    constructor() {
        //super()
        super({ key: 'LanguageScene' });
    }

    preload(){
        this.load.spritesheet('pic_en', 'images/CONFIG/pic_en_spriteSheet.png', { frameWidth: 256, frameHeight: 177 });
        this.load.spritesheet('pic_sk', 'images/CONFIG/pic_sk_spriteSheet.png', { frameWidth: 256, frameHeight: 177 });
    }

    init(data) {
        this.data = {};
    }

    create() {
        this.initData();
        this.createAnim();
        this.initiateScreen();
    }

    createAnim(){

        this.optionPictures.forEach((pic) => {
            this.anims.create({
                key: pic+'_anim',
                frames: this.anims.generateFrameNumbers(pic, { start: 0, end: 36 }),
                frameRate: 15,
                repeat: -1
            });
        });

    }

    initData(){
        this.numberOfPanels = 2;
        this.colors = [0xa8f05b, 0xf0b95b];
        this.nextScene = 'PlayerScene';
        
        this.options = [
            { language: 'sk' },
            { language: 'en' }
        ]
        this.optionTexts = [
            `${LANGUAGES.sk.language} (${LANGUAGES.sk.lang})`,
            `${LANGUAGES.en.language} (${LANGUAGES.en.lang})`
        ]
        this.optionPictures = [
            'pic_sk',
            'pic_en'
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
            let pic = this.add.sprite(i*width/number + (width/number / 2), height / 2 - 20, this.optionPictures[i]);
            pic.play(this.optionPictures[i]+ '_anim');
            this.add.text(i*width/number + (width/number / 2), height / 2 + 90, this.optionTexts[i], textStyle).setOrigin(0.5);
        }
    }
}
