// js/ConfigScene.js
import {LANGUAGES, textStyle} from '../Config.js';


export class ConfigScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ConfigScene' });
        this.language = 'EN'; // Default language
    }

    preload(){
        this.load.spritesheet('pic_loading', 'images/CONFIG/pic_loading_spriteSheet.png', { frameWidth: 480, frameHeight: 480 });
    }

    init(data) {
        this.data = data;
    }

    create() {
        this.initData()
        this.initiateScreen();
        // Zobrazí všetky údaje, ktoré sú v this.data
    }

    initData(){
        this.nextScene1 = 'Game';
        this.nextScene2 = 'GameFor2';
    }

    initiateScreen() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Nastavenie zeleného pozadia
        const graphics = this.add.graphics();
        graphics.fillStyle(0xa8f05b, 1);
        graphics.fillRect(0, 0, width, height);

        // Pridanie nápisu "START"
        let horizontalOffset = width / 2;
        let verticalTextOffset = height / 2 + 160
        this.add.text(horizontalOffset, verticalTextOffset, 'START', {
            font: '48px Arial',
            fill: '#ffffff',
        }).setOrigin(0.5);

        // Manuál
        let manualHorizontalOffset = width / 2;
        let manualVerticalOffset = height / 2 + 240;
        this.add.text(manualHorizontalOffset, manualVerticalOffset, LANGUAGES[this.data.language].manual, {
            font: '20px Arial',
            align: 'center',
            fill: '#000000'
        }).setOrigin(0.5);


        //pridanie animácie
        this.anims.create({
            key: 'pic_loading_anim',
            frames: this.anims.generateFrameNumbers('pic_loading', { start: 0, end: 15 }),
            frameRate: 8,
            repeat: -1
        });

        let verticalPicOffset = height / 2 - 20;
        let pic = this.add.sprite(horizontalOffset, verticalPicOffset, 'pic_loading');
        pic.play('pic_loading_anim');

        // Pridanie klikateľnosti
        this.input.once('pointerdown', () => {
            console.log('idem vedla');
            if(this.data.players === 1){
                this.scene.start(this.nextScene1, this.data);
            }else{
                this.scene.start(this.nextScene2, this.data);
            }

        });
    }
}