import { Scene, Physics, Sound } from 'phaser';
import { Player } from './Player';
import { BallType } from './Ball';
import { GameAudio } from '../../configs/Resources';

export enum EnemyType {
    WATER = 'waterspirit',
    EARTH = 'earthspirit',
    FIRE = 'firespirit',
}

export class Enemy extends Physics.Arcade.Sprite {
    private _player: Player;
    private _health: number = 1;
    private readonly _speed: number = 100;
    private readonly _diagonalSpeed: number = this._speed / 1.5;
    private readonly _soundDeath: Sound.BaseSound;

    private get _bodyX(): number {
        return this.x + this.displayWidth / 2;
    }

    private get _bodyY(): number {
        return this.y + (this.displayHeight / 3) * 2;
    }
    constructor(
        private readonly _parentScene: Scene,
        private readonly _kind: EnemyType
    ) {
        super(_parentScene, 0, 0, _kind);

        this._soundDeath = this._parentScene.sound.add(GameAudio.ENEMY_DEATH);

        _parentScene.anims.create({
            key: `run_${_kind}`,
            frames: _parentScene.anims.generateFrameNumbers(_kind, {
                start: 0,
                end: -1,
            }),
            repeat: -1,
        });
    }

    public update(): void {
        let currentSpeed: number;
        if (
            this._player.bodyX === this._bodyX ||
            this._player.bodyY === this._bodyY
        ) {
            currentSpeed = this._speed;
        } else {
            currentSpeed = this._diagonalSpeed;
        }

        if (this._player.bodyX > this._bodyX) {
            this.setVelocityX(currentSpeed);
        } else if (this._player.bodyX < this._bodyX) {
            this.setVelocityX(-1 * currentSpeed);
        } else {
            this.setVelocityX(0);
        }

        if (this._player.bodyY > this._bodyY) {
            this.setVelocityY(currentSpeed);
        } else if (this._player.bodyY < this._bodyY) {
            this.setVelocityY(-1 * currentSpeed);
        } else {
            this.setVelocityY(0);
        }
    }

    public spawn(player: Player, health: number) {
        this._player = player;
        this.setCollideWorldBounds(true);
        while (!this._hasSufficientDistanceToPlayer) {}
        this.anims.play(`run_${this._kind}`, true);
        this.setSize(10, 20);
        this.setOffset(-1, 5);
        this.setDataEnabled();
        this.setData('type', this._kind);

        this._health = health;
        this._setScale();
    }

    public hit(ballType: BallType): boolean {
        if (
            (this._kind === EnemyType.FIRE && ballType === BallType.WATER) ||
            (this._kind === EnemyType.EARTH && ballType === BallType.FIRE) ||
            (this._kind === EnemyType.WATER && ballType === BallType.EARTH)
        ) {
            if (this._health <= 1) {
                this._soundDeath.play();
                this.kill();
                return true;
            } else {
                this._health -= 1;
                this._setScale();
                return false;
            }
        } else if (
            (this._kind === EnemyType.FIRE && ballType === BallType.FIRE) ||
            (this._kind === EnemyType.EARTH && ballType === BallType.EARTH) ||
            (this._kind === EnemyType.WATER && ballType === BallType.WATER)
        ) {
            if (this._health < 3) {
                this._health += 1;
                this._setScale();
            }

            return false;
        }

        return false;
    }

    public kill() {
        this.setActive(false);
        this.setVisible(false);
        this.disableBody();
    }

    private _setScale() {
        this.setScale(2 + this._health * 1.25);
    }

    private get _hasSufficientDistanceToPlayer(): boolean {
        const minDistance: number = 128;
        this.setRandomPosition(0, 108, 800, 452);
        return (
            Math.abs(this._player.bodyX - this._bodyX) >= minDistance &&
            Math.abs(this._player.bodyY - this._bodyY) >= minDistance
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
