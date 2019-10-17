import { Scene } from 'phaser';
import { EnemyType } from './EnemyType';
import { Enemy } from './Enemy';
export class FireSpirit extends Enemy {
    constructor(parentScene: Scene) {
        super(parentScene, EnemyType.FIRE);
    }
}
