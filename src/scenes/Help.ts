import { Scene } from 'phaser';
import { fonts } from '../objects/Fonts';
import { colors } from '../objects/Colors';
import { Button } from '../objects/Button';

export class Help extends Scene {
    constructor() {
        super({ key: 'Help' });
    }

    public create() {
        const background = this.add.image(0, 88, 'background');
        background.setOrigin(0, 0).setDisplaySize(800, 512);

        this.add
            .graphics()
            .fillStyle(0x3b3332, 1)
            .fillRect(0, 0, 800, 112);

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

        Button.create(
            this,
            720,
            60,
            'Menu',
            colors.white,
            colors.red,
            '46px',
            () => {
                this.scene.setActive(true, 'Start');
                this.scene.setActive(false);
                this.scene.bringToTop('Start');
                this.scene.stop();
            }
        );

        ['fireball', 'earthball', 'waterball'].forEach(type => {
            this.anims.create({
                key: type + '-help',
                frames: this.anims.generateFrameNumbers(type, {
                    start: 0,
                    end: 59,
                }),
                frameRate: 20,
                repeat: -1,
            });
        });
        ['firespirit', 'earthspirit', 'waterspirit'].forEach(type => {
            this.anims.create({
                key: type + '-help',
                frames: this.anims.generateFrameNumbers(type, {
                    start: 0,
                    end: -1,
                }),
                frameRate: 20,
                repeat: -1,
            });
        });

        this.add.text(85, 180, 'Wasser besiegt Feuer', {
            fontFamily: fonts.primary,
            fontSize: '40px',
            fill: colors.white,
        });
        this.add.text(100, 250, 'Erde besiegt Wasser', {
            fontFamily: fonts.primary,
            fontSize: '40px',
            fill: colors.white,
        });
        this.add.text(130, 320, 'Feuer besiegt Erde', {
            fontFamily: fonts.primary,
            fontSize: '40px',
            fill: colors.white,
        });
        this.physics.add
            .sprite(555, 210, 'waterball')
            .play('waterball-help')
            .setAngle(180)
            .setScale(3);
        this.physics.add
            .sprite(580, 280, 'earthball')
            .play('earthball-help')
            .setAngle(180)
            .setScale(3);
        this.physics.add
            .sprite(580, 350, 'fireball')
            .play('fireball-help')
            .setAngle(180)
            .setScale(3);

        this.physics.add
            .sprite(730, 200, 'firespirit')
            .play('firespirit-help')
            .setScale(3);
        this.physics.add
            .sprite(730, 270, 'waterspirit')
            .play('waterspirit-help')
            .setScale(3);
        this.physics.add
            .sprite(730, 340, 'earthspirit')
            .play('earthspirit-help')
            .setScale(3);

        this.add
            .text(15, 555, '(Eigentlich wie bei Pokemon, ne?)', {
                fontFamily: fonts.primary,
                fontSize: '20px',
                fill: colors.white,
            })
            .setAngle(270);

        this.add.text(420, 410, 'Bewegen mit: W,A,S,D', {
            fontFamily: fonts.primary,
            fontSize: '40px',
            fill: colors.white,
        });
        this.add.text(370, 460, 'Feuern mit: Pfeiltasten', {
            fontFamily: fonts.primary,
            fontSize: '40px',
            fill: colors.white,
        });
        this.add.text(215, 510, 'Element wechseln mit: Leertaste', {
            fontFamily: fonts.primary,
            fontSize: '40px',
            fill: colors.white,
        });
    }
}
