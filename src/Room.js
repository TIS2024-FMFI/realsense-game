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
        this.scene.input.on('pointerdown', (pointer) => this.handleMouseClick(pointer));

        // Array to store multiple ball instances
        this.balls = [];
    }

    preload() {
        // Load the background image for the back wall
        this.scene.load.image('backWall', 'images/background.png'); // Update with your image path
        this.scene.load.image('ball', 'images/ball2.png');
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

        // Create a new Ball and store the instance in the balls array
        const ball = new Ball(this.scene, targetX, targetY, 0, 'ball');
        // TODO zmena velkosti lopticky a spead nie su kompatibilne
        ball.moveAlongParabola(0.02, -2, 100, 0, 800, 1, 1);

        // Add the new ball to the balls array
        this.balls.push(ball);

        console.log(`Ball created at (${ball.x}, ${ball.y})`);
    }

    update() {
        // Update each ball if it's moving
        this.balls.forEach(ball => {
            if (ball.moving) {
                // You can add additional logic here to update the ball
            }
        });
    }
}

export default Room;
