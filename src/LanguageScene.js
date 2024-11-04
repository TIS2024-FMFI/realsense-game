// js/LanguageScene.js
import { LANGUAGES } from './Config.js';

export class LanguageScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LanguageScene' });
    }

    create() {
        const graphics = this.add.graphics();
        const fullWidth = this.cameras.main.width;
        const halfWidth = fullWidth / 2;
        const fullHeight = this.cameras.main.height;

        graphics.fillStyle(0x00ff00, 1); // Green for SK
        graphics.fillRect(0, 0, halfWidth, fullHeight);

        graphics.fillStyle(0xff0000, 1); // Red for EN
        graphics.fillRect(halfWidth, 0, halfWidth, fullHeight);

        this.add.text(halfWidth / 2, fullHeight / 2 - 20, `${LANGUAGES.sk.language} (${LANGUAGES.sk.lang})`, { fontSize: '32px', fill: '#000000', fontFamily: 'Arial', fontWeight: 'bold' }).setOrigin(0.5);
        this.add.text(halfWidth + (halfWidth / 2), fullHeight / 2 - 20, `${LANGUAGES.en.language} (${LANGUAGES.en.lang})`, { fontSize: '32px', fill: '#000000', fontFamily: 'Arial', fontWeight: 'bold' }).setOrigin(0.5);

        this.input.on('pointerdown', (pointer) => {
            if (pointer.x >= 0 && pointer.x <= halfWidth) {
                console.log("Slovak selected");
                this.scene.start('MenuScene', { language: 'SK' }); // Pass language to MenuScene
            } else if (pointer.x >= halfWidth && pointer.x <= fullWidth) {
                console.log("English selected");
                this.scene.start('MenuScene', { language: 'EN' }); // Pass language to MenuScene
            }
        });
    }
}
