import { Scene } from 'phaser';
import { EnemyTypes } from './EnemyType';
import { Enemy } from './Enemy';
import { BallType, BallTypes } from '../Ball/BallType';

export class WaterSpirit extends Enemy {
    constructor(parentScene: Scene) {
        super(parentScene, EnemyTypes.WATER);
    }

    protected _isWeakness(ballType: BallType): boolean {
        return ballType === BallTypes.EARTH;
    }

    protected _isSelf(ballType: BallType): boolean {
        return ballType === BallTypes.WATER;
    }
    protected _setOffset() {
        this.setOffset(0, 7);
    }
}
