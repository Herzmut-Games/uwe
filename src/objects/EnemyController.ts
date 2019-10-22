import { Scene, Time, Physics, Types, Math } from 'phaser';
import { Player } from './sprites/Player/Player';
import { RoomEvent } from '../scenes/room/Room.event';
import { GameAudio } from '../configs/Resources';
import { EnemyType } from './sprites/Enemy/EnemyType';

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
        private readonly _parentScene: Scene,
        private readonly _player: Player,
        private readonly _spiritGroups: Physics.Arcade.Group[]
    ) {
        // Setup assets
        this._parentScene.sound.add(GameAudio.ENEMY_DEATH);
        this._setupSpiritAnimations();

        this._timer = _parentScene.time.addEvent(this._timerConfig);
        this._spawnSpirits();

        // Respawn enemies early if last one was removed from room
        // this can either happen on a kill or when taking damage
        this._parentScene.events.on(RoomEvent.Damage, this._earlyRespawn, this);
        this._parentScene.events.on(RoomEvent.Kill, this._earlyRespawn, this);
    }

    private _earlyRespawn(): void {
        if (this.enemyCount === 0 && this._round > 1) {
            this._timer.destroy();
            this._timer = this._parentScene.time.addEvent(this._timerConfig);
            this._spawnSpirits();
        }
    }

    private _spawnSpirits(): void {
        if (this.enemyCount < 10) {
            for (let i = 0, l = this._round; i < l; i++) {
                this._spiritGroups[Math.Between(0, 2)]
                    .get()
                    .setActive(true)
                    .setVisible(true)
                    .enableBody()
                    .spawn(this._player, Math.Between(1, 2));
            }
        }

        if (this._round < 4) {
            this._round += 1;
        }
    }

    private _setupSpiritAnimations(): void {
        [EnemyType.EARTH, EnemyType.FIRE, EnemyType.WATER].forEach(type => {
            this._parentScene.anims.create({
                key: `run_${type}`,
                frames: this._parentScene.anims.generateFrameNumbers(type, {
                    start: 0,
                    end: -1,
                }),
                repeat: -1,
            });
        });
    }
}
