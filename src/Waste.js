// waste.js
export class Waste {
    randomImageKey;
    constructor(scene, x, y, fourContainers, mediumGame) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        // Zoznam obrázkov odpadu
        if (mediumGame) {
            this.images = ['box', 'newspaper', 'newspaper_roll', 'paper_cup', 'bottle', 'broken_bottle', 'glass', 'mirror', 'shards', 'buckle', 'can', 'key', 'pot', 'scissors', 'bag', 'bottle2', 'crumpled_bottle', 'cup', 'packing', 'chips', 'cleaner', 'soap', 'toothpaste', 'glass', 'glasses', 'jug', 'fries', 'package', 'toilettePaper', 'yogurt', 'box2', 'eggs', 'stick', 'glass2', 'parfume', 'can2', 'foil', 'fork', 'screw', 'spoon'];
        } else if(fourContainers){
            this.images = ['box', 'newspaper', 'newspaper_roll', 'paper_cup', 'broken_bottle', 'shards', 'key', 'bag', 'bottle2', 'crumpled_bottle', 'cleaner', 'glass', 'glasses', 'yogurt', 'box2', 'glass2', 'can2', 'fork', 'screw', 'spoon'];
        }else {
            this.images = ['bulb', 'button', 'CD', 'teddy', 'toothbrush', 'box', 'newspaper', 'newspaper_roll', 'paper_cup', 'apple2', 'apple', 'banana', 'beet', 'orange', 'bottle', 'broken_bottle', 'glass', 'mirror', 'shards', 'buckle', 'can', 'key', 'pot', 'scissors', 'bag', 'bottle2', 'crumpled_bottle', 'cup', 'packing', 'chips', 'cleaner', 'soap', 'toothpaste', 'glass', 'glasses', 'jug', 'fries', 'package', 'toilettePaper', 'yogurt', 'candle', 'ceramics', 'diapers', 'shoes', 'tshirt', 'box2', 'eggs', 'stick', 'bread', 'egg', 'flower', 'leaves', 'tea', 'glass2', 'parfume', 'can2', 'foil', 'fork', 'screw', 'spoon'];
        }

        this.generateNew();
    }

    generateNew() {
        // Vyber náhodný obrázok z images
        this.randomImageKey = Phaser.Utils.Array.GetRandom(this.images);

        // Nakreslenie bieleho kruhu
        this.circle = this.scene.add.circle(this.x, this.y, 100, 0xffffff);
        this.circle.setDepth(1);

        // Pridanie obrázku do stredu kruhu
        this.image = this.scene.add.image(this.x, this.y, this.randomImageKey);
        this.image.setDepth(2); // Obrázok bude nad kruhom

        this.image.setScale(0.5);
    }

    getImageKey(){
        return this.randomImageKey;
    }

    destroy() {
        // Znič všetky vizuálne elementy
        if (this.circle) {
            this.circle.destroy();
            this.circle = null;
        }
        if (this.image) {
            this.image.destroy();
            this.image = null;
        }
    }
}