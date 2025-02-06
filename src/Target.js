import { perspectiveProjection } from './helpers/Helper.js';
import { TARGET_HEIGHT, TARGET_WIDTH } from "./Config.js";

export class Target {
    constructor(scene, relativeX, relativeY, z, imageKey) {
        this.scene = scene;
        this.relativeX = relativeX;
        this.relativeY = relativeY * 1.6;
        this.z = z;
        this.imageKey = imageKey;

        this.createTarget();
        window.addEventListener('resize', () => this.updatePosition());
    }

    createTarget() {
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;

        this.x = this.relativeX * width;
        this.y = this.relativeY * height;

        const projectedX = perspectiveProjection([this.x, this.y, this.z], 0);
        const projectedY = height - (this.y + perspectiveProjection([this.x, this.y, this.z], 2));

        this.targetImage = this.scene.add.image(projectedX, projectedY, this.imageKey);
        this.targetImage.setDisplaySize(width * TARGET_WIDTH * 0.2, height * TARGET_HEIGHT * 0.2);
        this.targetImage.setDepth(200);

        this.projectedX = projectedX;
        this.projectedY = projectedY;
        this.originalPosition = [this.relativeX, this.relativeY, this.z];
    }

    updatePosition() {
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;

        this.x = this.originalPosition[0] * width;
        this.y = this.originalPosition[1] * height;

        const projectedX = perspectiveProjection([this.x, this.y, this.z], 0);
        const projectedY = height - (this.y + perspectiveProjection([this.x, this.y, this.z], 2));

        this.targetImage.setPosition(projectedX, projectedY);
        this.targetImage.setDisplaySize(width * TARGET_WIDTH, height * TARGET_HEIGHT);
    }
}

export default Target;
