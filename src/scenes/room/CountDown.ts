import { Scene, GameObjects, Time } from 'phaser';
import { colors } from '../../configs/Colors';
import { fonts } from '../../configs/Fonts';
import { CountDownEvent } from './CountDown.event';
import { Scenes } from '../../configs/Scenes';

export class CountDown extends Scene {
    private _timer!: Time.TimerEvent;
    private _countdownText!: GameObjects.Text;
    private _currentCountdown!: number;
    private readonly _countdownTexts: string[] = [
        'und ab',
        'eins',
        'zwei',
        'drei',
        'vier',
    ];

    constructor() {
        super({ key: Scenes.CountDown });
    }

    public create(): void {
        this._currentCountdown = 4;
        this._timer = this.time.addEvent({
            repeat: this._currentCountdown,
            delay: 1000,
            callback: this._countDown,
            callbackScope: this,
        });

        this.scene.moveAbove(Scenes.Room);

        this._countdownText = this.add
            .text(400, 300, this._countdownTexts[this._currentCountdown], {
                color: colors.white,
                fontSize: '68px',
                fontFamily: fonts.primary,
            })
            .setOrigin(0.5, 0.5);
    }

    private _countDown(): void {
        this._currentCountdown -= 1;

        if (this._currentCountdown >= 0) {
            this._countdownText.setText(
                this._countdownTexts[this._currentCountdown]
            );
        } else {
            this.events.emit(CountDownEvent.Done);
            this.scene.stop();
            this._timer.destroy();
        }
    }
}
