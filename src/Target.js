import { perspectiveProjection } from './helpers/Helper.js';
import { TARGET_HEIGHT, TARGET_WIDTH } from "./Config.js";

export class Target {
    constructor(scene, relativeX, relativeY, z, imageKey) {
        this.scene = scene;
        this.relativeX = relativeX;  // Relative X position (percentage of camera width)
        this.relativeY = relativeY*1.6;  // Relative Y position (percentage of camera height)
        this.z = z;                  // Depth value
        this.imageKey = imageKey;

        this.createTarget();

        window.addEventListener('resize', () => this.updatePosition());
    }

    createTarget() {
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;

        // Calculate absolute positions based on relative coordinates
        this.x = this.relativeX * width;
        this.y = this.relativeY * height;

        // Projected positions for depth
        const projectedX = perspectiveProjection([this.x, this.y, this.z], 0);
        const projectedY = height - (this.y + perspectiveProjection([this.x, this.y, this.z], 2));

        // Create an image object at the projected position
        this.targetImage = this.scene.add.image(projectedX, projectedY, this.imageKey);

        // Set target size and ensure it has higher depth
        this.targetImage.setDisplaySize(width * TARGET_WIDTH * 0.2, height * TARGET_HEIGHT * 0.2);
        this.targetImage.setDepth(200); // Higher depth to appear in front of containers

        // Store original position and depth for resizing
        this.originalPosition = [this.relativeX, this.relativeY, this.z];
    }

    updatePosition() {
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;

        // Recalculate absolute positions based on original relative coordinates
        this.x = this.originalPosition[0] * width;
        this.y = this.originalPosition[1] * height;

        // Projected positions for depth
        const projectedX = perspectiveProjection([this.x, this.y, this.z], 0);
        const projectedY = height - (this.y + perspectiveProjection([this.x, this.y, this.z], 2));

        // Update the position and size of the image
        this.targetImage.setPosition(projectedX, projectedY);
        this.targetImage.setDisplaySize(width * TARGET_WIDTH, height * TARGET_HEIGHT);
    }
}

export default Target;