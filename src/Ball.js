export class Ball {
    constructor(scene, x, y, imageKey) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, imageKey);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setScale(1); // Initial scale
        this.sprite.setBounce(0.8); // Bounce effect
        this.sprite.setGravityY(300); // Apply gravity
        this.isThrown = false; // Track if the ball has been thrown
    }

    launch(angle, speed) {
        if (this.isThrown) return; // Prevent multiple throws
        this.isThrown = true;

        // Convert angle to radians
        let radians = Phaser.Math.DegToRad(angle);

        // Calculate initial velocity
        let velocityX = speed * Math.cos(radians);
        let velocityY = -speed * Math.sin(radians); // Negative for upward direction

        // Set velocity to the ball
        this.sprite.setVelocity(velocityX, velocityY);

        // Create a tween to shrink the ball for 3D illusion
        this.scene.tweens.add({
            targets: this.sprite,
            scaleX: 0.2,
            scaleY: 0.2,
            duration: 2000,
            ease: 'Linear'
        });
    }

    reset() {
        // Reset ball properties to prepare for another throw
        this.sprite.setPosition(100, 500);
        this.sprite.setScale(1);
        this.sprite.setVelocity(0, 0);
        this.isThrown = false;
    }

    update() {
        // Check if the ball is off-screen or has stopped moving
        if (this.isThrown && (this.sprite.y > 600 || this.sprite.body.velocity.length() < 1)) {
            this.reset();
        }
    }
}

export default Ball;
