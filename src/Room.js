// Room.js
import Ball from './Ball.js'; // Import the Ball class

export class Room extends Phaser.Scene{
    constructor() {
        super({ key: 'Room' });
    }

    init(scene) {
        this.scene = scene;
        this.width = window.innerWidth; // Initial width
        this.height = window.innerHeight; // Initial height

        this.preload(); // Preload images
        this.drawRoom();

        // Recalculate room properties on window resize
        window.addEventListener('resize', () => this.updateRoom());

        // Listen for mouse click events
        this.scene.input.on('pointerup', (pointer) => this.handleMouseClick(pointer));
    }

    preload() {
        // Load the background image for the back wall
        this.scene.load.image('backWall', 'images/background.png'); // Update with your image path
    }

    drawRoom() {

        // Add the background image for the back wall
        this.backWall = this.scene.add.image(0, 0, 'backWall');
        this.backWall.setOrigin(0, 0); // Set origin to top-left corner
        this.backWall.setDisplaySize(this.width, this.height); // Adjust the size
    }

    updateRoom() {
        // Update dimensions based on window size
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.floorDepth = this.height * 0.3; // Recalculate floor depth

        // Redraw the room with updated dimensions
        this.drawRoom();

        // Update the back wall position and size
        this.backWall.setPosition(0, 0); // Ensure back wall position is correct
        this.backWall.setDisplaySize(this.width, this.height); // Ensure back wall size is updated
    }

    handleMouseClick(pointer) {
        // Get the click position
        const targetX = pointer.x;
        const targetY = pointer.y;

        const ballSize = 100;
        // Create a new Ball that starts in front of the viewer and moves to the clicked position
        new Ball(this.scene, targetX, targetY, ballSize);
    }
}

export default Room;