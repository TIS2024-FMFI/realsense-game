// js/DifficultyScene.js
import {LANGUAGES, textStyle} from '../Config.js';

export class DifficultyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DifficultyScene' });
        this.language = 'en'; // Default language
    }

    preload(){
        this.load.spritesheet('pic_easy', 'images/CONFIG/pic_easy_spriteSheet.png', { frameWidth: 352, frameHeight: 222 });
        this.load.spritesheet('pic_medium', 'images/CONFIG/pic_medium_spriteSheet.png', { frameWidth: 244, frameHeight: 262 });
        this.load.spritesheet('pic_hard', 'images/CONFIG/pic_hard_spriteSheet.png', { frameWidth: 240, frameHeight: 318 });
    }

    init(data) {
        this.data = data;
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
                frames: this.anims.generateFrameNumbers(pic, { start: 0, end: 14 }),
                frameRate: 6,
                repeat: -1
            });
        });

    }

    initData() {
        this.nextScene = 'ConfigScene';

        if(this.data.players === 1){
            this.numberOfPanels = 3;
            this.colors = [0xa8f05b, 0xf0b95b, 0xf56f42];
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
            this.optionPictures = [
                'pic_easy',
                'pic_medium',
                'pic_hard'
            ]
        }else{
            this.numberOfPanels = 2;
            this.colors = [0xa8f05b, 0xf0b95b];
            this.options = [
                {difficulty: 'easy'},
                {difficulty: 'medium'}
            ]
            this.optionTexts = [
                `${LANGUAGES[this.language].easy}`,
                `${LANGUAGES[this.language].medium}`
            ]
            this.optionPictures = [
                'pic_easy',
                'pic_medium'
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
            graphics.fillStyle(this.colors[i], 1); // Green for SK
            graphics.fillRect(i*width/number, 0, width/number, height);
            let pic = this.add.sprite(i*width/number + (width/number / 2), height / 2 - 20, this.optionPictures[i]);
            pic.play(this.optionPictures[i]+ '_anim');
            this.add.text(i*width/number + (width/number / 2), height / 2 + 100, this.optionTexts[i], textStyle).setOrigin(0.5);
        }
    }
}