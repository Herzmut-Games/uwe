import { Scene, Time, Physics, Types } from 'phaser';
import { Player } from './Player';

export class EnemyController {
    private _timer: Time.TimerEvent;
    private _round: number = 1;
    private readonly _timerConfig: Types.Time.TimerEventConfig = {
        loop: true,
        startAt: 0,
        delay: 5000,
        callback: this._spawnSpirits,
        callbackScope: this,
    };

    private get enemyCount(): number {
        return (
            this._spiritGroups[0].countActive() +
            this._spiritGroups[1].countActive() +
            this._spiritGroups[2].countActive()
        );
    }

    constructor(
        private _parentScene: Scene,
        private _player: Player,
        private _spiritGroups: Physics.Arcade.Group[]
    ) {
        this._timer = _parentScene.time.addEvent(this._timerConfig);
    }

    public update(): void {
        if (this.enemyCount === 0 && this._round > 1) {
            this._timer.destroy();
            this._timer = this._parentScene.time.addEvent(this._timerConfig);
            this._spawnSpirits();
        }
    }

    private _spawnSpirits(): void {
        if (this.enemyCount < 10) {
            for (let i = 0, l = this._round; i < l; i++) {
                this._spiritGroups[Phaser.Math.Between(0, 2)]
                    .get()
                    .setActive(true)
                    .setVisible(true)
                    .enableBody()
                    .spawn(this._player, Phaser.Math.Between(1, 2));
            }
        }

        if (this._round < 4) {
            this._round += 1;
        }
    }
}
