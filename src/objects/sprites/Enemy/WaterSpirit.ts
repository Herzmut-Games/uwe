import { Scene } from 'phaser';
import { EnemyType } from './EnemyType';
import { Enemy } from './Enemy';

export class WaterSpirit extends Enemy {
    constructor(parentScene: Scene) {
        super(parentScene, EnemyType.WATER);
    }

    protected _setHitBox() {
        this.setSize(8, 18);
        this.setOffset(0, 5);
    }
}
