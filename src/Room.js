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

        function parseMessageData(message) {
            const dataParts = message.split(',');

            if (dataParts.length < 3) {
                throw new Error("Invalid message format");
            }
            if(dataParts.length === 3){
                console.log("OKAY : PRESNE 3")
            }
            if(dataParts.length > 3){
                console.log("OKAY : VIAC AKO 3")
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

        window.addEventListener('keydown', (event) => {
            buffer += event.key;

            if (buffer.includes(START_CHAR) && buffer.includes(END_CHAR)) {
                const startIdx = buffer.indexOf(START_CHAR);
                const endIdx = buffer.indexOf(END_CHAR, startIdx);

                if (startIdx >= 0 && endIdx > startIdx) {
                    const message = buffer.substring(startIdx + 1, endIdx);

                    try {
                        const parsedData = parseMessageData(message);
                        this.handleMouseClick(parsedData)

                        console.log("Parsed Data:", parsedData);
                    } catch (error) {
                        console.error("Error parsing message:", error);
                    }

                    buffer = "";
                }
            }
        });
        // Listen for mouse click events
        this.scene.input.on('pointerup', (pointer) => this.handleMouseClick(pointer));

        // Array to store multiple ball instances
        this.balls = [];
    }

    preload() {
        // Load the background image for the back wall
        this.scene.load.image('backWall', 'images/background.png'); // Update with your image path
        this.scene.load.image('ball', 'images/ball2.png');
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

    handleMouseClick(data) {
        // Get the click position
        const targetX = data.x;
        const targetY = data.y;
        let parabole;
        if(data.a === undefined){
            console.warn("Nedefinovane koeficienty paraboly, pouzijem defaultne hodnoty");
            parabole = {
                a: 0.02,
                b: -2,
                c: 100,
                x : data.x,
                y : data.y,
            }
        }
        else{
            parabole = {
                a: data.a,
                b: data.b,
                c: data.c,
                x : data.x,
                y : data.y,
            }
        }
        // TODO testovacie data na funkcnost s mysou
        const parabolaMouse = {
            a: 0.58,
            b: -2.06,
            c: 1.688,
            x : 478,
            y : 294,
            avgX : -5,
        }
        // parabole.z = -parabole.b - Math.sqrt(parabole.b * parabole.b - 4 * parabole.a * parabole.c);
        // console.warn(`Z: ${parabole.z}`);
        // Create a new Ball and store the instance in the balls array
        // const ball = new Ball(this.scene, parabole.x, parabole.y, parabole.z, 'ball');
        // // TODO zmena velkosti lopticky a spead nie su kompatibilne
        // ball.moveAlongParabola(parabole.a, parabole.b, parabole.c, parabole.z, 800, 1, 1);

        parabolaMouse.z = -parabolaMouse.b - Math.sqrt(parabolaMouse.b * parabolaMouse.b - 4 * parabolaMouse.a * parabolaMouse.c);
        console.warn(`Z: ${parabolaMouse.z}`);


        // Create a new Ball and store the instance in the balls array
        const ball = new Ball(this.scene, parabolaMouse.x, parabolaMouse.y, parabolaMouse.z, 'ball', parabolaMouse.avgX);
        // TODO zmena velkosti lopticky a spead nie su kompatibilne
        ball.moveAlongParabola(parabolaMouse.a, parabolaMouse.b, parabolaMouse.c, parabolaMouse.z, 30, 1, 1);

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