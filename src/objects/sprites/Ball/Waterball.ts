import { Scene } from 'phaser';
import { Ball } from './Ball';
import { BallTypes } from './BallType';
import { Direction } from '../Player/Direction';

export class Waterball extends Ball {
    constructor(protected parentScene: Scene) {
        super(parentScene, BallTypes.WATER);
    }

    protected _setOffset(): void {
        switch (this._direction) {
            case Direction.Left:
                this.setOffset(1, 0);
                break;
            case Direction.Up:
                this.setOffset(38, -36);
                break;
            case Direction.Down:
                this.setOffset(38, 38);
                break;
            case Direction.Right:
                this.setOffset(75, 1);
                break;
        }
    }
}
