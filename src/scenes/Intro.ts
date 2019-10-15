import { Scene, GameObjects, Sound } from 'phaser';
import { screenWidth, screenHeight } from '../config';
import { fonts } from '../objects/Fonts';
import { colors } from '../objects/Colors';
import { GameAudio, GameImage, GameSpritesheet } from '../configs/Resources';

export class Intro extends Scene {
    private _logo: GameObjects.Image;
    private _progressBar: GameObjects.Graphics;
    private _soundBling: Sound.BaseSound;

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

        this._loadImages();
        this._loadSpritesheets();
        this._loadAudio();
    }

    public create(): void {
        this.time.delayedCall(847, this._displayLogo, [], this);
        this.time.delayedCall(2000, this._startMenu, [], this);
        this._soundBling = this.sound.add(GameAudio.BLING);
        this._soundBling.play();
    }

    private _displayLogo(): void {
        this._logo = this.add.image(screenWidth / 2, 200, GameImage.LOGO);
        this._logo.setOrigin(0.5, 0.5);
        this.add
            .text(screenWidth / 2, screenHeight / 1.5, 'Hetzner GameJam 2019', {
                fill: '#000',
                fontFamily: fonts.primary,
                fontSize: '24px',
            })
            .setOrigin(0.5, 0.5);
        this.add
            .text(400, 255, 'Games', {
                fill: colors.red,
                fontFamily: fonts.primary,
                fontSize: '38px',
            })
            .setOrigin(0.5, 0.5);
    }

    private _startMenu(): void {
        this.scene.start('Start');
    }

    private _loadAudio() {
        this.load.audio(GameAudio.BLING, 'assets/sounds/bling.mp3');
        this.load.audio(GameAudio.INTRO, 'assets/sounds/intro.mp3');
        this.load.audio(GameAudio.THRILLER, 'assets/sounds/thriller.mp3');
        this.load.audio(
            GameAudio.MENU_SELECT,
            'assets/sounds/effects/sfx_menu_select1.mp3'
        );
        this.load.audio(
            GameAudio.BATTLE_INTRO,
            'assets/sounds/battle_intro.mp3'
        );
        this.load.audio(GameAudio.BATTLE_MAIN, 'assets/sounds/battle_main.mp3');
        this.load.audio(
            GameAudio.ENEMY_DEATH,
            'assets/sounds/effects/sfx_deathscream_alien4.mp3'
        );
        this.load.audio(
            GameAudio.PLAYER_IMPACT,
            'assets/sounds/effects/sfx_deathscream_human12.mp3'
        );
        this.load.audio(
            GameAudio.ELEMENT_SWITCH,
            'assets/sounds/effects/sfx_wpn_dagger.mp3'
        );
        this.load.audio(
            GameAudio.FOOTSTEPS,
            'assets/sounds/effects/sfx_movement_footstepsloop4_fast.mp3'
        );
    }

    private _loadSpritesheets() {
        this.load.spritesheet(GameSpritesheet.PLAYER, 'assets/uwe.png', {
            frameWidth: 48,
            frameHeight: 48,
        });
        this.load.spritesheet(
            GameSpritesheet.SPIRIT_FIRE,
            'assets/objects/firespirit.png',
            {
                frameWidth: 10,
                frameHeight: 26,
            }
        );
        this.load.spritesheet(
            GameSpritesheet.SPIRIT_WATER,
            'assets/objects/waterspirit.png',
            {
                frameWidth: 9,
                frameHeight: 24,
            }
        );
        this.load.spritesheet(
            GameSpritesheet.SPIRIT_EARTH,
            'assets/objects/earthspirit.png',
            {
                frameWidth: 9,
                frameHeight: 25,
            }
        );
        this.load.spritesheet(
            GameSpritesheet.BALL_EARTH,
            'assets/objects/earthball.png',
            {
                frameWidth: 65,
                frameHeight: 9,
            }
        );
        this.load.spritesheet(
            GameSpritesheet.BALL_FIRE,
            'assets/objects/fireball.png',
            {
                frameWidth: 68,
                frameHeight: 9,
            }
        );
        this.load.spritesheet(
            GameSpritesheet.BALL_WATER,
            'assets/objects/waterball.png',
            {
                frameWidth: 84,
                frameHeight: 9,
            }
        );
        this.load.spritesheet(
            GameSpritesheet.STATUS_EARTH,
            'assets/objects/earthstatus.png',
            {
                frameWidth: 13,
                frameHeight: 40,
            }
        );
        this.load.spritesheet(
            GameSpritesheet.STATUS_FIRE,
            'assets/objects/firestatus.png',
            {
                frameWidth: 14,
                frameHeight: 45,
            }
        );
        this.load.spritesheet(
            GameSpritesheet.STATUS_WATER,
            'assets/objects/waterstatus.png',
            {
                frameWidth: 14,
                frameHeight: 41,
            }
        );
    }

    private _loadImages() {
        this.load.image(GameImage.LOGO, 'assets/herzmut.png');
        this.load.image(
            GameImage.MENU_BACKGROUND,
            'assets/backgrounds/menu.png'
        );
        this.load.image(
            GameImage.MENU_BACKGROUND_DARK,
            'assets/backgrounds/menu_dark.png'
        );
        this.load.image(
            GameImage.ROOM_BACKGROUND,
            'assets/backgrounds/map.png'
        );
        this.load.image(GameImage.FULL_HEART, 'assets/heart.png');
        this.load.image(GameImage.HALF_HEART, 'assets/heart_half.png');
    }
}
