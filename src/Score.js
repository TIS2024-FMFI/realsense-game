export class Score extends Phaser.Scene {
    constructor() {
        super({ key: 'Score' });
    }
    init(scene, image, x, language) {
        this.scene = scene; // Odkaz na scénu
        this.x = x; // Pozícia X
        this.scorePoints = 0; // Inicializácia skóre
        this.language_sk = language;
        this.image = image;

        // Konfigurácie pre pozadie a text
        let squareSizeWidth = 150;
        let squareSizeHeight = 50;
        let margin = 20;

        this.createBackground(x, squareSizeWidth, squareSizeHeight, margin);
        this.createText(); // Vytvorenie textu
    }

    // Vytvorí pozadie skóre
    createBackground(x, squareSizeWidth, squareSizeHeight, margin) {
        console.log(this.scene);
        this.scoreBackground = this.scene.add.image(
            x - 2 * margin - (squareSizeWidth - squareSizeHeight),
            squareSizeHeight / 2 + margin,
            this.image
        );
        this.scoreBackground.setDepth(1);
        this.scoreBackground.setDisplaySize(squareSizeWidth * 2, squareSizeHeight * 2); // Zväčšenie 2x
    }

    // Vytvorí text pre skóre
    createText() {
        this.scoreText = this.scene.add.text(
            this.scoreBackground.x,
            this.scoreBackground.y,
            this.formatScoreText(), // Formátovaný text
            { fontSize: '24px', fill: '#000', fontFamily: 'Arial' }
        );
        this.scoreText.setOrigin(0.5, 0.5);
        this.scoreText.setDepth(100);
    }

    // Pridanie bodov do skóre
    addScore(points) {
        this.scorePoints += points; // Zvýšenie skóre
        this.updateText(); // Aktualizácia zobrazenia textu
    }

    // Aktualizuje text na obrazovke
    updateText() {
        this.scoreText.setText(this.formatScoreText());
    }

    // Formátuje text pre skóre
    formatScoreText() {
        if (this.language_sk){
            return `Skóre: ${this.scorePoints}`; // Text vo formáte "Skore: X"
        }else{
            return `Score: ${this.scorePoints}`; // Text vo formáte "Score: X"
        }
    }

    getScore(){
        return this.scorePoints;
    }
}
