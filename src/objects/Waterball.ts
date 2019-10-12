import { Scene } from 'phaser';
import { BallType, Ball } from './Ball';

export class Waterball extends Ball {
    constructor(protected parentScene: Scene) {
        super(parentScene, BallType.WATER);
    }
}
