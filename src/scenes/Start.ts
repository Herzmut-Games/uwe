import { Scene } from 'phaser';
import { screenWidth, screenHeight } from '../config';
import { Button } from '../objects/Button';
import { fonts } from '../objects/Fonts';
import { SingleEntryPlugin } from 'webpack';
import { Room } from './Room';
import { tsExpressionWithTypeArguments } from '@babel/types';

export class Start extends Scene {
    private _music: Phaser.Sound.BaseSound;
    private _background: Phaser.GameObjects.TileSprite;
    private _menuPlayer: Phaser.Physics.Arcade.Sprite;
    private _playerRunAway: boolean;
    private _runAwayModifier: number = 0;
    private _backgroundModifier: number = 2.75;
    private _startButton: Button;
    private _aboutButton: Button;
    private _aboutText: Phaser.GameObjects.Text;
    private _aboutBackButton: Button;
    private _moonWalkEnabled: boolean = false;
    private _background_dark: Phaser.GameObjects.TileSprite;
    constructor() {
        super({ key: 'Start' });
    }

    public preload() {
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
        this.load.spritesheet('player', 'assets/georg.png', {
            frameWidth: 48,
            frameHeight: 48,
        });
    }

    public destroy(): void {
        this._music.stop();
    }

    public create(): void {
        this._background = this.add.tileSprite(100, 0, 0, 0, 'menu-background');
        this._background.setScale(1.2);

        this._background_dark = this.add.tileSprite(
            100,
            0,
            0,
            0,
            'menu-background-dark'
        );
        this._background_dark.setScale(1.2);
        this._background_dark.setAlpha(0);

        this._music = this.sound.add('intro', { volume: 0.5, loop: true });
        this._music.play();

        this._displayMenuPlayer();
        this._displayHeader();
        this._displayMenu();
    }

    public update(): void {
        if (this._playerRunAway) {
            this._runAwayModifier += 0.4;
            this._startButton.setAlpha(1 - this._runAwayModifier * 0.1);
            this._aboutButton.setAlpha(1 - this._runAwayModifier * 0.1);
        }
        this._menuPlayer.x += this._runAwayModifier;
        this._background.tilePositionX +=
            this._backgroundModifier + this._runAwayModifier;
        this._background_dark.tilePositionX +=
            this._backgroundModifier + this._runAwayModifier;

        if (this._menuPlayer.x >= 900) {
            this._playerRunAway = false;
            this._runAwayModifier = 0;
            this.scene.start('Room');
            this.destroy();
        }

        console.log(this._background_dark.alpha);
        if (this._moonWalkEnabled) {
            if (this._background_dark.alpha < 1) {
                this._background_dark.setAlpha(
                    this._background_dark.alpha + 0.03
                );
            }
        } else {
            if (this._background_dark.alpha > 0) {
                this._background_dark.setAlpha(
                    this._background_dark.alpha - 0.1
                );
            }
        }
    }

    private _displayMenuPlayer(): void {
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [1, 5, 9, 13],
            }),
            frameRate: 4,
            repeat: -1,
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [3, 7, 11, 15],
            }),
            frameRate: 5.2,
            repeat: -1,
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [0],
            }),
            frameRate: 5.2,
            repeat: 0,
        });
        this.anims.create({
            key: 'right-fast',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [3, 7, 11, 15],
            }),
            frameRate: 15,
            repeat: -1,
        });

        this._menuPlayer = this.physics.add.sprite(200, 350, 'player');
        this._menuPlayer.on('pointerup', () => this._toggleMoonWalk());
        this._menuPlayer.setInteractive();
        this._menuPlayer.setOrigin(0.5, 0.5);
        this._menuPlayer.setScale(7);
        this._menuPlayer.play('right');
    }

    private _toggleMoonWalk(): void {
        this._moonWalkEnabled = !this._moonWalkEnabled;
        if (this._moonWalkEnabled) {
            this._enableMoonwalk();
        } else {
            this._disableMoonwalk();
        }
    }

    private _enableMoonwalk(): void {
        this._moonWalkEnabled = true;
        this._music.stop();
        this._music = this.sound.add('thriller', { loop: true });
        this._menuPlayer.anims.play('down');
        this._backgroundModifier = 0;
        this._music.play();
        this.time.delayedCall(
            934,
            () => {
                if (this._moonWalkEnabled) {
                    this._menuPlayer.anims.play('left');
                }
                this._backgroundModifier = 2.75;
            },
            [],
            this
        );
    }

    private _disableMoonwalk(): void {
        this._moonWalkEnabled = false;
        this._menuPlayer.anims.play('right');
        this._music.stop();
        this._music = this.sound.add('intro', { volume: 0.5, loop: true });
        this._music.play();
    }

    private _displayHeader(): void {
        this.add
            .text(screenWidth / 2, 80, 'UWE', {
                fill: '#D50C2D',
                fontSize: 120,
                fontFamily: fonts.primary,
            })
            .setOrigin(0.5, 0.5);
        this.add
            .text(screenWidth / 2, 140, '(Das E steht für Elemente)', {
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
    }

    private _hideMenu(): void {
        this._startButton.remove();
        this._aboutButton.remove();
    }

    private _hideAbout(): void {
        this._aboutText.destroy();
        this._aboutBackButton.remove();
    }

    private _displayAbout(): void {
        this._aboutText = this.add
            .text(570, 350, 'Christopher\nMarvin\nPatrick\nRobert', {
                fill: '#FFF',
                fontSize: '58px',
                fontFamily: fonts.primary,
            })
            .setOrigin(0.5, 0.5);
        this._aboutBackButton = Button.create(
            this,
            580,
            570,
            'Back',
            '#FFF',
            '#D50C2D',
            '58px',
            () => {
                this._hideAbout();
                this._displayMenu();
            }
        );
    }

    private _displayMenu(): void {
        this._startButton = Button.create(
            this,
            580,
            510,
            'Start',
            '#FFF',
            '#D50C2D',
            '58px',
            () => {
                this._disableMoonwalk();
                this.sound.add('menu-select').play();
                this._menuPlayer.anims.play('right-fast');
                this._playerRunAway = true;
            }
        );

        this._aboutButton = Button.create(
            this,
            580,
            570,
            'Credits',
            '#FFF',
            '#D50C2D',
            '58px',
            () => {
                this._hideMenu();
                this._displayAbout();
            }
        );
    }
}
