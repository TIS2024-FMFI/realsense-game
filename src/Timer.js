export class Timer extends Phaser.Scene {
    constructor(imageKey) {
        super({ key: 'Timer' });

        this.imageKey = imageKey;
    }

    init(scene, timeInSeconds, forTwo, onCompleteCallback) {
        this.scene = scene;
        this.timeLeft = timeInSeconds;
        this.onCompleteCallback = onCompleteCallback;
        let squareSize = 50;
        let margin = 20;

        if (forTwo) {
            this.createBackground(this.scene.cameras.main.width / 2 + squareSize + margin, squareSize, margin);
        } else {
            this.createBackground(this.scene.cameras.main.width, squareSize, margin);
        }
        this.createText();
        this.initializeEvent();
    }

    preload() {
        this.load.image('timerBackGround', 'images/timerBackground.png');

    }

    createBackground(x, squareSize, margin) {
        this.timerBackground = this.scene.add.image(
            x - margin - squareSize,
            squareSize / 2 + margin,
            this.imageKey,
            // squareSize,
            // squareSize,
            // 0x808080
        );
        this.timerBackground.setScale(0.25);
        this.timerBackground.setDepth(1);
    }

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

    initializeEvent() {
        this.timerEvent = this.scene.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

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

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    reset(timeInSeconds) {
        this.timeLeft = timeInSeconds;
        this.timerText.setText(this.formatTime(this.timeLeft));
        if (this.timerEvent) {
            this.timerEvent.remove(false);
        }
        this.timerEvent = this.scene.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }
}