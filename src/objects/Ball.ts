import { Physics, Scene } from 'phaser';
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
    private _shootSpeed: number = 9;
    private _direction: Direction;

    constructor(protected parentScene: Scene, protected ballType: BallType) {
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
        this.setCollideWorldBounds(true);
        this._direction = direction;

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
        this.setDataEnabled();
        this.data.set('type', this.ballType);
        this.setPosition(player.x, player.y);
        this.anims.play(getBallAnimation(this.ballType), true);
    }

    public update() {
        switch (this._direction) {
            case Direction.Left:
                this.x -= this._shootSpeed;
                break;
            case Direction.Up:
                this.y -= this._shootSpeed;
                break;
            case Direction.Down:
                this.y += this._shootSpeed;
                break;
            case Direction.Right:
                this.x += this._shootSpeed;
                break;
        }
    }
}
