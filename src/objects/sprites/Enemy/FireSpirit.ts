import { Scene } from 'phaser';
import { EnemyType } from './EnemyType';
import { Enemy } from './Enemy';
import { BallType } from '../Ball/BallType';

export class FireSpirit extends Enemy {
    constructor(parentScene: Scene) {
        super(parentScene, EnemyType.FIRE);
    }

    protected _isWeakness(ballType: BallType): boolean {
        return ballType === BallType.WATER;
    }

    protected _isSelf(ballType: BallType): boolean {
        return ballType === BallType.FIRE;
    }

    protected _setOffset() {
        this.setOffset(1, 9);
    }
}
