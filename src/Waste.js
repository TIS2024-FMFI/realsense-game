// waste.js
export class Waste {
    constructor(scene, x, y) {
        this.scene = scene;


        // Zoznam obrázkov odpadu
        this.images = ['bulb', 'button', 'CD', 'teddy', 'toothbrush', 'box', 'newspaper', 'newspaper_roll', 'paper_cup', 'apple2', 'apple', 'banana', 'beet', 'orange', 'bottle', 'broken_bottle', 'glass', 'mirror', 'shards', 'buckle', 'can', 'key', 'pot', 'scissors', 'bag', 'bottle2', 'crumpled_bottle', 'cup', 'packing'];

        // Vyber náhodný obrázok z images
        const randomImageKey = Phaser.Utils.Array.GetRandom(this.images);


        // Nakreslenie bieleho kruhu
        this.circle = this.scene.add.circle(x, y, 100, 0xffffff);
        this.circle.setDepth(1);

        // Pridanie obrázku do stredu kruhu
        this.image = this.scene.add.image(x, y, randomImageKey);
        this.image.setDepth(2); // Obrázok bude nad kruhom

        this.image.setScale(0.5);
    }
}