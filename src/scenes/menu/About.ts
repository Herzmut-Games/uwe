import { Scene, GameObjects } from 'phaser';
import { Button } from '../../objects/Button';
import { colors } from '../../configs/Colors';
import { fonts } from '../../configs/Fonts';
import { Scenes } from '../../configs/Scenes';

export class About extends Scene {
    private _aboutText!: GameObjects.Text;
    private _aboutBackButton!: Button;

    constructor() {
        super({ key: Scenes.About });
    }

    public create(): void {
        this.scene.moveAbove(Scenes.Menu);

        this._aboutText = this.add
            .text(570, 350, 'Christopher\nMarvin\nPatrick\nRobert', {
                color: colors.white,
                fontSize: '58px',
                fontFamily: fonts.primary,
            })
            .setOrigin(0.5, 0.5);

        this._aboutBackButton = Button.create(
            this,
            580,
            570,
            'Back',
            colors.white,
            colors.red,
            '58px',
            () => {
                this.scene.stop();
                this.scene.start(Scenes.Selection);
            }
        );
    }
}
