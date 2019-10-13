import { Scene, GameObjects } from 'phaser';
import { screenWidth, screenHeight } from '../config';
import { fonts } from '../objects/Fonts';

export class Intro extends Scene {
    private _logo: Phaser.GameObjects.Image;
    private _progressBar: GameObjects.Graphics;

    constructor() {
        super({ key: 'Intro' });
    }

    public preload(): void {
        this._progressBar = this.add.graphics();

        this.load.on('progress', value => {
            this._progressBar.clear();
            this._progressBar.fillStyle(0xd50c2d, 1);
            this._progressBar.fillRect(250, 280, 300 * value, 10);
        });

        this.load.on('complete', () => {
            this._progressBar.destroy();
        });

        this.cameras.main.setBackgroundColor('#FFF');
        this.load.image('logo', 'assets/herzmut_logo.png');
        this.load.audio('bling', 'assets/sounds/bling.mp3');
        this.load.image('menu-background', 'assets/backgrounds/menu.png');
        this.load.image(
            'menu-background-dark',
            'assets/backgrounds/menu_dark.png'
        );
        this.load.audio('intro', 'assets/sounds/intro.mp3');
        this.load.audio('thriller', 'assets/sounds/thriller.mp3');
        this.load.audio(
            'menu-select',
            'assets/sounds/effects/sfx_menu_select1.wav'
        );
        this.load.image('background', 'assets/backgrounds/map.png');
        this.load.image('topbar', 'assets/backgrounds/topbar.png');
        this.load.image('fullHeart', 'assets/heart.png');
        this.load.image('halfHeart', 'assets/heart_half.png');
        this.load.spritesheet('player', 'assets/uwe.png', {
            frameWidth: 48,
            frameHeight: 48,
        });
        this.load.audio('battle-intro', 'assets/sounds/battle_intro.mp3');
        this.load.audio('battle-main', 'assets/sounds/battle_main.mp3');
        this.load.audio(
            'enemy-death',
            'assets/sounds/effects/sfx_deathscream_alien4.wav'
        );
        this.load.audio(
            'player-impact',
            'assets/sounds/effects/sfx_deathscream_human12.wav'
        );
        this.load.audio(
            'element-switch',
            'assets/sounds/effects/sfx_wpn_dagger.wav'
        );
        this.load.audio(
            'footsteps',
            'assets/sounds/effects/sfx_movement_footstepsloop4_fast.wav'
        );
        this.load.spritesheet('firespirit', 'assets/objects/firespirit.png', {
            frameWidth: 10,
            frameHeight: 26,
        });
        this.load.spritesheet('waterspirit', 'assets/objects/waterspirit.png', {
            frameWidth: 9,
            frameHeight: 24,
        });
        this.load.spritesheet('earthspirit', 'assets/objects/earthspirit.png', {
            frameWidth: 9,
            frameHeight: 25,
        });
        this.load.spritesheet('earthball', 'assets/objects/earthball.png', {
            frameWidth: 65,
            frameHeight: 9,
        });
        this.load.spritesheet('fireball', 'assets/objects/fireball.png', {
            frameWidth: 68,
            frameHeight: 9,
        });
        this.load.spritesheet('waterball', 'assets/objects/waterball.png', {
            frameWidth: 84,
            frameHeight: 9,
        });
        this.load.spritesheet('earthstatus', 'assets/objects/earthstatus.png', {
            frameWidth: 13,
            frameHeight: 40,
        });
        this.load.spritesheet('firestatus', 'assets/objects/firestatus.png', {
            frameWidth: 14,
            frameHeight: 45,
        });
        this.load.spritesheet('waterstatus', 'assets/objects/waterstatus.png', {
            frameWidth: 14,
            frameHeight: 41,
        });
    }

    public create(): void {
        this.time.delayedCall(847, this._displayLogo, [], this);
        this.time.delayedCall(2000, this._startMenu, [], this);
        this.sound.add('bling').play();
    }

    private _displayLogo(): void {
        this._logo = this.add.image(screenWidth / 2, 200, 'logo');
        this._logo.setOrigin(0.5, 0.5);
        this.add
            .text(screenWidth / 2, screenHeight / 1.5, 'Hetzner GameJam 2019', {
                fill: '#000',
            })
            .setOrigin(0.5, 0.5);

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
