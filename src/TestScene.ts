import { Scene } from 'phaser';
import { Score } from './Score';

export class TestScene extends Scene {
    private _score: Score;

    constructor() {
        super({ key: 'TestScene' });
    }

    public preload(): void {}

    public create(): void {
        this._score = new Score(this);
    }

    public update(): void {
        this._score.update();
    }
}
