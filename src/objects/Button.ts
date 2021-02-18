import { Scene, GameObjects } from 'phaser';
import { fonts } from '../configs/Fonts';

export class Button {
    public static create(
        parentScene: Scene,
        x: number,
        y: number,
        text: string,
        color: string,
        hoverColor: string,
        size: string = '58px',
        actionHandler: () => void
    ): Button {
        return new Button(
            parentScene,
            x,
            y,
            text,
            color,
            hoverColor,
            size,
            actionHandler
        );
    }

    private readonly _text: GameObjects.Text;

    constructor(
        parentScene: Scene,
        x: number,
        y: number,
        text: string,
        color: string,
        hoverColor: string,
        size: string = '58px',
        public actionHandler: () => void
    ) {
        this._text = parentScene.add
            .text(x, y, text, {
                color,
                fontSize: size,
                fontFamily: fonts.primary,
            })
            .setInteractive({ useHandCursor: true });

        this._text.setOrigin(0.5, 1);

        this._text
            .on('pointerover', () => this._setColor(hoverColor))
            .on('pointerout', () => this._setColor(color))
            .on('pointerup', () => this.actionHandler());
    }

    public setAlpha(alpha: number) {
        this._text.setAlpha(alpha);
    }

    public remove(): void {
        this._text.destroy();
    }

    private _setColor(color: string): void {
        this._text.setColor(color);
    }
}
