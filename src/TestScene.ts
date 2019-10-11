import { Scene } from 'phaser';
import { Score } from './Score';

export class TestScene extends Scene {
<<<<<<< HEAD
    private _circles: GameObjects.Arc[] = [];
    private _player: GameObjects.Image;
=======
    private _score: Score;
>>>>>>> master

    constructor() {
        super({ key: 'TestScene' });
    }

    public preload(): void {
        this.load.image('player', 'assets/player.png');
    }

    public create(): void {
<<<<<<< HEAD
        this._addPlayer();
        this._createCollision();
    }

    public update(): void {
        const control = this.input.keyboard.createCursorKeys();

        if (this.input.keyboard.addKey('W').isDown) {
            this._player.y -= 3;
        }
        if (this.input.keyboard.addKey('S').isDown) {
            this._player.y += 3;
        }
        if (this.input.keyboard.addKey('A').isDown) {
            this._player.x -= 3;
        }
        if (this.input.keyboard.addKey('D').isDown) {
            this._player.x += 3;
        }
        if (control.up.isDown) {
            this._player.rotation = 0;
        }
        if (control.right.isDown) {
            this._player.rotation = 90;
        }
        if (control.down.isDown) {
            this._player.rotation = 180;
        }
        if (control.left.isDown) {
            this._player.rotation = 270;
        }
    }

    private _createCollision(): void {
        const circleGroup = this.physics.add.group(this._circles);
        this.physics.add.collider(this._player, circleGroup);
    }

    private _addPlayer(): void {
        const centerx: number = screenWidth / 2;
        const centery: number = screenHeight / 2;

        this._player = this.add.image(centerx, centery, 'player');
        this._player.setScale(0.1);
        this._player.width = 50;
        this._player.height = 50;

        this.physics.world.enableBody(this._player);

        (this._player.body as Physics.Arcade.Body)
            .setAllowGravity(false)
            .setCollideWorldBounds(true);
=======
        console.log('Create TestScene');
        this._score = new Score(this);
    }

    public update(): void {
        this._score.update();
>>>>>>> master
    }
}
