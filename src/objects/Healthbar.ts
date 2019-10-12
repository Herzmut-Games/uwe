import { Scene, GameObjects, Physics } from 'phaser';
import { fonts } from './Fonts';
import { colors } from './Colors';

export class Healthbar {
    private _health: number = 6;
    private _xPos: number = 650;
    private _hearts: Phaser.GameObjects.Sprite[] = [];

    constructor(parentScene: Scene) {
        this._render(parentScene);
    }

    public get health(): number {
        return this._health;
    }

    public ouch(): void {
        this._health -= 1;
        this._hearts.pop().destroy();
    }

    private _render(parentScene: Scene): void {
        // 40 is width of heart.png
        const heartWidth = 40;
        const heartCount = this.health / 2;
        if (heartCount > 3) {
            const offsetRight = (heartCount - 3) * heartWidth;
            this._xPos = this._xPos - offsetRight;
        }

        parentScene.add.text(this._xPos, 20, 'Health', {
            fontFamily: fonts.primary,
            fontSize: '30px',
            fill: colors.primary.light,
        });

        for (let i = 0; i < heartCount; i++) {
            const offset = heartWidth * i;

            const halfHeart = parentScene.add
                .sprite(this._xPos + offset, 54, 'halfHeart')
                .setOrigin(0, 0);

            const fullHeart = parentScene.add
                .sprite(this._xPos + offset, 54, 'fullHeart')
                .setOrigin(0, 0);

            this._hearts.push(halfHeart);
            this._hearts.push(fullHeart);
        }
    }
}
