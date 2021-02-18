import { Scene } from 'phaser';
import { screenHeight, screenCenterX, screenCenterY } from '../configs/Screen';
import { Button } from '../objects/Button';
import { fonts } from '../configs/Fonts';
import { colors } from '../configs/Colors';
import { Scenes } from '../configs/Scenes';

interface DeathSceneData {
    score: number;
}

export class Death extends Scene {
    constructor() {
        super({ key: Scenes.Death });
    }

    public create(data: DeathSceneData): void {
        this.add
            .text(screenCenterX, screenHeight / 3, `Punkte: ${data.score}`, {
                fontFamily: fonts.primary,
                fontSize: '80px',
                color: colors.primary.light,
            })
            .setOrigin(0.5, 0.5);

        Button.create(
            this,
            screenCenterX,
            screenCenterY + 50,
            'Nochmal',
            '#FFF',
            '#D50C2D',
            '40px',
            () => this.scene.start(Scenes.Room)
        );
        Button.create(
            this,
            screenCenterX,
            screenCenterY + 100,
            'Lieber nicht',
            '#FFF',
            '#D50C2D',
            '40px',
            () => this.scene.start(Scenes.Menu)
        );
    }
}
