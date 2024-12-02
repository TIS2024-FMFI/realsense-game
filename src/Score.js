export class Score {
    constructor(scene, x, language) {
        this.scene = scene; // Odkaz na scénu
        this.x = x; // Pozícia X
        this.scorePoints = 0; // Inicializácia skóre
        this.language_sk = language;

        // Konfigurácie pre pozadie a text
        let squareSizeWidth = 150;
        let squareSizeHeight = 50;
        let margin = 20;

        this.createBackground(x, squareSizeWidth, squareSizeHeight, margin);
        this.createText(); // Vytvorenie textu
    }

    // Vytvorí pozadie skóre
    createBackground(x, squareSizeWidth, squareSizeHeight, margin) {
        this.scoreBackground = this.scene.add.rectangle(
            x - margin - (squareSizeWidth - squareSizeHeight),
            2 * (squareSizeHeight / 2 + margin) + margin,
            squareSizeWidth,
            squareSizeHeight,
            0x808080 // Sivá farba
        );
        this.scoreBackground.setDepth(1);
    }

    // Vytvorí text pre skóre
    createText() {
        this.scoreText = this.scene.add.text(
            this.scoreBackground.x,
            this.scoreBackground.y,
            this.formatScoreText(), // Formátovaný text
            { fontSize: '24px', fill: '#fff', fontFamily: 'Arial' }
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
