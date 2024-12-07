export class Ball {
    constructor(scene, x, y, z, imageKey) {
        this.scene = scene; // Reference to the Phaser scene
        this.x = x;         // X-coordinate
        this.y = y;         // Y-coordinate
        this.z = z;         // Z-coordinate
        this.imageKey = imageKey; // Key for the ball image
        this.scale = 0.9;

        this.sprite = null; // Placeholder for the ball sprite
        this.moving = false; // Track if the ball is currently moving
        this.preload();     // Load the ball image
        this.create();      // Draw the ball at the initial position
    }

    preload() {
        // Load the image if not already loaded
        if (!this.scene.textures.exists(this.imageKey)) {
            this.scene.load.image(this.imageKey, 'images/ball2.png');
            this.scene.load.start(); // Trigger the preload to begin
        }
    }

    create() {
        // Draw the ball image at the specified (x, y) position
        this.sprite = this.scene.add.image(this.x, this.y, this.imageKey);
    }

    setPosition(x, y) {
        // Update the position of the ball
        this.x = x;
        this.y = y;
        if (this.sprite) {
            this.sprite.setPosition(x, y);
        }
    }

    reset() {
        // Stop movement and destroy the ball
        this.moving = false;
        if (this.sprite) {
            this.sprite.destroy();
            this.sprite = null;
        }
    }

    moveAlongParabola(a, b, c, startZ, endZ, step = 1, speed = 50) {
        /**
         * Moves the ball along the parabola y = a * z^2 + b * z + c
         * in the z-y plane.
         *
         * @param {number} a - Parabola coefficient for z^2.
         * @param {number} b - Parabola coefficient for z.
         * @param {number} c - Constant coefficient.
         * @param {number} startZ - Starting z position.
         * @param {number} endZ - Ending z position.
         * @param {number} step - Step size for z increments.
         * @param {number} speed - Delay (in ms) between updates.
         */

        if (this.moving) {
            return; // Prevent re-triggering movement while already moving
        }

        this.moving = true; // Mark the ball as moving
        let currentZ = startZ; // Independent z variable for this ball

        const moveStep = () => {
            if (!this.moving || (step > 0 && currentZ > endZ) || (step < 0 && currentZ < endZ)) {
                // Stop moving when the target is reached or ball is reset
                this.moving = false;

                // Destroy the ball once it reaches its destination
                if (this.sprite) {
                    this.sprite.destroy();
                    this.sprite = null;
                }

                return;
            }

            // Calculate the new y position based on the parabola equation
            const y = a * currentZ ** 2 + b * currentZ + c;

            // Shrink the ball progressively by reducing its scale
            this.scale = this.scale * 0.98; // Prevent shrinking below 0.1

            this.sprite.setScale(this.scale, this.scale); // Update the ball's scale
            // Update the ball's position
            this.setPosition(this.x, y);

            // Increment z for the next step
            currentZ += step;

            // Schedule the next step
            this.scene.time.delayedCall(speed, moveStep);
        };

        // Start the movement
        moveStep();
    }
}

export default Ball;
