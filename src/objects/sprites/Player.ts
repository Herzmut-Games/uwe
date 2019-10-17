import { Scene, Physics, Input, Types, Sound, Time } from 'phaser';
import { Fireball } from './Fireball';
import { Waterball } from './Waterball';
import { Earthball } from './Earthball';
import { GameSpritesheet, GameAudio } from '../../configs/Resources';
import { hexColors } from '../../configs/Colors';

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

export enum PlayerEvent {
    ChangeElement = 'player_change_element',
}

export class Player extends Physics.Arcade.Sprite {
    get bodyX(): number {
        return this.x + this.displayWidth / 2;
    }
    get bodyY(): number {
        return this.y + this.displayHeight / 2;
    }

    public fireballs: Physics.Arcade.Group;
    public waterballs: Physics.Arcade.Group;
    public earthballs: Physics.Arcade.Group;

    private _isMoving: boolean = false;
    private _currentElement: Element = Element.Fire;
    private _hitTimer: Time.TimerEvent;

    private readonly _speed = 6;
    private readonly _diagonalSpeed = this._speed / 1.5;
    private readonly _animationSpeed = 15;
    private readonly _keys: ControlKeys;
    private readonly _soundFootsteps: Sound.BaseSound;
    private readonly _soundSwap: Sound.BaseSound;
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

    constructor(private readonly _parentScene: Scene) {
        super(_parentScene, 100, 450, GameSpritesheet.PLAYER);
        _parentScene.add.existing(this);

        const cursorKeys = this._parentScene.input.keyboard.createCursorKeys();
        this._soundFootsteps = this._parentScene.sound.add(
            GameAudio.FOOTSTEPS,
            {
                rate: 1.5,
                volume: 0.3,
            }
        );
        this._soundSwap = this._parentScene.sound.add(GameAudio.ELEMENT_SWITCH);

        this._keys = {
            One: this._parentScene.input.keyboard.addKey('ONE'),
            Two: this._parentScene.input.keyboard.addKey('TWO'),
            Three: this._parentScene.input.keyboard.addKey('THREE'),
            W: this._parentScene.input.keyboard.addKey('W'),
            A: this._parentScene.input.keyboard.addKey('A'),
            S: this._parentScene.input.keyboard.addKey('S'),
            D: this._parentScene.input.keyboard.addKey('D'),
            Up: cursorKeys.up,
            Left: cursorKeys.left,
            Right: cursorKeys.right,
            Down: cursorKeys.down,
            Space: cursorKeys.space,
        };

        _parentScene.physics.world.enableBody(this);
        this.setSize(29, 32);
        this.setOffset(10, 10);
        this.setScale(1.3);
        this.setCollideWorldBounds(true);
        this.setImmovable(true);

        this.earthballs = _parentScene.physics.add.group({
            classType: Earthball,
            runChildUpdate: true,
        });
        this.waterballs = _parentScene.physics.add.group({
            classType: Waterball,
            runChildUpdate: true,
        });
        this.fireballs = _parentScene.physics.add.group({
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

    public cleanup(): void {
        this._keys.Down.removeListener('down');
        this._keys.Up.removeListener('down');
        this._keys.Left.removeListener('down');
        this._keys.Right.removeListener('down');
        this._keys.Space.removeListener('down');
        this.removeListener(PlayerEvent.ChangeElement);
    }

    public onHit(): void {
        if (!this._hitTimer) {
            this._hitTimer = this._parentScene.time.addEvent(
                this._hitTimerConfig
            );
        } else {
            this._hitTimer.destroy();
            this.clearTint();
            this._hitTimer = this._parentScene.time.addEvent(
                this._hitTimerConfig
            );
        }
    }

    private _onHit(): void {
        if (!this.isTinted) {
            this.tint = hexColors.red;
        } else {
            this.clearTint();
        }
    }

    private _animate(): void {
        switch (true) {
            case this._keys.Up.isDown:
                this.anims.play('up', true);
                break;
            case this._keys.Down.isDown:
                this.anims.play('down', true);
                break;
            case this._keys.Left.isDown:
                this.anims.play('left', true);
                break;
            case this._keys.Right.isDown:
                this.anims.play('right', true);
                break;
        }

        this.anims.resume();
        this.anims.pause();

        if (this._isMoving) {
            if (!this._soundFootsteps.isPlaying) {
                this._soundFootsteps.play();
            }
            this.anims.resume();
        }
    }

    private _move(): void {
        if (this.movementDirection !== Direction.None) {
            switch (this.movementDirection) {
                case Direction.Up:
                    this.y -= this._speed;
                    break;
                case Direction.Down:
                    this.y += this._speed;
                    break;
                case Direction.Left:
                    this.x -= this._speed;
                    break;
                case Direction.Right:
                    this.x += this._speed;
                    break;
                case Direction.UpRight:
                    this.y -= this._diagonalSpeed;
                    this.x += this._diagonalSpeed;
                    break;
                case Direction.UpLeft:
                    this.y -= this._diagonalSpeed;
                    this.x -= this._diagonalSpeed;
                    break;
                case Direction.DownRight:
                    this.y += this._diagonalSpeed;
                    this.x += this._diagonalSpeed;
                    break;
                case Direction.DownLeft:
                    this.y += this._diagonalSpeed;
                    this.x -= this._diagonalSpeed;
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
            this._parentScene.anims.create({
                key,
                frames: this._parentScene.anims.generateFrameNumbers(
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

        this.anims.play('down');
        this.anims.pause();
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
            this.emit(PlayerEvent.ChangeElement, this._currentElement);
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
                    .shoot(this, direction);
                break;
            case Element.Water:
                this.waterballs
                    .get()
                    .setActive(true)
                    .setVisible(true)
                    .enableBody()
                    .shoot(this, direction);
                break;
            case Element.Earth:
                this.earthballs
                    .get()
                    .setActive(true)
                    .setVisible(true)
                    .enableBody()
                    .shoot(this, direction);
                break;
        }
    }
}
