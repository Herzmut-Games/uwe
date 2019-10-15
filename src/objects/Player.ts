import { Scene, Physics, Input, Types, Sound, Time } from 'phaser';
import { Fireball } from './Fireball';
import { Waterball } from './Waterball';
import { Earthball } from './Earthball';
import { GameAudio, GameSpritesheet } from '../configs/Resources';

export enum Direction {
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

export enum Element {
    Fire,
    Water,
    Earth,
}

type Keys =
    | 'One'
    | 'Two'
    | 'Three'
    | 'W'
    | 'A'
    | 'S'
    | 'D'
    | 'Up'
    | 'Down'
    | 'Left'
    | 'Right'
    | 'Space';

type ControlKeys = { [k in Keys]: Input.Keyboard.Key };

export class Player {
    get bodyX(): number {
        return this._player.x + this._player.displayWidth / 2;
    }
    get bodyY(): number {
        return this._player.y + this._player.displayHeight / 2;
    }

    get element(): Element {
        return this._currentElement;
    }

    get gameObject(): Physics.Arcade.Sprite {
        return this._player;
    }

    public fireballs: Physics.Arcade.Group;
    public waterballs: Physics.Arcade.Group;
    public earthballs: Physics.Arcade.Group;

    private _player: Physics.Arcade.Sprite;
    private _speed = 6;
    private _diagonalSpeed = this._speed / 1.5;
    private _animationSpeed = 15;
    private _keys: ControlKeys;
    private _isMoving: boolean = false;
    private _currentElement: Element = Element.Fire;
    private _soundFootsteps: Sound.BaseSound;
    private _soundSwap: Sound.BaseSound;
    private _hitTimer: Time.TimerEvent;
    private readonly _hitTimerConfig: Types.Time.TimerEventConfig = {
        repeat: 3,
        startAt: 100,
        delay: 100,
        callback: this._onHit,
        callbackScope: this,
    };

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
        this._soundFootsteps = this.parentScene.sound.add(GameAudio.FOOTSTEPS, {
            rate: 1.5,
            volume: 0.3,
        });
        this._soundSwap = this.parentScene.sound.add(GameAudio.ELEMENT_SWITCH);

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

        this._player = parentScene.physics.add.sprite(
            100,
            450,
            GameSpritesheet.PLAYER
        );
        this._player.setSize(29, 32);
        this._player.setOffset(10, 10);
        this._player.setScale(1.3);
        this._player.setCollideWorldBounds(true);
        this._player.setImmovable(true);

        parentScene.physics.world.enableBody(this._player);

        this.earthballs = parentScene.physics.add.group({
            classType: Earthball,
            runChildUpdate: true,
        });
        this.waterballs = parentScene.physics.add.group({
            classType: Waterball,
            runChildUpdate: true,
        });
        this.fireballs = parentScene.physics.add.group({
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
    }

    public removeListeners(): void {
        this._keys.Down.removeAllListeners();
        this._keys.Up.removeAllListeners();
        this._keys.Left.removeAllListeners();
        this._keys.Right.removeAllListeners();
        this._keys.Space.removeAllListeners();
    }

    public onHit(): void {
        if (!this._hitTimer) {
            this._hitTimer = this.parentScene.time.addEvent(
                this._hitTimerConfig
            );
        } else {
            this._hitTimer.destroy();
            this._player.clearTint();
            this._hitTimer = this.parentScene.time.addEvent(
                this._hitTimerConfig
            );
        }
    }

    private _onHit(): void {
        if (!this._player.isTinted) {
            this._player.tint = Element.Fire;
        } else {
            this._player.clearTint();
        }
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
            if (!this._soundFootsteps.isPlaying) {
                this._soundFootsteps.play();
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
        const addAnimation = (key: string, offset: number) => {
            this.parentScene.anims.create({
                key,
                frames: this.parentScene.anims.generateFrameNumbers(
                    GameSpritesheet.PLAYER,
                    {
                        frames: [
                            // Frames are set up top -> down
                            // the offset picks the correct frame
                            offset + 4 * 0,
                            offset + 4 * 1,
                            offset + 4 * 2,
                            offset + 4 * 3,
                        ],
                    }
                ),
                frameRate: this._animationSpeed,
                repeat: -1,
            });
        };

        ['down', 'left', 'up', 'right'].forEach(addAnimation);

        this._player.anims.play('down');
        this._player.anims.pause();
    }

    private _addElementListeners(): void {
        this._keys.One.onDown = () => (this._currentElement = Element.Fire);
        this._keys.Two.onDown = () => (this._currentElement = Element.Water);
        this._keys.Three.onDown = () => (this._currentElement = Element.Earth);

        this._keys.Space.on('down', () => {
            this._soundSwap.play();
            switch (this._currentElement) {
                case Element.Fire:
                    this._currentElement = Element.Water;
                    break;
                case Element.Water:
                    this._currentElement = Element.Earth;
                    break;
                case Element.Earth:
                    this._currentElement = Element.Fire;
                    break;
            }
        });
    }

    private _addShootListeners(): void {
        this._keys.Down.on('down', () => {
            this._shootIntoDirection(Direction.Down);
        });
        this._keys.Up.on('down', () => {
            this._shootIntoDirection(Direction.Up);
        });
        this._keys.Left.on('down', () => {
            this._shootIntoDirection(Direction.Left);
        });
        this._keys.Right.on('down', () => {
            this._shootIntoDirection(Direction.Right);
        });
    }

    private _shootIntoDirection(direction: Direction): void {
        switch (this._currentElement) {
            case Element.Fire:
                this.fireballs
                    .get()
                    .setActive(true)
                    .setVisible(true)
                    .enableBody()
                    .shoot(this._player, direction);
                break;
            case Element.Water:
                this.waterballs
                    .get()
                    .setActive(true)
                    .setVisible(true)
                    .enableBody()
                    .shoot(this._player, direction);
                break;
            case Element.Earth:
                this.earthballs
                    .get()
                    .setActive(true)
                    .setVisible(true)
                    .enableBody()
                    .shoot(this._player, direction);
                break;
        }
    }
}
