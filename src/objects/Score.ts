import { Scene, GameObjects } from 'phaser';

export class Score {
    get score(): string {
        return `Score: ${this._score}`;
    }

    private _score: number = 0;
    private _text: GameObjects.Text;

    constructor(parentScene: Scene) {
        console.log(this.score);
        this._text = parentScene.add.text(0, 0, this.score, {
            fontSize: '32px',
            fill: '#FFF',
        });
    }

    public add(score: number): void {
        this._score += score;
    }

    public update(): void {
        this._text.setText(this.score);
    }
}
