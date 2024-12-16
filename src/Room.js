// Room.js
import Ball from './Ball.js'; // Import the Ball class

export class Room {
    constructor(scene) {
        this.scene = scene;
        this.width = window.innerWidth; // Initial width
        this.height = window.innerHeight; // Initial height
        this.floorDepth = this.height * 0.3; // Depth of the floor
        this.wallWidth = this.width * 0.2; // Width of the walls

        // Create the graphics object for drawing
        this.graphics = this.scene.add.graphics({ fillStyle: { color: 0x7B7B7B } });

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
        // Clear previous graphics
        this.graphics.clear();

        // Add the background image for the back wall
        this.backWall = this.scene.add.image(0, 0, 'backWall');
        this.backWall.setOrigin(0, 0); // Set origin to top-left corner
        this.backWall.setDisplaySize(this.width, this.height); // Adjust the size

        // Draw the floor to cover the background
        this.graphics.fillStyle(0x7B7B7B, 1); // Set floor color
        this.graphics.fillRect(0, this.height - this.floorDepth, this.width, this.floorDepth); // Draw the floor
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
