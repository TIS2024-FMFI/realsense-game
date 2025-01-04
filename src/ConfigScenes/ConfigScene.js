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
        graphics.fillStyle(0x00ff00, 1); // Zelená farba
        graphics.fillRect(0, 0, width, height);

        // Pridanie nápisu "START"
        this.add.text(width / 2, height / 2, 'START', {
            font: '48px Arial',
            fill: '#ffffff',
        }).setOrigin(0.5);

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

    makePanels(number, graphics, width, height){
        const colors = [0xff0000, 0xff8800, 0xffff00, 0x00ff00];
        for (let i = 0; i<number; i++){
            graphics.fillStyle(this.colors[i], 1); // Green for SK
            graphics.fillRect(i*width/number, 0, width/number, height);
            this.add.text(i*width/number + (width/number / 2), height / 2 - 20, this.optionTexts[i], textStyle).setOrigin(0.5);
        }
    }
}