// js/LabelScene.js
import {LANGUAGES, textStyle} from '../Config.js';

export class LabelScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LabelScene' });
        this.language = 'EN'; // Default language
    }

    init(data) {
        // Get the selected language from the data passed when transitioning
        this.language = data.language || 'en'; // Default to English if not set
        this.players = data.players;
    }

    preload() {
        // Load any assets if necessary
    }

    create() {
        // Create a graphics object
        const {fullWidth, halfWidth, fullHeight} = this.initiateScreen();

        this.add.text(halfWidth / 2, fullHeight / 2 - 20, `${LANGUAGES[this.language].labelsTrue}`, textStyle).setOrigin(0.5);
        this.add.text(halfWidth + (halfWidth / 2), fullHeight / 2 - 20, `${LANGUAGES[this.language].labelsFalse}`,textStyle).setOrigin(0.5);

        this.input.on('pointerdown', (pointer) => {
            if (pointer.x >= 0 && pointer.x <= halfWidth) {
                console.log("With labels");
                this.scene.start('DifficultyScene', {
                    language: this.language,
                    players: this.players,
                    labels: true
                }); // Pass language to MenuScene
            } else if (pointer.x >= halfWidth && pointer.x <= fullWidth) {
                console.log("Without Labels");
                this.scene.start('DifficultyScene', {
                    language: this.language,
                    players: this.players,
                    labels: false
                }); // Pass language to MenuScene
            }
        });

        // You can add more functionality as needed, such as transitioning to the game.
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
