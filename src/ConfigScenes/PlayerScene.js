// js/MenuScene.js
import {LANGUAGES, textStyle} from '../Config.js';

export class PlayerScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PlayerScene' });
        this.language = 'EN'; // Default language
    }

    init(data) {
        // Get the selected language from the data passed when transitioning
        this.language = data.language || 'EN'; // Default to English if not set
    }

    preload() {
        // Load any assets if necessary
    }

    create() {
        // Create a graphics object
        const {fullWidth, halfWidth, fullHeight} = this.initiateScreen();

        this.add.text(halfWidth / 2, fullHeight / 2 - 20, `${LANGUAGES[this.language].onePlayer}`, textStyle).setOrigin(0.5);
        this.add.text(halfWidth + (halfWidth / 2), fullHeight / 2 - 20, `${LANGUAGES[this.language].twoPlayers}`,textStyle).setOrigin(0.5);

        this.input.on('pointerdown', (pointer) => {
            if (pointer.x >= 0 && pointer.x <= halfWidth) {
                console.log("One player");
                this.scene.start('LabelScene', {
                    language: this.language,
                    players: "one"
                }); // Pass language to MenuScene
            } else if (pointer.x >= halfWidth && pointer.x <= fullWidth) {
                console.log("Two Players");
                this.scene.start('LabelScene', {
                    language: this.language,
                    players: "two"
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
