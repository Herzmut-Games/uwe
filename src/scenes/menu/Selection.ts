import { Scene } from 'phaser';
import { Button } from '../../objects/Button';
import { colors } from '../../objects/Colors';
import { Menu } from './Menu';

export class Selection extends Scene {
    private _startButton: Button;
    private _aboutButton: Button;
    private _helpButton: Button;
    private _startScene: Menu;

    constructor() {
        super({ key: 'Selection' });
    }

    public create(): void {
        this._startScene = this.scene.get('Menu') as Menu;
        this.scene.moveAbove('Menu');

        this._startButton = Button.create(
            this,
            580,
            495,
            'Start',
            colors.white,
            colors.red,
            '58px',
            () => {
                this._startScene.startGame();
            }
        );

        this._helpButton = Button.create(
            this,
            580,
            535,
            'Hilfe',
            colors.white,
            colors.red,
            '36px',
            () => {
                this.scene.stop();
                this.scene.start('Help');
            }
        );

        this._aboutButton = Button.create(
            this,
            580,
            570,
            'Credits',
            colors.white,
            colors.red,
            '36px',
            () => {
                this.scene.stop();
                this.scene.start('About');
            }
        );
    }

    public update(): void {
        // A bit hacky but does its job
        if (this._startScene.playerRunAway) {
            this._startButton.setAlpha(
                1 - this._startScene.runAwayModifier * 0.1
            );
            this._helpButton.setAlpha(
                1 - this._startScene.runAwayModifier * 0.1
            );
            this._aboutButton.setAlpha(
                1 - this._startScene.runAwayModifier * 0.1
            );
        }
    }
}
