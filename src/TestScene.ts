import { screenWidth, screenHeight } from './config';
import { Scene, GameObjects, Physics } from 'phaser';

export class TestScene extends Scene {
    private _circles: GameObjects.Arc[] = [];
    private _player: GameObjects.Triangle;

    constructor() {
        super({ key: 'TestScene' });
    }

    public preload(): void {}

    public create(): void {
        this._addTargets();
        this._addPlayer();
        this._createCollision();
    }

    public update(): void {
        const control = this.input.keyboard.createCursorKeys();

        switch (true) {
            case control.left.isDown:
                this._player.setRotation(this._player.rotation - 0.1);
                break;
            case control.right.isDown:
                this._player.setRotation(this._player.rotation + 0.1);
                break;
            // case control.up.isDown:
            // (this._player.body as Phaser.Physics.Arcade.Body).setVelocity()
        }
    }

    private _createCollision(): void {
        const circleGroup = this.physics.add.group(this._circles);
        this.physics.add.collider(this._player, circleGroup);
    }

    private _addPlayer(): void {
        const centerx: number = screenWidth / 2;
        const centery: number = screenHeight / 2;

        this._player = this.add
            .triangle(centerx, centery)
            .setFillStyle(0xff0000);

        this.physics.world.enableBody(this._player);

        (this._player.body as Physics.Arcade.Body)
            .setAllowGravity(false)
            .setCollideWorldBounds(true);
    }

    private _addTargets(): void {
        for (let num = 0; num < 25; num++) {
            this._circles.push(
                this.add.circle(screenWidth / 2, screenHeight / 2, 25, 500)
            );
        }

        this.physics.world.enable(this._circles);

        this._circles
            .map(c => c.body as Physics.Arcade.Body)
            .forEach((body, index) => {
                body.setCollideWorldBounds(true)
                    .setBounce(1, 1)
                    .setVelocity(1000 * Math.random(), 1000 * Math.random())
                    .setCircle(25, 0, 0);
            });
    }
}
