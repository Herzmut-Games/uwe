import { Scene } from 'phaser';
import { screenWidth, screenHeight } from '../config';
import { Button } from '../objects/Button';
import { fonts } from '../objects/Fonts';
import { colors } from '../objects/Colors';

export interface DeathSceneData {
    score: number;
}

export class Death extends Scene {
    constructor() {
        super({ key: 'Death' });
    }

    public create(data: DeathSceneData): void {
        this.add
            .text(screenWidth / 2, screenHeight / 3, `Punkte: ${data.score}`, {
                fontFamily: fonts.primary,
                fontSize: '80px',
                fill: colors.primary.light,
            })
            .setOrigin(0.5, 0.5);

        Button.create(
            this,
            screenWidth / 2,
            screenHeight / 2 + 50,
            'Nochma probieren',
            '#FFF',
            '#D50C2D',
            '40px',
            () => this.scene.start('Room')
        );
        Button.create(
            this,
            screenWidth / 2,
            screenHeight / 2 + 100,
            'Lieber nich.',
            '#FFF',
            '#D50C2D',
            '40px',
            () => this.scene.start('Start')
        );
    }
}
