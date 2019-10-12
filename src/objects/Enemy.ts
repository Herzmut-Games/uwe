import { Scene, GameObjects, Physics } from 'phaser';
import { screenHeight, screenWidth } from '../config';
import { Player } from './Player';
import { isUndefined } from 'util';

export class Enemy extends Physics.Arcade.Sprite {
    private _player: Player;
    private _speed: number = 50;

    constructor(parentScene: Scene, private _kind: string) {
        super(parentScene, 0, 0, _kind);

        parentScene.anims.create({
            key: `run_${_kind}`,
            frames: parentScene.anims.generateFrameNumbers(_kind, {
                start: 0,
                end: -1,
            }),
            repeat: -1,
        });
    }

    public update(): void {
        if (!isUndefined(this._player)) {
            if (this._player.x > this.x) {
                this.setVelocityX(this._speed);
            } else if (this._player.x < this.x) {
                this.setVelocityX(-1 * this._speed);
            } else {
                this.setVelocityX(0);
            }

            if (this._player.y > this.y) {
                this.setVelocityY(this._speed);
            } else if (this._player.y < this.y) {
                this.setVelocityY(-1 * this._speed);
            } else {
                this.setVelocityY(0);
            }
        }
    }

    public spawn(player: Player) {
        this._player = player;
        this.setRandomPosition(0, 108, 800, 452);
        this.anims.play(`run_${this._kind}`, true);
        this.setScale(2);
        this.setCircle(5);
    }
}

export class FireSpirit extends Enemy {
    constructor(parentScene: Scene) {
        super(parentScene, 'firespirit');
    }
}

export class EarthSpirit extends Enemy {
    constructor(parentScene: Scene) {
        super(parentScene, 'earthspirit');
    }
}

export class WaterSpirit extends Enemy {
    constructor(parentScene: Scene) {
        super(parentScene, 'waterspirit');
    }
}
