import { Scene, GameObjects, Physics } from 'phaser';
import { screenWidth, screenHeight } from './config';

export class Player {
    private _player: Physics.Arcade.Sprite;
    private speed = 3;
    private diagonalSpeed = this.speed / 1.5;
    private animationSpeed = 10;

    constructor(private parentScene: Scene) {
        this._player = parentScene.physics.add.sprite(100, 450, 'player');
        this._player.setBounce(0.2);
        this._player.setCollideWorldBounds(true);

        parentScene.physics.world.enableBody(this._player);

        const centerx: number = screenWidth / 2;
        const centery: number = screenHeight / 2;

        parentScene.anims.create({
            key: 'left',
            frames: parentScene.anims.generateFrameNumbers('player', {
                start: 4,
                end: 7,
            }),
            frameRate: this.animationSpeed,
            repeat: -1,
        });

        parentScene.anims.create({
            key: 'right',
            frames: parentScene.anims.generateFrameNumbers('player', {
                start: 8,
                end: 11,
            }),
            frameRate: this.animationSpeed,
            repeat: -1,
        });

        parentScene.anims.create({
            key: 'up',
            frames: parentScene.anims.generateFrameNumbers('player', {
                start: 12,
                end: 15,
            }),
            frameRate: this.animationSpeed,
            repeat: -1,
        });

        parentScene.anims.create({
            key: 'down',
            frames: parentScene.anims.generateFrameNumbers('player', {
                start: 0,
                end: 3,
            }),
            frameRate: this.animationSpeed,
            repeat: -1,
        });
    }

    public update(): void {
        const control = this.parentScene.input.keyboard.createCursorKeys();

        if (
            this.parentScene.input.keyboard.addKey('W').isDown &&
            this.parentScene.input.keyboard.addKey('A').isDown
        ) {
            this._player.y -= this.diagonalSpeed;
            this._player.x -= this.diagonalSpeed;
            this._player.anims.play('left', true);
        } else if (
            this.parentScene.input.keyboard.addKey('W').isDown &&
            this.parentScene.input.keyboard.addKey('D').isDown
        ) {
            this._player.y -= this.diagonalSpeed;
            this._player.x += this.diagonalSpeed;
            this._player.anims.play('right', true);
        } else if (
            this.parentScene.input.keyboard.addKey('S').isDown &&
            this.parentScene.input.keyboard.addKey('A').isDown
        ) {
            this._player.y += this.diagonalSpeed;
            this._player.x -= this.diagonalSpeed;
            this._player.anims.play('left', true);
        } else if (
            this.parentScene.input.keyboard.addKey('S').isDown &&
            this.parentScene.input.keyboard.addKey('D').isDown
        ) {
            this._player.y += this.diagonalSpeed;
            this._player.x += this.diagonalSpeed;
            this._player.anims.play('right', true);
        } else if (this.parentScene.input.keyboard.addKey('W').isDown) {
            this._player.y -= this.speed;
            this._player.anims.play('up', true);
        } else if (this.parentScene.input.keyboard.addKey('S').isDown) {
            this._player.y += this.speed;
            this._player.anims.play('down', true);
        } else if (this.parentScene.input.keyboard.addKey('A').isDown) {
            this._player.x -= this.speed;
            this._player.anims.play('left', true);
        } else if (this.parentScene.input.keyboard.addKey('D').isDown) {
            this._player.x += this.speed;
            this._player.anims.play('right', true);
        } else if (
            this.parentScene.input.keyboard.addKey('W').isUp &&
            this.parentScene.input.keyboard.addKey('A').isUp &&
            this.parentScene.input.keyboard.addKey('S').isUp &&
            this.parentScene.input.keyboard.addKey('D').isUp
        ) {
            this._player.anims.stop();
        }

        if (control.up.isDown) {
            this._player.rotation = 0;
        }
        if (control.right.isDown) {
        }
        if (control.down.isDown) {
            this._player.rotation = 180;
        }
        if (control.left.isDown) {
            this._player.rotation = 270;
        }
    }
}
