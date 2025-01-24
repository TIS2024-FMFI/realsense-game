export default class PowerBar extends Phaser.Scene{
    constructor() {
        super({ key: 'PowerBar' });
    }
    init(scene, x, y, width, height, maxPower = 100) {
        this.scene = scene;
        console.log('width, co prisiel:', x);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.maxPower = maxPower;
        this.currentPower = 0;
        this.isInTheEnd = false;

        // Vytvorenie obalu pre powerbar
        this.container = scene.add.rectangle(x, y, width, height, 0x333333);
        this.container.setStrokeStyle(2, 0xffffff);

        // Vytvorenie samotného powerbaru
        this.bar = scene.add.rectangle(x - width / 2, y, 0, height, 0x4caf50);
        this.bar.setOrigin(0, 0.5);

        this.active = false;
    }

    //štart powerbaru
    start() {
        this.currentPower = 0;
        this.active = true;
    }

    //koniec powerbaru
    stop() {
        this.active = false;
        console.log(`Final power: ${this.currentPower}`);       //toto sa bude posielat
    }

    //update powerBaru
    update(delta) {
        if(this.currentPower >= this.maxPower) {
            this.isInTheEnd = true;
        }else if(this.currentPower <= 0) {
            this.isInTheEnd = false;
        }
        if (this.active) {
            if(this.isInTheEnd){
                this.currentPower -= delta * 0.1; // Rýchlosť nabíjania
                this.bar.width = (this.currentPower / this.maxPower) * this.width;
            }else{
                this.currentPower += delta * 0.1; // Rýchlosť nabíjania
                console.log(this.width);
                this.bar.width = (this.currentPower / this.maxPower) * this.width;
            }
        }
    }
}