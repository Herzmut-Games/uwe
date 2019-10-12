import { Scene } from 'phaser';
import { screenWidth, screenHeight } from '../config';
import { fonts } from '../objects/Fonts';

export class Intro extends Scene {
    _logo: Phaser.GameObjects.Image;
    constructor() {
        super({ key: 'Intro' });
    }

    public preload(): void {
        this.load.image('logo', 'assets/herzmut_logo.png');
        this.load.audio('bling', 'assets/sounds/bling.mp3');
    }
    public create(): void {
        this.cameras.main.setBackgroundColor('#FFF');
        this.add
            .text(screenWidth / 2, screenHeight / 1.5, 'Hetzner GameJam 2019', {
                fill: '#000',
            })
            .setOrigin(0.5, 0.5);
        this.time.delayedCall(847, this._displayLogo, [], this);
        this.time.delayedCall(2000, this._startMenu, [], this);
        this.sound.add('bling').play();
    }

    private _displayLogo(): void {
        this._logo = this.add.image(screenWidth / 2, 200, 'logo');
        this._logo.setOrigin(0.5, 0.5);
        this.add
            .text(400, 225, 'Games', {
                fill: '#D50C2D',
                fontFamily: fonts.primary,
                fontSize: '30px',
            })
            .setOrigin(0.5, 0.5);
    }

    private _startMenu(): void {
        this.scene.start('Start');
    }
}
