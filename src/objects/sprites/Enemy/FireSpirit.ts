import { Scene } from 'phaser';
import { EnemyType } from './EnemyType';
import { Enemy } from './Enemy';

export class FireSpirit extends Enemy {
    constructor(parentScene: Scene) {
        super(parentScene, EnemyType.FIRE);
    }

    protected _setHitBox() {
        this.setSize(8, 18);
        this.setOffset(1, 7);
    }
}
