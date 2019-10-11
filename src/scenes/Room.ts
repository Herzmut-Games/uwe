import { Scene } from 'phaser';
import { Score } from '../objects/Score';
import { Player } from '../Player';

export class Room extends Scene {
    private _score: Score;
    private _player: Player;
    constructor() {
        super({ key: 'Room' });
    }

    public preload() {
        this.load.image('background', 'assets/backgrounds/room.png');
        this.load.spritesheet('player', 'assets/player.png', {
            frameWidth: 64,
            frameHeight: 64,
        });
    }

    public create() {
        const background = this.add.image(0, 0, 'background');
        background.setOrigin(0, 0).setDisplaySize(800, 600);

        this._score = new Score(this);
        this._player = new Player(this);
        this.physics.world.setBounds(0, 0, 800, 600);
    }

    public update(): void {
        this._score.update();
        this._player.update();
    }
}
