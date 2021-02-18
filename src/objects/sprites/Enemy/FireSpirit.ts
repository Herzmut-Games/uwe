import { Scene } from 'phaser';
import { EnemyTypes } from './EnemyType';
import { Enemy } from './Enemy';
import { BallType, BallTypes } from '../Ball/BallType';

export class FireSpirit extends Enemy {
    constructor(parentScene: Scene) {
        super(parentScene, EnemyTypes.FIRE);
    }

    protected _isWeakness(ballType: BallType): boolean {
        return ballType === BallTypes.WATER;
    }

    protected _isSelf(ballType: BallType): boolean {
        return ballType === BallTypes.FIRE;
    }

    protected _setOffset() {
        this.setOffset(1, 9);
    }
}
