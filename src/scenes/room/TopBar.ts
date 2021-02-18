import { Scene } from 'phaser';
import { hexColors } from '../../configs/Colors';
import { Score } from '../../objects/Score';
import { Healthbar } from '../../objects/Healthbar';
import { WeaponStatus } from '../../objects/WeaponStatus';
import { Room } from './Room';
import { RoomEvent } from './Room.event';
import { PlayerElement } from '../../objects/sprites/Player/PlayerElement';
import { TopBarEvent } from './TopBar.event';
import { Scenes } from '../../configs/Scenes';

export class TopBar extends Scene {
    private _score!: Score;
    private _healthbar!: Healthbar;
    private _weaponStatus!: WeaponStatus;
    private _roomScene!: Room;

    constructor() {
        super({ key: Scenes.TopBar });
    }

    public create() {
        this._roomScene = this.scene.get(Scenes.Room) as Room;

        this.add
            .graphics()
            .fillStyle(hexColors.primary.dark, 1)
            .fillRect(0, 0, 800, 112);

        this._healthbar = new Healthbar(this);
        this._weaponStatus = new WeaponStatus(this);
        this._score = new Score(this);

        this._roomScene.events.on(RoomEvent.Kill, () => {
            this._score.add(100);
        });

        this._roomScene.events.on(
            RoomEvent.WeaponSwitch,
            (element: PlayerElement) => {
                this._weaponStatus.update(element);
            }
        );

        this._roomScene.events.on(RoomEvent.Damage, () => this._applyDamage());
    }

    public cleanup(): void {
        this.events.removeListener(TopBarEvent.NoHealth);
    }

    private _applyDamage(): void {
        this._healthbar.ouch();

        if (this._healthbar.health <= 0) {
            this.events.emit(TopBarEvent.NoHealth, this._score.score);
        }
    }
}
