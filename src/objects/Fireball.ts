import { Scene } from 'phaser';
import { BallType, Ball } from './Ball';

export class Fireball extends Ball {
    constructor(protected parentScene: Scene) {
        super(parentScene, BallType.FIRE);
    }
}
