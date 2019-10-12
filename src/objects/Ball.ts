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
    private _shootSpeed: number = 7;
    private _direction: Direction;
    private _fadingOut: boolean = false;

    constructor(protected parentScene: Scene, protected ballType: BallType) {
        super(parentScene, 0, 0, ballType);

        parentScene.anims.create({
            key: getBallAnimation(ballType),
            frames: parentScene.anims.generateFrameNumbers(ballType, {
                start: 0,
                end: -1,
            }),
            frameRate: this._animationSpeed,
            repeat: -1,
        });
    }

    public shoot(player: Physics.Arcade.Sprite, direction: Direction) {
        if (!this.body.onWorldBounds) {
            (this.body as any).onWorldBounds = true;
            this.body.world.on(
                'worldbounds',
                body => {
                    if (body.gameObject === this) {
                        this.fadeOut();
                    }
                },
                this
            );
        }
        this.setCollideWorldBounds(true);
        this.setDataEnabled();
        this.data.set('type', this.ballType);
        this._fadingOut = false;
        this.scale = 0.1;
        this._direction = direction;
        this.setSize(20, 20);

        switch (direction) {
            case Direction.Left:
                this.setAngle(0);
                this.setOffset(0, -5);
                break;
            case Direction.Up:
                this.setAngle(90);
                this.setOffset(25, -30);
                break;
            case Direction.Down:
                this.setAngle(270);
                this.setOffset(25, 20);
                break;
            case Direction.Right:
                this.setAngle(180);
                this.setOffset(48, -5);
                break;
        }
        this.setPosition(player.x, player.y);
        this.anims.play(getBallAnimation(this.ballType), true);
    }

    public update() {
        if (this._fadingOut) {
            this.scale -= 0.25;
            if (this.scale <= 0) {
                this.setActive(false);
                this.setVisible(false);
                this.disableBody();
            }
            return;
        } else if (this.scale < 1) {
            this.scale += 0.1;
        } else {
            // just in case...
            this.scale = 1;
        }

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

    public fadeOut() {
        this._fadingOut = true;
    }
}
