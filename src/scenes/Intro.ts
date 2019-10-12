import { Scene } from 'phaser';
import { screenWidth, screenHeight } from '../config';

export class Intro extends Scene {
    _logo: Phaser.GameObjects.Image;
    constructor() {
        super({ key: 'Intro' });
    }

    public preload(): void {
        this.load.image('logo', 'assets/uwe_logo.png');
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
        this.time.delayedCall(4000, this._startMenu, [], this);
        this.sound.add('bling').play();
    }

    private _displayLogo(): void {
        this._logo = this.add.image(screenWidth / 2, screenHeight / 2, 'logo');
        this._logo.setOrigin(0.5, 0.5);
    }

    private _startMenu(): void {
        this.scene.start('Start');
    }
}
