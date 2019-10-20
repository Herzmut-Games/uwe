import { Scene } from 'phaser';
import { EnemyType } from './EnemyType';
import { Enemy } from './Enemy';
import { BallType } from '../Ball/BallType';

export class EarthSpirit extends Enemy {
    constructor(parentScene: Scene) {
        super(parentScene, EnemyType.EARTH);
    }

    protected _isWeakness(ballType: BallType): boolean {
        return ballType === BallType.FIRE;
    }

    protected _isSelf(ballType: BallType): boolean {
        return ballType === BallType.EARTH;
    }

    protected _setHitBox() {
        this.setSize(8, 18);
        this.setOffset(0, 7);
    }
}
