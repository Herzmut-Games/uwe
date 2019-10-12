import { Scene, GameObjects } from 'phaser';
import { fonts } from './Fonts';
import { colors } from './Colors';

export class Score {
    get score(): string {
        return `${this._score}`;
    }

    private _score: number = 0;
    private _subheadline: GameObjects.Text;

    constructor(parentScene: Scene) {
        console.log(this.score);
        parentScene.add.text(20, 20, 'Score', {
            fontFamily: fonts.primary,
            fontSize: '30px',
            fill: colors.primary.light,
        });
        this._subheadline = parentScene.add.text(20, 46, this.score, {
            fontFamily: fonts.primary,
            fontSize: '46px',
            fill: colors.white,
        });
    }

    public add(score: number): void {
        this._score += score;
    }

    public update(): void {
        this._subheadline.setText(this.score);
    }
}
