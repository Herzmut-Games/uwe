import { Scene, Time, Physics } from 'phaser';
import { Player } from './Player';

export class EnemyController {
    private _timer: Time.TimerEvent;
    private _round: number = 1;

    constructor(
        parentScene: Scene,
        private _player: Player,
        private _spiritGroups: Physics.Arcade.Group[]
    ) {
        this._timer = parentScene.time.addEvent({
            loop: true,
            startAt: 0,
            delay: 5000,
            callback: this._spawnSpirits,
            callbackScope: this,
        });
    }

    private _spawnSpirits(): void {
        console.log('testi');

        for (let i = 0, l = this._round; i < l; i++) {
            console.log('testi' + i);
            this._spiritGroups[Phaser.Math.Between(0, 2)]
                .get()
                .setActive(true)
                .setVisible(true)
                .spawn(this._player);
        }

        if (this._round < 10) {
            this._round += 1;
        }
    }
}
