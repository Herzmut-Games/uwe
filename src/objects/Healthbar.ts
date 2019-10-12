import { Scene, GameObjects } from 'phaser';

export class Healthbar {
    private _text: GameObjects.Text;
    private _health: number = 3;

    public get health(): number {
        return this._health;
    }

    constructor(parentScene: Scene) {
        this._text = parentScene.add.text(200, 50, '');
    }

    public ouch(): void {
        this._health -= 1;
    }

    public update(): void {
        this._text.setText(`Health: ${this._health}`);
    }
}
