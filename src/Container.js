// src/Container.js
import { perspectiveProjection } from './helpers/Helper.js';
import { CONTAINER_WIDTH, CONTAINER_HEIGHT } from './Config.js';


export class Container {
    constructor(scene, relativeX, relativeY, z, imageKey) {
        this.scene = scene;
        this.relativeX = relativeX;  // Relative X position (percentage of camera width)
        this.relativeY = relativeY;  // Relative Y position (percentage of camera height)
        this.z = z;                  // Depth value
        this.imageKey = imageKey;

        this.createBin();

        window.addEventListener('resize', () => this.updatePosition());
    }

    createBin() {
        // Calculate actual positions based on relative coordinates
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;

        this.x = this.relativeX * width;
        this.y = this.relativeY * height;
        const projectedX = perspectiveProjection([this.x, this.y, this.z], 0);
        const projectedY = height - (this.y + perspectiveProjection([this.x, this.y, this.z], 2));
        this.binImage = this.scene.add.image(projectedX, projectedY, this.imageKey);
        this.binImage.setDisplaySize(width * CONTAINER_WIDTH, height * CONTAINER_HEIGHT);
        this.binImage.setDepth(this.z);
        this.originalPosition = [this.relativeX, this.relativeY, this.z];
    }

    updatePosition() {
        // Recalculate projected positions on window resize
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;
        this.x = this.originalPosition[0] * width;
        this.y = this.originalPosition[1] * height;
        const projectedX = perspectiveProjection([this.x, this.y, this.z], 0);
        const projectedY = height - (this.y + perspectiveProjection([this.x, this.y, this.z], 2));
        this.binImage.setPosition(projectedX, projectedY);
        const sizeFactor = 1; // Example size factor, adjust as needed
        this.binImage.setDisplaySize(width * CONTAINER_WIDTH, height * CONTAINER_HEIGHT); // Width and height based on room size
    }
}

export default Container;
