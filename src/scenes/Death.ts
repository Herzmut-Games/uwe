import { Scene } from 'phaser';
import { screenWidth, screenHeight } from '../config';
import { Button } from '../objects/Button';

export interface DeathSceneData {
    score: number;
}

export class Death extends Scene {
    constructor() {
        super({ key: 'Death' });
    }

    public create(data: DeathSceneData): void {
        console.log('Create DeathScene');

        this.add.text(
            screenWidth / 2,
            screenHeight / 2,
            `Score: ${data.score}`,
            { fill: '#FFF' }
        );

        Button.create(
            this,
            screenWidth / 2,
            screenHeight / 2 + 50,
            'Retry',
            '#FFF',
            '#D50C2D',
            () => this.scene.start('Room')
        );
    }
}
