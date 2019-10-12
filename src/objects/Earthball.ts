import { Scene } from 'phaser';
import { BallType, Ball } from './Ball';

export class Earthball extends Ball {
    constructor(protected parentScene: Scene) {
        super(parentScene, BallType.EARTH);
    }
}
