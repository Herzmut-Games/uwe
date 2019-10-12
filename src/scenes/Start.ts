import { Scene } from 'phaser';
import { screenWidth, screenHeight } from '../config';
import { Button } from '../objects/Button';
import { fonts } from '../objects/Fonts';

export class Start extends Scene {
    private _music: Phaser.Sound.BaseSound;
    constructor() {
        super({ key: 'Start' });
    }

    public preload() {
        this.load.audio('intro', 'assets/sounds/intro.mp3');
        this.load.audio(
            'menu-select',
            'assets/sounds/effects/sfx_menu_select1.wav'
        );
        this.load.spritesheet('player', 'assets/georg.png', {
            frameWidth: 48,
            frameHeight: 48,
        });
    }

    public destroy(): void {
        this._music.stop();
    }

    public create(): void {
        this._music = this.sound.add('intro', { volume: 0.5, loop: true });
        this._music.play();

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [0, 4, 8, 12],
            }),
            frameRate: 5.2,
            repeat: -1,
        });

        const menuPlayer = this.physics.add.sprite(200, 350, 'player');
        menuPlayer.setOrigin(0.5, 0.5);
        menuPlayer.setScale(7);
        menuPlayer.play('down');

        this.add
            .text(screenWidth / 2, 80, 'UWE', {
                fill: '#D50C2D',
                fontSize: 100,
                fontFamily: fonts.primary,
            })
            .setOrigin(0.5, 0.5);
        this.add
            .text(screenWidth / 2, 130, '(Das E steht für Elemente)', {
                fill: '#D50C2D',
                fontSize: 25,
                fontFamily: fonts.primary,
            })
            .setOrigin(0.5, 0.5);
        this.add
            .text(screenWidth / 1.5, 60, 'Bist du auch dabei?', {
                fill: '#FFFF00',
                fontSize: 20,
                fontFamily: fonts.primary,
            })
            .setOrigin(0.5, 0.5)
            .setAngle(30);
        Button.create(
            this,
            550,
            350,
            'Start',
            '#FFF',
            '#D50C2D',
            '58px',
            () => {
                this.scene.start('Room');
                this.sound.add('menu-select').play();
                this.destroy();
            }
        );

        Button.create(
            this,
            550,
            430,
            'About',
            '#D50C2D',
            '#FFF',
            '58px',
            () => {
                this.scene.start('Death', { score: 1337 });
                this.destroy();
            }
        );
    }
}
