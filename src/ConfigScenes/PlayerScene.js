// js/MenuScene.js
import {LANGUAGES, textStyle} from '../Config.js';

export class PlayerScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PlayerScene' });
        this.language = 'en'; // Default language
    }

    preload(){
        this.load.spritesheet('pic_sp', 'images/CONFIG/pic_sp_spriteSheet.png', { frameWidth: 200, frameHeight: 300 });
        this.load.spritesheet('pic_mp', 'images/CONFIG/pic_mp_spriteSheet.png', { frameWidth: 200, frameHeight: 300 });
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
                key: pic[0]+'_anim',
                frames: this.anims.generateFrameNumbers(pic[0], { start: 0, end: pic[1] }),
                frameRate: 15,
                repeat: -1
            });
        });

    }

    initData(){
        this.numberOfPanels = 2;
        this.colors = [0xa8f05b, 0xf0b95b];
        this.nextScene = 'LabelScene';
        this.options = [
            {players: 1},
            {players: 2}
        ]
        this.optionTexts = [
            `${LANGUAGES[this.data.language].onePlayer}`,
            `${LANGUAGES[this.data.language].twoPlayers}`
        ]
        this.optionPictures = [
            ['pic_sp',25],
            ['pic_mp',23]
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
            let pic = this.add.sprite(i*width/number + (width/number / 2), height / 2 - 20, this.optionPictures[i][0]);
            pic.play(this.optionPictures[i][0]+ '_anim');
            this.add.text(i*width/number + (width/number / 2), height / 2 + 100, this.optionTexts[i], textStyle).setOrigin(0.5);
        }
    }
}
