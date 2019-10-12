import { Scene, Physics } from 'phaser';
import { Player } from './Player';

export enum EnemyType {
    WATER = 'waterspirit',
    EARTH = 'earthspirit',
    FIRE = 'firespirit',
}

export class Enemy extends Physics.Arcade.Sprite {
    private _player: Player;
    private _speed: number = 50;
    private _diagonalSpeed: number = this._speed / 1.5;

    constructor(parentScene: Scene, private _kind: EnemyType) {
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
        let currentSpeed: number;
        if (this._player.x === this.x || this._player.y === this.y) {
            currentSpeed = this._speed;
        } else {
            currentSpeed = this._diagonalSpeed;
        }

        if (this._player.x > this.x) {
            this.setVelocityX(currentSpeed);
        } else if (this._player.x < this.x) {
            this.setVelocityX(-1 * currentSpeed);
        } else {
            this.setVelocityX(0);
        }

        if (this._player.y > this.y) {
            this.setVelocityY(currentSpeed);
        } else if (this._player.y < this.y) {
            this.setVelocityY(-1 * currentSpeed);
        } else {
            this.setVelocityY(0);
        }
    }

    public spawn(player: Player) {
        this._player = player;
        this.setCollideWorldBounds(true);
        while (!this._hasSufficientDistanceToPlayer) {}
        this.anims.play(`run_${this._kind}`, true);
        this.setScale(2);
        this.setSize(10, 20);
        this.setDataEnabled();
        this.setData('type', this._kind);
    }

    public kill() {
        this.setActive(false);
        this.setVisible(false);
        this.disableBody();
    }

    private get _hasSufficientDistanceToPlayer(): boolean {
        const minDistance: number = 128;
        this.setRandomPosition(0, 108, 800, 452);
        return (
            Math.abs(this._player.x - this.x) >= minDistance &&
            Math.abs(this._player.y - this.y) >= minDistance
        );
    }
}

export class FireSpirit extends Enemy {
    constructor(parentScene: Scene) {
        super(parentScene, EnemyType.FIRE);
    }
}

export class EarthSpirit extends Enemy {
    constructor(parentScene: Scene) {
        super(parentScene, EnemyType.EARTH);
    }
}

export class WaterSpirit extends Enemy {
    constructor(parentScene: Scene) {
        super(parentScene, EnemyType.WATER);
    }
}
