import { Physics } from 'phaser';
import { Direction } from './Player';

export enum BallType {
    FIRE = 'fireball',
    EARTH = 'earthball',
    WATER = 'waterball',
}

export function getBallAnimation(ballType: BallType): string {
    return `shoot${ballType}`;
}

export abstract class Ball extends Physics.Arcade.Sprite {
    private _animationSpeed: number = 10;

    constructor(protected parentScene, protected ballType: BallType) {
        super(parentScene, 0, 0, ballType);

        parentScene.anims.create({
            key: getBallAnimation(ballType),
            frames: parentScene.anims.generateFrameNumbers(ballType, {
                start: 0,
                end: 59,
            }),
            frameRate: this._animationSpeed,
            repeat: -1,
        });
    }

    public shoot(player: Physics.Arcade.Sprite, direction: Direction) {
        switch (direction) {
            // sprite has left orientation by default
            case Direction.Up:
                this.setAngle(90);
                break;
            case Direction.Down:
                this.setAngle(270);
                break;
            case Direction.Right:
                this.setAngle(180);
                break;
        }
        this.setPosition(player.x, player.y);
        this.anims.play(getBallAnimation(this.ballType), true);
    }

    public update() {}
}
