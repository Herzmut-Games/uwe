import { Scene, GameObjects } from 'phaser';
import { Score } from '../objects/Score';
import { Player } from '../objects/Player';
import { Fireball } from '../objects/Fireball';

export class Room extends Scene {
    private _score: Score;
    private _player: Player;
    private _music: Phaser.Sound.BaseSound;
    private _firespirits: GameObjects.Group;
    private _waterspirits: GameObjects.Group;
    private _earthspirits: GameObjects.Group;

    constructor() {
        super({ key: 'Room' });
    }

    public preload() {
        this.load.image('background', 'assets/backgrounds/map.png');
        this.load.spritesheet('player', 'assets/georg.png', {
            frameWidth: 48,
            frameHeight: 48,
        });
        this.load.audio('battle', 'assets/sounds/battle.mp3');
        this.load.spritesheet('firespirit', 'assets/objects/firespirit.png', {
            frameWidth: 10,
            frameHeight: 26,
        });
        this.load.spritesheet('waterspirit', 'assets/objects/waterspirit.png', {
            frameWidth: 9,
            frameHeight: 24,
        });
        this.load.spritesheet('earthspirit', 'assets/objects/earthspirit.png', {
            frameWidth: 9,
            frameHeight: 25,
        });
        this.load.spritesheet('earthball', 'assets/objects/earthball.png', {
            frameWidth: 65,
            frameHeight: 9,
        });
        this.load.spritesheet('fireball', 'assets/objects/fireball.png', {
            frameWidth: 68,
            frameHeight: 9,
        });
        this.load.spritesheet('waterball', 'assets/objects/waterball.png', {
            frameWidth: 84,
            frameHeight: 9,
        });
    }

    public create() {
        const background = this.add.image(0, 88, 'background');
        background.setOrigin(0, 0).setDisplaySize(800, 512);

        this._score = new Score(this);
        this._player = new Player(this);
        this.physics.world.setBounds(0, 108, 800, 452);

        this._music = this.sound.add('battle');
        this._music.play();
        this._earthspirits = this.physics.add.group({
            classType: Fireball,
            runChildUpdate: true,
        });
        this._waterspirits = this.physics.add.group({
            classType: Fireball,
            runChildUpdate: true,
        });
        this._firespirits = this.physics.add.group({
            classType: Fireball,
            runChildUpdate: true,
        });
    }

    public update(): void {
        this._score.update();
        this._player.update();
    }
}
