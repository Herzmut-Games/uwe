import { Scene } from 'phaser';
import { screenWidth, screenHeight } from './config';
import { Button } from './Button';

export class StartScene extends Scene {
    private _startButton: Button;

    constructor() {
        super({ key: 'StartScene' });
    }

    public create(): void {
        this._startButton = new Button(
            this,
            screenWidth / 2,
            screenHeight / 2,
            'Start',
            '#FFF',
            '#D50C2D',
            () => this.scene.start('Room')
        );
    }
}
