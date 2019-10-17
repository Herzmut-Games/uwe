import { Scene } from 'phaser';
import { Ball } from './Ball';
import { BallType } from './BallType';

export class Earthball extends Ball {
    constructor(protected parentScene: Scene) {
        super(parentScene, BallType.EARTH);
    }
}
