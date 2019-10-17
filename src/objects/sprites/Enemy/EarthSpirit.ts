import { Scene } from 'phaser';
import { EnemyType } from './EnemyType';
import { Enemy } from './Enemy';
export class EarthSpirit extends Enemy {
    constructor(parentScene: Scene) {
        super(parentScene, EnemyType.EARTH);
    }
}
