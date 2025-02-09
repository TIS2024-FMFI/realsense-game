export class Score extends Phaser.Scene {
    constructor() {
        super({ key: 'Score' });
    }
    init(scene, image, x, language) {
        this.scene = scene;
        this.x = x;
        this.scorePoints = 0;
        this.language_sk = language;
        this.image = image;
        let squareSizeWidth = 150;
        let squareSizeHeight = 50;
        let margin = 20;

        this.createBackground(x, squareSizeWidth, squareSizeHeight, margin);
        this.createText();
    }

    createBackground(x, squareSizeWidth, squareSizeHeight, margin) {
        const POSITION_OFFSET = 2;
        const backgroundX = x - POSITION_OFFSET * margin - (squareSizeWidth - squareSizeHeight);
        const backgroundY = squareSizeHeight / 2 + margin;
        this.scoreBackground = this.scene.add.image(
            backgroundX, 
            backgroundY, 
            this.image
        );    
        this.scoreBackground.setDepth(1);
        this.scoreBackground.setDisplaySize(squareSizeWidth * 2, squareSizeHeight * 2); // Zväčšenie 2x
    }

    createText() {
        this.scoreText = this.scene.add.text(
            this.scoreBackground.x,
            this.scoreBackground.y,
            this.formatScoreText(),
            { fontSize: '24px', fill: '#000', fontFamily: 'Arial' }
        );
        this.scoreText.setOrigin(0.5, 0.5);
        this.scoreText.setDepth(100);
    }

    addScore(points) {
        this.scorePoints += points;
        this.updateText();
    }

    updateText() {
        this.scoreText.setText(this.formatScoreText());
    }

    formatScoreText() {
        return `${this.language_sk ? "Skóre" : "Score"}: ${this.scorePoints}`;
    }

    getScore(){
        return this.scorePoints;
    }
}
