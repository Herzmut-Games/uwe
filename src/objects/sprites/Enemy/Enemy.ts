import { Scene, Physics, Sound } from 'phaser';
import { Player } from '../Player/Player';
import { BallType } from '../Ball/BallType';
import { GameAudio } from '../../../configs/Resources';
import { EnemyType } from './EnemyType';
import { Ball } from '../Ball/Ball';

export abstract class Enemy extends Physics.Arcade.Sprite {
    // Player is set on spawn
    private _player!: Player;

    private _health: number = 1;
    private readonly _defaultSpeed: number = 100;

    private get _speed(): number {
        return this._defaultSpeed * (this._health * 0.75);
    }

    private get _diagonalSpeed(): number {
        return this._speed / 1.5;
    }

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
        this.setSize(8, 16);
        this._setOffset();
        this.setBounce(0.5);

        this._health = health;
        this._setScale();
    }

    /**
     * Method called on collision with a ball
     *
     * Returns wheter the player should be awarded with points or not
     * @param ballType Ball that hit this enemy
     */
    public onHit(ball: Ball): boolean {
        if (this._isWeakness(ball.ballType)) {
            if (this._health <= 1) {
                this._parentScene.sound.play(GameAudio.ENEMY_DEATH);
                this.kill();
                return true;
            } else {
                this._health -= 1;
                this._setScale();
            }
        } else if (this._isSelf(ball.ballType)) {
            if (this._health < 3) {
                this._health += 1;
                this._setScale();
            }
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
    protected abstract _setOffset(): void;

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
