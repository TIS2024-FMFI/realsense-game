
export class Timer extends Phaser.Scene{
    constructor() {
        super({ key: 'Timer' });
    }

    init(scene, timeInSeconds, forTwo, onCompleteCallback) {
        this.scene = scene;
        this.timeLeft = timeInSeconds; // Počiatočný čas v sekundách
        this.onCompleteCallback = onCompleteCallback;
        let squareSize = 50;
        let margin = 20;

        if (forTwo){
            this.createBackground(this.scene.cameras.main.width/2+squareSize+margin, squareSize, margin);
        }else{
            this.createBackground(this.scene.cameras.main.width, squareSize, margin);
        }
        this.createText();
        this.initializeEvent();
    }

    // Vytvorenie pozadia časovača
    createBackground(x, squareSize, margin) {
        this.timerBackground = this.scene.add.rectangle(
            x - margin - squareSize,
            squareSize / 2 + margin,
            squareSize,
            squareSize,
            0x808080
        );
        this.timerBackground.setDepth(1);
    }

    // Vytvorenie textu časovača
    createText() {
        this.timerText = this.scene.add.text(
            this.timerBackground.x,
            this.timerBackground.y,
            this.formatTime(this.timeLeft),
            { fontSize: '24px', fill: '#fff', fontFamily: 'Arial' }
        );
        this.timerText.setOrigin(0.5, 0.5);
        this.timerText.setDepth(100);
    }

    // Inicializácia udalosti časovača
    initializeEvent() {
        this.timerEvent = this.scene.time.addEvent({
            delay: 1000, // 1 sekunda
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    // Aktualizácia časovača
    updateTimer() {
        this.timeLeft -= 1;
        this.timerText.setText(this.formatTime(this.timeLeft));
        if (this.timeLeft <= 0) {
            this.timerEvent.remove(false);
            if (this.onCompleteCallback) {
                this.onCompleteCallback();
            }
        }
    }

    // Formátovanie času (minúty:sekundy)
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    // Resetovanie časovača
    reset(timeInSeconds) {
        this.timeLeft = timeInSeconds;
        this.timerText.setText(this.formatTime(this.timeLeft));
        if (this.timerEvent) {
            this.timerEvent.remove(false); // Odstránenie starej udalosti
        }
        this.timerEvent = this.scene.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

}