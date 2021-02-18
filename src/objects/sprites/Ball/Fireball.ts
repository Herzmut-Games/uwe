import { Scene } from 'phaser';
import { Ball } from './Ball';
import { BallTypes } from './BallType';
import { Direction } from '../Player/Direction';

export class Fireball extends Ball {
    constructor(protected parentScene: Scene) {
        super(parentScene, BallTypes.FIRE);
    }

    protected _setOffset(): void {
        switch (this._direction) {
            case Direction.Left:
                this.setOffset(1, 0);
                break;
            case Direction.Up:
                this.setOffset(30, -27);
                break;
            case Direction.Down:
                this.setOffset(30, 30);
                break;
            case Direction.Right:
                this.setOffset(59, 1);
                break;
        }
    }
}
