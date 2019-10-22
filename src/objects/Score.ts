import { Scene, GameObjects } from 'phaser';
import { fonts } from '../configs/Fonts';
import { colors } from '../configs/Colors';

export class Score {
    get score(): number {
        return this._score;
    }

    private _score: number = 0;
    private readonly _subheadline: GameObjects.Text;

    constructor(parentScene: Scene) {
        parentScene.add.text(20, 20, 'Punkte', {
            fontFamily: fonts.primary,
            fontSize: '30px',
            fill: colors.primary.light,
        });
        this._subheadline = parentScene.add.text(20, 46, `${this.score}`, {
            fontFamily: fonts.primary,
            fontSize: '46px',
            fill: colors.white,
        });
    }

    public add(score: number): void {
        this._score += score;
        this._subheadline.setText(`${this.score}`);
    }
}
