import { Scene, GameObjects } from 'phaser';
import { fonts } from './Fonts';
import { colors } from './Colors';
import { GameImage } from '../configs/Resources';

export class Healthbar {
    private _health: number = 6;
    private _xPos: number = 650;
    private readonly _hearts: GameObjects.Sprite[] = [];

    constructor(parentScene: Scene) {
        this._render(parentScene);
    }

    public get health(): number {
        return this._health;
    }

    public ouch(): void {
        this._health -= 1;
        if (this._hearts.length > 0) {
            this._hearts.pop().destroy();
        }
    }

    private _render(parentScene: Scene): void {
        // 40 is width of heart.png
        const heartWidth = 40;
        const heartCount = this.health / 2;
        if (heartCount > 3) {
            const offsetRight = (heartCount - 3) * heartWidth;
            this._xPos = this._xPos - offsetRight;
        }

        parentScene.add.text(this._xPos, 20, 'Leben', {
            fontFamily: fonts.primary,
            fontSize: '30px',
            fill: colors.primary.light,
        });

        for (let i = 0; i < heartCount; i++) {
            const offset = heartWidth * i;

            const halfHeart = parentScene.add
                .sprite(this._xPos + offset, 54, GameImage.HALF_HEART)
                .setOrigin(0, 0);

            const fullHeart = parentScene.add
                .sprite(this._xPos + offset, 54, GameImage.FULL_HEART)
                .setOrigin(0, 0);

            this._hearts.push(halfHeart);
            this._hearts.push(fullHeart);
        }
    }
}
