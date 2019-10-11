import { Scene, Physics } from 'phaser';
import { Player } from './Player';

export class Fireball extends Physics.Arcade.Sprite {
    private _animationSpeed: number = 10;

    constructor(private parentScene: Scene) {
        super(parentScene, 0, 0, 'fireball');

        parentScene.anims.create({
            key: 'firedown',
            frames: parentScene.anims.generateFrameNumbers('fireball', {
                start: 0,
                end: 9,
            }),
            frameRate: this._animationSpeed,
            repeat: -1,
        });
    }

    public fire(player: Player) {
        this.setPosition(300, 300);
        this.anims.play('firedown', true);
    }
}
