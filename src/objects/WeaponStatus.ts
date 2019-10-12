import { Scene, Physics } from 'phaser';
import { Element } from './Player';

export class WeaponStatus {
    private _speed: number = 120;
    private _weapon: Physics.Arcade.Sprite;

    constructor(parentScene: Scene) {
        parentScene.anims.create({
            key: 'earthstatus_ani',
            frames: parentScene.anims.generateFrameNumbers('earthstatus', {
                start: 0,
                end: -1,
            }),
            frameRate: this._speed,
            repeat: -1,
        });

        parentScene.anims.create({
            key: 'firestatus_ani',
            frames: parentScene.anims.generateFrameNumbers('firestatus', {
                start: 0,
                end: -1,
            }),
            frameRate: this._speed,
            repeat: -1,
        });

        parentScene.anims.create({
            key: 'waterstatus_ani',
            frames: parentScene.anims.generateFrameNumbers('waterstatus', {
                start: 0,
                end: -1,
            }),
            frameRate: this._speed,
            repeat: -1,
        });

        this._weapon = parentScene.physics.add.staticSprite(
            350,
            60,
            'firestatus'
        );

        this._weapon.setScale(4);
        this._weapon.setAngle(90);

        this._weapon.anims.play('firestatus_ani');
    }

    public update(element: Element): void {
        switch (element) {
            case Element.Fire:
                this._weapon.anims.play('firestatus_ani', true);
                break;
            case Element.Water:
                this._weapon.anims.play('waterstatus_ani', true);
                break;
            case Element.Earth:
                this._weapon.anims.play('earthstatus_ani', true);
                break;
        }
    }
}
