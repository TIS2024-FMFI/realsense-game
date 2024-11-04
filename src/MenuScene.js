// js/MenuScene.js
import { LANGUAGES } from './Config.js';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
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
        const graphics = this.add.graphics();
        const fullWidth = this.cameras.main.width;
        const halfWidth = fullWidth / 2;
        const fullHeight = this.cameras.main.height;

        graphics.fillStyle(0x00ff00, 1); // Green for SK
        graphics.fillRect(0, 0, halfWidth, fullHeight);

        graphics.fillStyle(0xff0000, 1); // Red for EN
        graphics.fillRect(halfWidth, 0, halfWidth, fullHeight);

        const styleGreen = {
            fontSize: '50px',
            fill: '#000000',
            fontFamily: 'Arial Black',
            fontWeight: 'bold'
        }

        const styleRed = {
            fontSize: '50px',
            fill: '#000000',
            fontFamily: 'Arial Black',
            fontWeight: 'bold'
        }
        // Create buttons based on selected language
        if (this.language === 'SK') {
            // Slovak language options
            this.add.text(halfWidth / 2, fullHeight / 2 - 20, `${LANGUAGES.sk.onePlayer}`, {
                fontSize: '50px',
                fill: '#000000',
                fontFamily: 'Arial Black',
                fontWeight: 'bold'
            }).setOrigin(0.5).setInteractive()
                .on('pointerdown', () => {
                    console.log("Playing alone in Slovak");
                    // Start the game for single player
                });

            this.add.text(halfWidth + (halfWidth / 2), fullHeight / 2 - 20, `${LANGUAGES.sk.twoPlayers}`, {
                fontSize: '50px',
                fill: '#000000',
                fontFamily: 'Arial Black',
                fontWeight: 'bold'
            }).setOrigin(0.5).setInteractive()
                .on('pointerdown', () => {
                    console.log("Playing with friend in Slovak");
                    // Start the game for two players
                });
        } else {
            // English language options
            this.add.text(halfWidth / 2, fullHeight / 2 - 20, `${LANGUAGES.en.onePlayer}`, styleGreen).setOrigin(0.5).setInteractive()
                .on('pointerdown', () => {
                    console.log("Playing alone in English");
                    // Start the game for single player
                });

            this.add.text(halfWidth + (halfWidth / 2), fullHeight / 2 - 20, `${LANGUAGES.en.twoPlayers}`, styleRed).setOrigin(0.5).setInteractive()
                .on('pointerdown', () => {
                    console.log("Playing with friend in English");
                    // Start the game for two players
                });
        }

        // You can add more functionality as needed, such as transitioning to the game.
    }
}
