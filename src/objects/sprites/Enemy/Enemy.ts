import { Scene, Physics, Sound } from 'phaser';
import { Player } from '../Player/Player';
import { BallType } from '../Ball/BallType';
import { GameAudio } from '../../../configs/Resources';
import { EnemyType } from './EnemyType';

export abstract class Enemy extends Physics.Arcade.Sprite {
    private _player: Player;
    private _health: number = 1;
    private readonly _speed: number = 100;
    private readonly _diagonalSpeed: number = this._speed / 1.5;

    private get _bodyX(): number {
        return this.x + this.displayWidth / 2;
    }

    private get _bodyY(): number {
        return this.y + (this.displayHeight / 3) * 2;
    }
    constructor(
        private readonly _parentScene: Scene,
        private readonly _type: EnemyType
    ) {
        super(_parentScene, 0, 0, _type);
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
        this.anims.play(`run_${this._type}`, true);
        this._setHitBox();
        this.setDataEnabled();
        this.setData('type', this._type);

        this._health = health;
        this._setScale();
    }

    public hit(ballType: BallType): boolean {
        if (this._isWeakness(ballType)) {
            if (this._health <= 1) {
                this._parentScene.sound.play(GameAudio.ENEMY_DEATH);
                this.kill();
                return true;
            } else {
                this._health -= 1;
                this._setScale();
                return false;
            }
        } else if (this._isSelf(ballType)) {
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

    protected abstract _isWeakness(ballType: BallType): boolean;
    protected abstract _isSelf(ballType: BallType): boolean;
    protected abstract _setHitBox(): void;

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
