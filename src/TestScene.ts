import { Scene } from 'phaser';
import { Score } from './Score';

export class TestScene extends Scene {
    private _score: Score;

    constructor() {
        super({ key: 'TestScene' });
    }

    public preload(): void {}

    public create(): void {
        console.log('Create TestScene');
        this._score = new Score(this);
    }

    public update(): void {
        this._score.update();
    }
}
