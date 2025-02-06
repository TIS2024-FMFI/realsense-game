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
        this.numberOfPanels = 2;
        this.colors = [0x00ff00, 0xff0000 ];
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
        this.add.text(width / 2, height / 2+160, 'START', {
            font: '48px Arial',
            fill: '#ffffff',
        }).setOrigin(0.5);

        //pridanie animácie
        this.anims.create({
            key: 'pic_loading_anim',
            frames: this.anims.generateFrameNumbers('pic_loading', { start: 0, end: 15 }),
            frameRate: 6,
            repeat: -1
        });
        let pic = this.add.sprite((width / 2), height / 2 - 20, 'pic_loading');
        pic.play('pic_loading_anim');

        // Pridanie klikateľnosti
        this.input.once('pointerdown', () => {
            console.log('idem vedla');
            if(this.data.players==1){
                this.scene.start(this.nextScene1, this.data);
            }else{
                this.scene.start(this.nextScene2, this.data);
            }

        });
    }
}