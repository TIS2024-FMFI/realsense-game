import {LANGUAGES, textStyle} from './Config.js';
import Game from './Game.js';

export class MainGame extends Phaser.Scene{
    constructor() {
        super({ key: 'MainGame' });
    }

    init(data) {
        this.data = data; // Inicializácia údajov od predošlej scény
        console.log('Data received in MainGame:', this.data);
    }

    create() {
        console.log('som v create main');
        if (this.data.players == 1) {
            console.log('prisiel som sem');
            this.gameMode = new Game(this.scene, this.data);
        }
        this.gameMode.create();
        // Zobrazí všetky údaje, ktoré sú v this.data
    }

}
