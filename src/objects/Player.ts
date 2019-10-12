import { Scene, Physics, Input, Types, GameObjects } from 'phaser';
import { Fireball } from './Fireball';

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

enum Element {
    Fire = 0xd50c2d,
    Water = 0x0000ff,
    Grass = 0x00ff00,
}

interface ControlKeys {
    One: Input.Keyboard.Key;
    Two: Input.Keyboard.Key;
    Three: Input.Keyboard.Key;
    W: Input.Keyboard.Key;
    A: Input.Keyboard.Key;
    S: Input.Keyboard.Key;
    D: Input.Keyboard.Key;
    Up: Input.Keyboard.Key;
    Down: Input.Keyboard.Key;
    Left: Input.Keyboard.Key;
    Right: Input.Keyboard.Key;
    Space: Input.Keyboard.Key;
}

export class Player {
    private _player: Physics.Arcade.Sprite;
    private _speed = 6;
    private _diagonalSpeed = this._speed / 1.5;
    private _animationSpeed = 15;
    private _keys: ControlKeys;

    private _isMoving: boolean = false;
    private _currentElement: Element = Element.Fire;

    private _fireballs: GameObjects.Group;
    private _waterballs: GameObjects.Group;
    private _earthballs: GameObjects.Group;
    private _footsteps: Phaser.Sound.BaseSound;

    private get movementDirection(): Direction {
        switch (true) {
            case this._keys.W.isDown && this._keys.D.isDown:
                return Direction.UpRight;
            case this._keys.W.isDown && this._keys.A.isDown:
                return Direction.UpLeft;
            case this._keys.S.isDown && this._keys.D.isDown:
                return Direction.DownRight;
            case this._keys.S.isDown && this._keys.A.isDown:
                return Direction.DownLeft;
            case this._keys.W.isDown:
                return Direction.Up;
            case this._keys.S.isDown:
                return Direction.Down;
            case this._keys.A.isDown:
                return Direction.Left;
            case this._keys.D.isDown:
                return Direction.Right;
            default:
                return Direction.None;
        }
    }

    constructor(private parentScene: Scene) {
        const cursorKeys = this.parentScene.input.keyboard.createCursorKeys();
        this._footsteps = this.parentScene.sound.add('footsteps', {
            rate: 1.5,
            volume: 0.5,
        });

        this._keys = {
            One: this.parentScene.input.keyboard.addKey('ONE'),
            Two: this.parentScene.input.keyboard.addKey('TWO'),
            Three: this.parentScene.input.keyboard.addKey('THREE'),
            W: this.parentScene.input.keyboard.addKey('W'),
            A: this.parentScene.input.keyboard.addKey('A'),
            S: this.parentScene.input.keyboard.addKey('S'),
            D: this.parentScene.input.keyboard.addKey('D'),
            Up: cursorKeys.up,
            Left: cursorKeys.left,
            Right: cursorKeys.right,
            Down: cursorKeys.down,
            Space: cursorKeys.space,
        };

        this._player = parentScene.physics.add.sprite(100, 450, 'player');
        this._player.setScale(1.3);
        this._player.setBounce(0.2);
        this._player.setCollideWorldBounds(true);

        parentScene.physics.world.enableBody(this._player);

        this._earthballs = parentScene.physics.add.group({
            classType: Fireball,
            runChildUpdate: true,
        });
        this._waterballs = parentScene.physics.add.group({
            classType: Fireball,
            runChildUpdate: true,
        });
        this._fireballs = parentScene.physics.add.group({
            classType: Fireball,
            runChildUpdate: true,
        });

        this._addElementListeners();
        this._addShootListeners();
        this._addAnimations();
    }

    public update(): void {
        this._move();
        this._animate();
        this._setElementColor();
    }

    private _setElementColor(): void {
        this._player.tint = this._currentElement;
    }

    private _animate(): void {
        switch (true) {
            case this._keys.Up.isDown:
                this._player.anims.play('up', true);
                break;
            case this._keys.Down.isDown:
                this._player.anims.play('down', true);
                break;
            case this._keys.Left.isDown:
                this._player.anims.play('left', true);
                break;
            case this._keys.Right.isDown:
                this._player.anims.play('right', true);
                break;
        }

        this._player.anims.resume();
        this._player.anims.pause();

        if (this._isMoving) {
            if (!this._footsteps.isPlaying) {
                this._footsteps.play();
            }
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

    private _addElementListeners(): void {
        this._keys.One.onDown = () => (this._currentElement = Element.Fire);
        this._keys.Two.onDown = () => (this._currentElement = Element.Water);
        this._keys.Three.onDown = () => (this._currentElement = Element.Grass);

        this._keys.Space.onDown = () => {
            this.parentScene.sound.add('element-switch').play();
            switch (this._currentElement) {
                case Element.Fire:
                    this._currentElement = Element.Water;
                    break;
                case Element.Water:
                    this._currentElement = Element.Grass;
                    break;
                case Element.Grass:
                    this._currentElement = Element.Fire;
                    break;
            }
        };
    }

    private _addShootListeners(): void {
        this._keys.Left.onDown = () => {
            console.log('on fire');
            switch (this._currentElement) {
                case Element.Fire:
                    this._fireballs
                        .get()
                        .setActive(true)
                        .setVisible(true)
                        .fire(this);
                    break;
                case Element.Water:
                    this._currentElement = Element.Grass;
                    break;
                case Element.Grass:
                    this._currentElement = Element.Fire;
                    break;
            }

            // this.physics.add.collider(enemyGroup, fireball, () => {});
        };
    }
}
