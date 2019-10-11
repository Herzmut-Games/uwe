import { Scene } from 'phaser';
import { screenWidth, screenHeight } from '../config';
import { Button } from '../objects/Button';

export class Start extends Scene {
    constructor() {
        super({ key: 'Start' });
    }

    public create(): void {
        Button.create(
            this,
            screenWidth / 2,
            screenHeight / 2,
            'Start',
            '#FFF',
            '#D50C2D',
            () => this.scene.start('Room')
        );

        Button.create(
            this,
            screenWidth / 2,
            screenHeight / 2 + 50,
            'DIE',
            '#D50C2D',
            '#FFF',
            () => this.scene.start('Death', { score: 1337 })
        );
    }
}
