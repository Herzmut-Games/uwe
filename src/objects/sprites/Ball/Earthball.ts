import { Scene } from 'phaser';
import { Ball } from './Ball';
import { BallTypes } from './BallType';
import { Direction } from '../Player/Direction';

export class Earthball extends Ball {
    constructor(protected parentScene: Scene) {
        super(parentScene, BallTypes.EARTH);
    }

    protected _setOffset(): void {
        switch (this._direction) {
            case Direction.Left:
                this.setOffset(1, 0);
                break;
            case Direction.Up:
                this.setOffset(29, -26);
                break;
            case Direction.Down:
                this.setOffset(28, 28);
                break;
            case Direction.Right:
                this.setOffset(56, 1);
                break;
        }
    }
}
