import Ball from './Ball.js'; // Import the Ball class

export class Room extends Phaser.Scene{
    constructor() {
        super({ key: 'Room' });

    }

    init(scene, targets) {
        this.scene = scene;
        this.width = window.innerWidth; // Initial width
        this.height = window.innerHeight; // Initial height
        this.targets = targets;

        this.preload(); // Preload images
        this.drawRoom();

        // Recalculate room properties on window resize
        window.addEventListener('resize', () => this.updateRoom());

        function parseMessageData(message) {
            const dataParts = message.split(',');

            if (dataParts.length < 3) {
                throw new Error("Invalid message format");
            }
            if(dataParts.length === 3){
                console.log("OKAY : 3")
            }
            if(dataParts.length > 3){
                console.log("OKAY : MORE THAN 3")
            }
            const x = dataParts[0] !== undefined ? parseFloat(dataParts[0]) : undefined;
            const y = dataParts[1] !== undefined ? parseFloat(dataParts[1]) : undefined;
            const speed = dataParts[2] !== undefined ? parseFloat(dataParts[2]) : undefined;
            const a = dataParts[3] !== undefined ? parseFloat(dataParts[3]) : undefined;
            const b = dataParts[4] !== undefined ? parseFloat(dataParts[4]) : undefined;
            const c = dataParts[5] !== undefined ? parseFloat(dataParts[5]) : undefined;
            const avgX = dataParts[6] !== undefined ? parseFloat(dataParts[6]) : undefined;

            console.log("Parsed Data: IN PARSER", { x, y, speed, a, b, c, avgX });
            return { x, y, speed, a, b, c, avgX };
        }
        let buffer = "";

        const START_CHAR = '#';
        const END_CHAR = '*';
        this.balls = [];
    }

    preload() {
        this.scene.load.image('backWall', 'images/background.png'); // Update with your image path
        this.scene.load.image('ball', 'images/ball2.png');
    }

    drawRoom() {
        this.backWall = this.scene.add.image(0, 0, 'backWall');
        this.backWall.setOrigin(0, 0); // Set origin to top-left corner
        this.backWall.setDisplaySize(this.width, this.height); // Adjust the size
    }

    updateRoom() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.floorDepth = this.height * 0.3; // Recalculate floor depth
        this.drawRoom();

        this.backWall.setPosition(0, 0);
        this.backWall.setDisplaySize(this.width, this.height);
    }
}

export default Room;