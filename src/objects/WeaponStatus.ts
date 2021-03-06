import { Scene, Physics } from 'phaser';
import { GameSpritesheet } from '../configs/Resources';
import { PlayerElement } from './sprites/Player/PlayerElement';

export class WeaponStatus {
    private readonly _speed: number = 120;
    private readonly _weapon: Physics.Arcade.Sprite;

    constructor(private readonly _parentScene: Scene) {
        this._addAnimations();

        this._weapon = _parentScene.physics.add.staticSprite(
            350,
            60,
            GameSpritesheet.STATUS_FIRE
        );

        this._weapon.anims.play(
            `${GameSpritesheet.STATUS_FIRE}-animation`,
            true
        );

        this._weapon.setScale(4);
        this._weapon.setAngle(90);
    }

    public update(element: PlayerElement): void {
        switch (element) {
            case PlayerElement.Fire:
                this._weapon.anims.play(
                    `${GameSpritesheet.STATUS_FIRE}-animation`,
                    true
                );
                break;
            case PlayerElement.Water:
                this._weapon.anims.play(
                    `${GameSpritesheet.STATUS_WATER}-animation`,
                    true
                );
                break;
            case PlayerElement.Earth:
                this._weapon.anims.play(
                    `${GameSpritesheet.STATUS_EARTH}-animation`,
                    true
                );
                break;
        }
    }

    private _addAnimations(): void {
        [
            GameSpritesheet.STATUS_EARTH,
            GameSpritesheet.STATUS_FIRE,
            GameSpritesheet.STATUS_WATER,
        ].forEach(status => {
            this._parentScene.anims.create({
                key: `${status}-animation`,
                frames: this._parentScene.anims.generateFrameNumbers(status, {
                    start: 0,
                    end: -1,
                }),
                frameRate: this._speed,
                repeat: -1,
            });
        });
    }
}
