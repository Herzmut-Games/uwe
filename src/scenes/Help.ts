import { Scene } from 'phaser';
import { fonts } from '../objects/Fonts';
import { colors, hexColors } from '../objects/Colors';
import { Button } from '../objects/Button';
import { GameImage, GameSpritesheet } from '../configs/Resources';

export class Help extends Scene {
    constructor() {
        super({ key: Help.name });
    }

    public create() {
        const background = this.add.image(0, 88, GameImage.ROOM_BACKGROUND);
        background.setOrigin(0, 0).setDisplaySize(800, 512);

        this._renderTopBar();

        [
            GameSpritesheet.BALL_FIRE,
            GameSpritesheet.BALL_EARTH,
            GameSpritesheet.BALL_WATER,
        ].forEach(type => {
            this._addAnimation(type, 0, 59);
        });

        [
            GameSpritesheet.SPIRIT_FIRE,
            GameSpritesheet.SPIRIT_EARTH,
            GameSpritesheet.SPIRIT_WATER,
        ].forEach(type => {
            this._addAnimation(type, 0, -1);
        });

        this._addSpriteAt(555, 210, GameSpritesheet.BALL_WATER);
        this._addSpriteAt(580, 280, GameSpritesheet.BALL_EARTH);
        this._addSpriteAt(580, 350, GameSpritesheet.BALL_FIRE);
        this._addSpriteAt(730, 200, GameSpritesheet.SPIRIT_FIRE);
        this._addSpriteAt(730, 270, GameSpritesheet.SPIRIT_WATER);
        this._addSpriteAt(730, 340, GameSpritesheet.SPIRIT_EARTH);

        const textSecondary: object = {
            fontFamily: fonts.primary,
            fontSize: '40px',
            fill: colors.white,
        };

        this.add.text(85, 180, 'Wasser besiegt Feuer', textSecondary);
        this.add.text(100, 250, 'Erde besiegt Wasser', textSecondary);
        this.add.text(130, 320, 'Feuer besiegt Erde', textSecondary);
        this.add.text(420, 410, 'Bewegen mit: W,A,S,D', textSecondary);
        this.add.text(370, 460, 'Feuern mit: Pfeiltasten', textSecondary);
        this.add.text(
            215,
            510,
            'Element wechseln mit: Leertaste',
            textSecondary
        );
        this.add
            .text(15, 555, '(Eigentlich wie bei Pokemon, ne?)', {
                fontFamily: fonts.primary,
                fontSize: '20px',
                fill: colors.white,
            })
            .setAngle(270);
    }

    private _renderTopBar() {
        this.add
            .graphics()
            .fillStyle(hexColors.primary.dark, 1)
            .fillRect(0, 0, 800, 112);

        Button.create(
            this,
            720,
            60,
            'Menu',
            colors.white,
            colors.red,
            '46px',
            () => {
                this.scene.stop();
                this.scene.start(Selection.name);
            }
        );

        this.add.text(20, 5, 'Hilfe', {
            fontFamily: fonts.primary,
            fontSize: '46px',
            fill: colors.white,
        });

        this.add.text(20, 48, "Wenn's mal klemmt", {
            fontFamily: fonts.primary,
            fontSize: '38px',
            fill: colors.primary.light,
        });
    }

    private _addSpriteAt(x: number, y: number, sprite: GameSpritesheet): void {
        this.physics.add
            .sprite(x, y, sprite)
            .play(`${sprite}-help`)
            .setAngle(180)
            .setScale(3);
    }

    private _addAnimation(type: GameSpritesheet, start: number, end: number) {
        this.anims.create({
            key: `${type}-help`,
            frames: this.anims.generateFrameNumbers(type, {
                start,
                end,
            }),
            frameRate: 20,
            repeat: -1,
        });
    }
}
