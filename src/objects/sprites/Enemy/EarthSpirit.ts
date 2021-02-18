import { Scene } from 'phaser';
import { EnemyTypes } from './EnemyType';
import { Enemy } from './Enemy';
import { BallType, BallTypes } from '../Ball/BallType';

export class EarthSpirit extends Enemy {
    constructor(parentScene: Scene) {
        super(parentScene, EnemyTypes.EARTH);
    }

    protected _isWeakness(ballType: BallType): boolean {
        return ballType === BallTypes.FIRE;
    }

    protected _isSelf(ballType: BallType): boolean {
        return ballType === BallTypes.EARTH;
    }

    protected _setOffset() {
        this.setOffset(0, 9);
    }
}
