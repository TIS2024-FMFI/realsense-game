export class Timer extends Phaser.Scene {
    constructor() {
        super({ key: 'Timer' });
    }

    init(parentScene, image, timeInSeconds, forTwo, onCompleteCallback) {
        this.parentScene = parentScene; // Neprepisujeme `this.scene`
        this.timeLeft = timeInSeconds;
        this.onCompleteCallback = onCompleteCallback;
        this.image = image;

        let squareSize = 50;
        let margin = 20;

        if (forTwo) {
            this.createBackground(this.parentScene.cameras.main.width / 2 + squareSize + margin, squareSize, margin);
        } else {
            this.createBackground(this.parentScene.cameras.main.width, squareSize, margin);
        }

        this.createText(margin);
        this.initializeEvent();
    }

    createBackground(x, squareSize, margin) {
    const POSITION_OFFSET = 2; // Controls vertical positioning
    const backgroundX = x - margin - squareSize;
    const backgroundY = POSITION_OFFSET * (squareSize / 2 + 2 * margin);

    this.timerBackground = this.parentScene.add.image(backgroundX,
                                                        backgroundY,
                                                        this.image
                                                    );
        this.timerBackground.setDepth(1);
        this.timerBackground.setDisplaySize(squareSize * 2, squareSize * 2); // Zväčšenie 2x
    }

    createText(margin) {
        this.timerText = this.parentScene.add.text(
            this.timerBackground.x,
            this.timerBackground.y + margin/2,
            this.formatTime(this.timeLeft),
            { fontSize: '24px', fill: '#000', fontFamily: 'Arial' }
        );
        this.timerText.setOrigin(0.5, 0.5);
        this.timerText.setDepth(100);
    }

    initializeEvent() {
        this.timerEvent = this.parentScene.time.addEvent({
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
        this.timerEvent = this.parentScene.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }
}
