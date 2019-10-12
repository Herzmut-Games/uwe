import { Scene, Physics, Input, Types } from 'phaser';

enum Direction {
    Up,
    UpRight,
    Right,
    DownRight,
    Down,
    DownLeft,
    Left,
    UpLeft,
    None,
}

export class Player {
    private _player: Physics.Arcade.Sprite;
    private _speed = 6;
    private _diagonalSpeed = this._speed / 1.5;
    private _animationSpeed = 15;

    private _keyW: Input.Keyboard.Key;
    private _keyA: Input.Keyboard.Key;
    private _keyS: Input.Keyboard.Key;
    private _keyD: Input.Keyboard.Key;

    private _isMoving: boolean = false;
    private _cursorKeys: Types.Input.Keyboard.CursorKeys;

    private get movementDirection(): Direction {
        switch (true) {
            case this._keyW.isDown && this._keyD.isDown:
                return Direction.UpRight;
            case this._keyW.isDown && this._keyA.isDown:
                return Direction.UpLeft;
            case this._keyS.isDown && this._keyD.isDown:
                return Direction.DownRight;
            case this._keyS.isDown && this._keyA.isDown:
                return Direction.DownLeft;
            case this._keyW.isDown:
                return Direction.Up;
            case this._keyS.isDown:
                return Direction.Down;
            case this._keyA.isDown:
                return Direction.Left;
            case this._keyD.isDown:
                return Direction.Right;
            default:
                return Direction.None;
        }
    }

    constructor(private parentScene: Scene) {
        this._keyW = this.parentScene.input.keyboard.addKey('W');
        this._keyA = this.parentScene.input.keyboard.addKey('A');
        this._keyS = this.parentScene.input.keyboard.addKey('S');
        this._keyD = this.parentScene.input.keyboard.addKey('D');

        this._player = parentScene.physics.add.sprite(100, 450, 'player');
        this._player.setScale(1.3);
        this._player.setBounce(0.2);
        this._player.setCollideWorldBounds(true);

        parentScene.physics.world.enableBody(this._player);

        this._cursorKeys = this.parentScene.input.keyboard.createCursorKeys();

        this._addAnimations();
    }

    public update(): void {
        this._move();
        this._animate();
    }

    private _animate(): void {
        switch (true) {
            case this._cursorKeys.up.isDown:
                this._player.anims.play('up', true);
                break;
            case this._cursorKeys.down.isDown:
                this._player.anims.play('down', true);
                break;
            case this._cursorKeys.left.isDown:
                this._player.anims.play('left', true);
                break;
            case this._cursorKeys.right.isDown:
                this._player.anims.play('right', true);
                break;
        }

        this._player.anims.resume();
        this._player.anims.pause();

        if (this._isMoving) {
            this._player.anims.resume();
        }
    }

    private _move(): void {
        if (this.movementDirection !== Direction.None) {
            switch (this.movementDirection) {
                case Direction.Up:
                    this._player.y -= this._speed;
                    break;
                case Direction.Down:
                    this._player.y += this._speed;
                    break;
                case Direction.Left:
                    this._player.x -= this._speed;
                    break;
                case Direction.Right:
                    this._player.x += this._speed;
                    break;
                case Direction.UpRight:
                    this._player.y -= this._diagonalSpeed;
                    this._player.x += this._diagonalSpeed;
                    break;
                case Direction.UpLeft:
                    this._player.y -= this._diagonalSpeed;
                    this._player.x -= this._diagonalSpeed;
                    break;
                case Direction.DownRight:
                    this._player.y += this._diagonalSpeed;
                    this._player.x += this._diagonalSpeed;
                    break;
                case Direction.DownLeft:
                    this._player.y += this._diagonalSpeed;
                    this._player.x -= this._diagonalSpeed;
                    break;
                default:
                    break;
            }

            this._isMoving = true;
        } else {
            this._isMoving = false;
        }
    }

    private _addAnimations(): void {
        this.parentScene.anims.create({
            key: 'left',
            frames: this.parentScene.anims.generateFrameNumbers('player', {
                frames: [1, 5, 9, 13],
            }),
            frameRate: this._animationSpeed,
            repeat: -1,
        });

        this.parentScene.anims.create({
            key: 'right',
            frames: this.parentScene.anims.generateFrameNumbers('player', {
                frames: [3, 7, 11, 15],
            }),
            frameRate: this._animationSpeed,
            repeat: -1,
        });

        this.parentScene.anims.create({
            key: 'up',
            frames: this.parentScene.anims.generateFrameNumbers('player', {
                frames: [2, 6, 10, 14],
            }),
            frameRate: this._animationSpeed,
            repeat: -1,
        });

        this.parentScene.anims.create({
            key: 'down',
            frames: this.parentScene.anims.generateFrameNumbers('player', {
                frames: [0, 4, 8, 12],
            }),
            frameRate: this._animationSpeed,
            repeat: -1,
        });

        this._player.anims.play('down');
        this._player.anims.pause();
    }
}
