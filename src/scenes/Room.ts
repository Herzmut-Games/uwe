import { Scene } from 'phaser';
import { Score } from '../objects/Score';

export class Room extends Scene {
    private _score: Score;
    constructor() {
        super({ key: 'Room' });
    }

    public preload() {
        this.load.image('background', 'assets/backgrounds/room.png');
    }

    public create() {
        this._score = new Score(this);
        this.physics.world.setBounds(0, 0, 800, 600);

        const background = this.add.image(0, 0, 'background');
        background.setOrigin(0, 0).setDisplaySize(800, 600);
    }

    public update(): void {
        this._score.update();
    }
}
