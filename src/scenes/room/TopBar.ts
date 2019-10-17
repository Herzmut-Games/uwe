import { Scene } from 'phaser';
import { hexColors } from '../../configs/Colors';
import { Score } from '../../objects/Score';
import { Healthbar } from '../../objects/Healthbar';
import { WeaponStatus } from '../../objects/WeaponStatus';
import { Room, RoomEvent } from './Room';
import { Element } from '../../objects/sprites/Player';

export enum TopBarEvent {
    NoHealth = 'topbar_nohealth',
}

export class TopBar extends Scene {
    private _score: Score;
    private _healthbar: Healthbar;
    private _weaponStatus: WeaponStatus;
    private _roomScene: Room;

    constructor() {
        super({ key: TopBar.name });
    }

    public create() {
        this._roomScene = this.scene.get(Room.name) as Room;

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
            (element: Element) => {
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
