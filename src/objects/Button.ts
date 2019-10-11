import { Scene, GameObjects } from 'phaser';

export class Button {
    public static create(
        parentScene: Scene,
        x: number,
        y: number,
        text: string,
        color: string,
        hoverColor: string,
        actionHandler: () => void
    ): Button {
        return new Button(
            parentScene,
            x,
            y,
            text,
            color,
            hoverColor,
            actionHandler
        );
    }

    private _text: GameObjects.Text;

    constructor(
        parentScene: Scene,
        x: number,
        y: number,
        text: string,
        color: string,
        hoverColor: string,
        public actionHandler: () => void
    ) {
        this._text = parentScene.add
            .text(x, y, text, { fill: color, fontSize: '32px' })
            .setInteractive({ useHandCursor: true });

        this._text
            .on('pointerover', () => this._setColor(hoverColor))
            .on('pointerout', () => this._setColor(color))
            .on('pointerup', () => this.actionHandler());
    }

    private _setColor(color: string): void {
        this._text.setColor(color);
    }
}
