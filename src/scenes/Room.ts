import { Scene } from 'phaser';

export class Room extends Scene {
    constructor() {
        super({ key: 'Room' });
    }

    public preload() {
        this.load.image('background', 'assets/backgrounds/room.png');
    }

    public create() {
        this.physics.world.setBounds(0, 0, 800, 600);

        const background = this.add.image(0, 0, 'background');
        background.setOrigin(0, 0).setDisplaySize(800, 600);
    }
}
