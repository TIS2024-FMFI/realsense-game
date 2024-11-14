// js/LanguageScene.js
import {LANGUAGES, textStyle} from '../Config.js';

export class LanguageScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LanguageScene' });
    }

    create() {
        const {fullWidth, halfWidth, fullHeight} = this.initiateScreen();

        this.add.text(halfWidth / 2, fullHeight / 2 - 20, `${LANGUAGES.sk.language} (${LANGUAGES.sk.lang})`, textStyle).setOrigin(0.5);
        this.add.text(halfWidth + (halfWidth / 2), fullHeight / 2 - 20, `${LANGUAGES.en.language} (${LANGUAGES.en.lang})`, textStyle).setOrigin(0.5);

        this.input.on('pointerdown', (pointer) => {
            if (pointer.x >= 0 && pointer.x <= halfWidth) {
                console.log("Slovak selected");
                this.scene.start('PlayerScene', { language: 'sk' }); // Pass language to MenuScene
            } else if (pointer.x >= halfWidth && pointer.x <= fullWidth) {
                console.log("English selected");
                this.scene.start('PlayerScene', { language: 'en' }); // Pass language to MenuScene
            }
        });
    }

    initiateScreen() {
        const graphics = this.add.graphics();
        const fullWidth = this.cameras.main.width;
        const halfWidth = fullWidth / 2;
        const fullHeight = this.cameras.main.height;

        graphics.fillStyle(0x00ff00, 1); // Green for SK
        graphics.fillRect(0, 0, halfWidth, fullHeight);

        graphics.fillStyle(0xff0000, 1); // Red for EN
        graphics.fillRect(halfWidth, 0, halfWidth, fullHeight);
        return {fullWidth, halfWidth, fullHeight};
    }
}
