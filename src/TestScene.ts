import { Scene, Physics, GameObjects } from 'phaser';
import { Score } from './Score';
import { screenWidth, screenHeight } from './config';
import { Player } from './Player';

export class TestScene extends Scene {
    private _circles: GameObjects.Arc[] = [];
    private _player: Player;
    private _score: Score;

    constructor() {
        super({ key: 'TestScene' });
    }

    public preload(): void {
        this.load.spritesheet('player', 'assets/player.png', {
            frameWidth: 64,
            frameHeight: 64,
        });
    }

    public create(): void {
        this._player = new Player(this);
        this._score = new Score(this);
    }

    public update(): void {
        this._score.update();
        this._player.update();
    }
}
