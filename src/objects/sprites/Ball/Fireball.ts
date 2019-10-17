import { Scene } from 'phaser';
import { Ball } from './Ball';
import { BallType } from './BallType';

export class Fireball extends Ball {
    constructor(protected parentScene: Scene) {
        super(parentScene, BallType.FIRE);
    }
}
