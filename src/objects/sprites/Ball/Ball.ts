import { Physics, Scene } from 'phaser';
import { Direction } from '../Player/Direction';
import { BallType } from './BallType';

function getBallAnimation(ballType: BallType): string {
    return `shoot${ballType}`;
}

export abstract class Ball extends Physics.Arcade.Sprite {
    protected _direction: Direction;
    private readonly _animationSpeed: number = 10;
    private readonly _shootSpeed: number = 7;
    private readonly _size: number = 1.5;
    private _fadingOut: boolean = false;
    private _collidedWithWorldBounds: boolean = false;

    constructor(protected parentScene: Scene, public ballType: BallType) {
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
        if (!this.body.onWorldBounds) {
            (this.body as any).onWorldBounds = true;
            this.body.world.on(
                'worldbounds',
                body => {
                    if (body.gameObject === this) {
                        this._collidedWithWorldBounds = true;
                        this.fadeOut(false);
                    }
                },
                this
            );
        }
        this.setCollideWorldBounds(true);
        this.setImmovable(true);
        this._fadingOut = false;
        this._collidedWithWorldBounds = false;
        this.scale = 0.1;
        this._direction = direction;

        this.setCircle(4);
        this._setOffset();
        this._setDirection();

        this.setPosition(player.x, player.y);
        this.anims.play(getBallAnimation(this.ballType), true);
    }

    public update() {
        let currentSpeed: number = this._shootSpeed;
        if (this._collidedWithWorldBounds) {
            currentSpeed *= 2;
        } else if (this._fadingOut) {
            currentSpeed /= 2;
        }

        if (this._fadingOut) {
            this.scale -= 0.25;
            if (this.scale <= 0) {
                this.setActive(false);
                this.setVisible(false);
                this.disableBody();
            }
        } else if (this.scale < this._size) {
            this.scale += 0.1;
        } else {
            // just in case...
            this.scale = this._size;
        }

        switch (this._direction) {
            case Direction.Left:
                this.x -= currentSpeed;
                break;
            case Direction.Up:
                this.y -= currentSpeed;
                break;
            case Direction.Down:
                this.y += currentSpeed;
                break;
            case Direction.Right:
                this.x += currentSpeed;
                break;
        }
    }

    public fadeOut(disableBody: boolean = true) {
        this._fadingOut = true;
        if (disableBody) {
            this.disableBody();
        }
    }

    protected abstract _setOffset(): void;

    private _setDirection(): void {
        switch (this._direction) {
            case Direction.Left:
                this.setAngle(0);
                break;
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
    }
}
