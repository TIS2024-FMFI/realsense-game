export class Ball {
    constructor(scene, x, y, z, imageKey, wind) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.z = z;
        this.imageKey = imageKey;
        this.wind = wind;
        this.scale = 0.3;

        this.sprite = null;
        this.moving = false;



        this.initialize();
    }

    /**
     * Initialize the ball by preloading assets and creating the sprite.
     */
    initialize() {
        this.preloadImage();
        this.createSprite();
    }

    /**
     * Preload the ball image if it isn't already loaded.
     */
    preloadImage() {
        if (!this.scene.textures.exists(this.imageKey)) {
            this.scene.load.image(this.imageKey, 'images/ball2.png');
            this.scene.load.start();
        }
    }

    /**
     * Create the ball sprite and set its initial position.
     */
    createSprite() {
        this.sprite = this.scene.add.image(this.x, this.y, this.imageKey);
        this.sprite.setScale(this.scale);
    }

    /**
     * Update the position of the ball.
     * @param {number} x - New X-coordinate.
     * @param {number} y - New Y-coordinate.
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        if (this.sprite) {
            this.sprite.setPosition(x, y);
        }
    }

    /**
     * Reset the ball's state by stopping its movement.
     */
    reset() {
        this.moving = false;
    }

    /**
     * Check if the ball has finished moving.
     * @returns {boolean} - True if the ball is not moving.
     */
    hasFinishedMoving() {
        return !this.moving;
    }

    /**
     * Move the ball along a parabolic trajectory.
     * @param {number} a - Parabola coefficient for z^2.
     * @param {number} b - Parabola coefficient for z.
     * @param {number} c - Constant coefficient.
     * @param {number} startZ - Starting z position.
     * @param {number} endZ - Ending z position.
     * @param {number} step - Step size for z increments.
     * @param {number} speed - Delay (in ms) between updates.
     */
    moveAlongParabola(a, b, c, startZ, endZ, step = 0.5, speed = 50) {
        if (this.moving) return;

        this.moving = true;
        let currentZ = startZ;

        const updatePosition = () => {
            if (this.shouldStopMoving(currentZ, endZ, step)) {
                this.moving = false;
                return;
            }

            this.updateBallPosition(a, b, c, currentZ);
            currentZ += step;

            this.scene.time.delayedCall(speed, updatePosition);
        };

        updatePosition();
    }

    /**
     * Determine if the ball should stop moving.
     * @param {number} currentZ - Current z position.
     * @param {number} endZ - Ending z position.
     * @param {number} step - Step size for z increments.
     * @returns {boolean} - True if the movement should stop.
     */
    shouldStopMoving(currentZ, endZ, step) {
        return (step > 0 && currentZ > endZ) || (step < 0 && currentZ < endZ);
    }



    /**
     * Update the ball's position and scale during movement.
     * @param {number} a - Parabola coefficient for z^2.
     * @param {number} b - Parabola coefficient for z.
     * @param {number} c - Constant coefficient.
     * @param {number} currentZ - Current z position.
     */
    updateBallPosition(a, b, c, currentZ) {
        const y = a * currentZ ** 2 + b * currentZ + c;
        const x = this.x + this.wind;
        this.scale = Math.max(this.scale * 0.95, 0.1); // Prevent shrinking below 0.1

        this.sprite.setScale(this.scale);
        this.setPosition(x, y);
    }

    destroy() {
        if (this.sprite) {
            this.sprite.destroy();
            this.sprite = null;
            console.log("Ball sprite destroyed.");
        }
    }

}

export default Ball;
