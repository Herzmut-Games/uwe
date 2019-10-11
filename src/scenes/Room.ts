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
        this.load.image('background', 'assets/backgrounds/map.png');
        this.load.spritesheet('player', 'assets/player.png', {
            frameWidth: 64,
            frameHeight: 64,
        });
    }

    public create() {
        const background = this.add.image(0, 88, 'background');
        background.setOrigin(0, 0).setDisplaySize(800, 512);

        this._score = new Score(this);
        this._player = new Player(this);
        this.physics.world.setBounds(0, 108, 800, 452);
    }

    public update(): void {
        this._score.update();
        this._player.update();
    }
}
