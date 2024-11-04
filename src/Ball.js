// Ball.js

export class Ball {
    constructor(scene, targetX, targetY, size = 20) { // Added size parameter with a default value
        this.scene = scene;

        // Set the starting position to be in front of the viewer
        this.startX = targetX; // Target X position where the user clicked
        this.startY = targetY; // Target Y position where the user clicked
        this.startZ = 500; // Starting Z position (in front of the viewer)

        // Create a yellow ball at the starting position
        this.ball = this.scene.add.circle(this.startX, this.startY, size, 0xFFFF00); // Use the size parameter

        this.animationDuration = 2000; // Duration of the animation in milliseconds

        // Add shine effect
        this.addShineEffect();

        // Start the animation
        this.animate();
    }

    animate() {
        // Move the ball towards the target position while shrinking
        this.scene.tweens.add({
            targets: this.ball,
            x: this.startX, // Target X position
            y: this.startY, // Target Y position
            scaleX: 0.4, // Shrink horizontally
            scaleY: 0.4, // Shrink vertically
            duration: this.animationDuration,
            ease: 'Power1', // Easing function for a smoother effect
            onComplete: () => {
                this.ball.destroy(); // Destroy the ball after the animation
            }
        });
    }

    addShineEffect() {
        // Create a graphics object for the shine
        const shine = this.scene.add.graphics();

        // Draw a shine effect
        shine.fillStyle(0xffffff, 0.5); // White shine color
        shine.fillCircle(this.startX - 10, this.startY - 10, 10); // Position and size of the shine

        // Fade out shine over time
        this.scene.tweens.add({
            targets: shine,
            alpha: 0,
            duration: 500, // Duration of shine effect
            onComplete: () => {
                shine.destroy(); // Remove shine after the animation
            }
        });
    }
}

export default Ball;
