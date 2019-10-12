import { Scene } from 'phaser';
import { screenWidth, screenHeight } from '../config';
import { Button } from '../objects/Button';

export class Start extends Scene {
    private _music: Phaser.Sound.BaseSound;
    constructor() {
        super({ key: 'Start' });
    }

    public preload() {
        this.load.audio('intro', 'assets/sounds/intro.mp3');
    }

    public destroy(): void {
        console.log('destroy');
        this._music.stop();
    }

    public create(): void {
        this._music = this.sound.add('intro', { loop: true });
        this._music.play();

        this.add
            .text(screenWidth / 2, screenHeight / 4, 'UWE', {
                fill: '#D50C2D',
                fontSize: 100,
            })
            .setOrigin(0.5, 0.5);
        this.add
            .text(
                screenWidth / 2,
                screenHeight / 3,
                '(Das E steht für Elemente)',
                {
                    fill: '#D50C2D',
                    fontSize: 25,
                }
            )
            .setOrigin(0.5, 0.5);
        this.add
            .text(screenWidth / 1.5, screenHeight / 5, 'Bist du auch dabei?', {
                fill: '#FFFF00',
                fontSize: 20,
            })
            .setOrigin(0.5, 0.5)
            .setAngle(30);
        Button.create(
            this,
            screenWidth / 2,
            screenHeight / 2,
            'Start',
            '#FFF',
            '#D50C2D',
            () => {
                this.scene.start('Room');
                this.destroy();
            }
        );

        Button.create(
            this,
            screenWidth / 2,
            screenHeight / 2 + 50,
            'DIE',
            '#D50C2D',
            '#FFF',
            () => {
                this.scene.start('Death', { score: 1337 });
                this.destroy();
            }
        );
    }
}
