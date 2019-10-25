import { Scene, GameObjects, Physics, Sound } from 'phaser';
import { screenCenterX } from '../../configs/Screen';
import { fonts } from '../../configs/Fonts';
import { colors } from '../../configs/Colors';
import { GameImage, GameAudio, GameSpritesheet } from '../../configs/Resources';
import { Scenes } from '../../configs/Scenes';

export class Menu extends Scene {
    public playerRunAway: boolean;
    public runAwayModifier: number;
    private _background: GameObjects.TileSprite;
    private _menuPlayer: Physics.Arcade.Sprite;
    private _backgroundModifier: number;
    private _moonWalkEnabled: boolean;
    private _background_dark: GameObjects.TileSprite;
    private _soundIntro: Sound.BaseSound;
    private _soundThriller: Sound.BaseSound;
    private _soundMenuSelect: Sound.BaseSound;

    constructor() {
        super({ key: Scenes.Menu });
    }

    public destroy(): void {
        this._soundIntro.stop();
        this._soundThriller.stop();
        this.scene.stop(Scenes.Selection);
    }

    public create(): void {
        this.runAwayModifier = 0;
        this._backgroundModifier = 2.75;
        this._moonWalkEnabled = false;

        this._background = this.add.tileSprite(
            0,
            300,
            0,
            0,
            GameImage.MENU_BACKGROUND
        );

        this._background_dark = this.add.tileSprite(
            0,
            300,
            0,
            0,
            GameImage.MENU_BACKGROUND_DARK
        );
        this._background_dark.setAlpha(0);

        this._soundIntro = this.sound.add(GameAudio.INTRO, {
            volume: 0.5,
            loop: true,
        });
        this._soundThriller = this.sound.add(GameAudio.THRILLER, {
            loop: true,
        });
        this._soundMenuSelect = this.sound.add(GameAudio.MENU_SELECT);

        this._soundIntro.play();

        this._displayMenuPlayer();
        this._displayHeader();
        this.scene.launch(Scenes.Selection);
    }

    public update(): void {
        if (this.playerRunAway) {
            this.runAwayModifier += 0.4;
        }

        this._menuPlayer.x += this.runAwayModifier;
        this._background.tilePositionX +=
            this._backgroundModifier + this.runAwayModifier;
        this._background_dark.tilePositionX +=
            this._backgroundModifier + this.runAwayModifier;

        if (this._menuPlayer.x >= 900) {
            this.playerRunAway = false;
            this.runAwayModifier = 0;
            this.scene.start(Scenes.Room);
            this.destroy();
        }

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

    public startGame(): void {
        this._disableMoonwalk();
        this._soundMenuSelect.play();
        this._menuPlayer.anims.play('menu_player_right-fast');
        this.playerRunAway = true;
    }

    private _displayMenuPlayer(): void {
        this.anims.create({
            key: 'menu_player_left',
            frames: this.anims.generateFrameNumbers(GameSpritesheet.PLAYER, {
                frames: [1, 5, 9, 13],
            }),
            frameRate: 4,
            repeat: -1,
        });
        this.anims.create({
            key: 'menu_player_right',
            frames: this.anims.generateFrameNumbers(GameSpritesheet.PLAYER, {
                frames: [3, 7, 11, 15],
            }),
            frameRate: 5.2,
            repeat: -1,
        });
        this.anims.create({
            key: 'menu_player_down',
            frames: this.anims.generateFrameNumbers(GameSpritesheet.PLAYER, {
                frames: [0],
            }),
            frameRate: 5.2,
            repeat: 0,
        });
        this.anims.create({
            key: 'menu_player_right-fast',
            frames: this.anims.generateFrameNumbers(GameSpritesheet.PLAYER, {
                frames: [3, 7, 11, 15],
            }),
            frameRate: 15,
            repeat: -1,
        });

        this._menuPlayer = this.physics.add.sprite(
            200,
            370,
            GameSpritesheet.PLAYER
        );
        this._menuPlayer.on('pointerup', () => this._toggleMoonWalk());
        this._menuPlayer.setInteractive();
        this._menuPlayer.setOrigin(0.5, 0.5);
        this._menuPlayer.setScale(7);
        this._menuPlayer.anims.play('menu_player_right');
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
        this._menuPlayer.anims.play('menu_player_down');
        this._backgroundModifier = 0;
        this._soundIntro.stop();
        this._soundThriller.play();
        this.time.delayedCall(
            934,
            () => {
                if (this._moonWalkEnabled) {
                    this._menuPlayer.anims.play('menu_player_left');
                }
                this._backgroundModifier = 2.75;
            },
            [],
            this
        );
    }

    private _disableMoonwalk(): void {
        this._moonWalkEnabled = false;
        this._menuPlayer.anims.play('menu_player_right');
        this._soundThriller.stop();
        this._soundIntro.play();
    }

    private _displayHeader(): void {
        this.add
            .text(screenCenterX, 80, 'UWE', {
                fill: colors.red,
                fontSize: 120,
                fontFamily: fonts.primary,
            })
            .setOrigin(0.5, 0.5);
        this.add
            .text(screenCenterX, 140, '(E wie Elemente)', {
                fill: colors.red,
                fontSize: 25,
                fontFamily: fonts.primary,
            })
            .setOrigin(0.5, 0.5);
    }
}
