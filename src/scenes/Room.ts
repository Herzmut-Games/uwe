import { Scene, GameObjects, Physics } from 'phaser';
import { Score } from '../objects/Score';
import { Player } from '../objects/Player';
import { Fireball } from '../objects/Fireball';
import { FireSpirit, WaterSpirit, EarthSpirit, Enemy } from '../objects/Enemy';

export class Room extends Scene {
    private _score: Score;
    private _player: Player;
    private _music: Phaser.Sound.BaseSound;
    private _firespirits: Phaser.Physics.Arcade.Group;
    private _waterspirits: Phaser.Physics.Arcade.Group;
    private _earthspirits: Phaser.Physics.Arcade.Group;

    constructor() {
        super({ key: 'Room' });
    }

    public preload() {
        this.load.image('background', 'assets/backgrounds/map.png');
        this.load.image('topbar', 'assets/backgrounds/topbar.png');
        this.load.spritesheet('player', 'assets/georg.png', {
            frameWidth: 48,
            frameHeight: 48,
        });
        this.load.audio('battle', 'assets/sounds/battle.mp3');
        this.load.audio(
            'element-switch',
            'assets/sounds/effects/sfx_wpn_dagger.wav'
        );
        this.load.audio(
            'footsteps',
            'assets/sounds/effects/sfx_movement_footstepsloop4_fast.wav'
        );
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

        const topbar = this.add.image(0, 0, 'topbar');
        topbar.setOrigin(0, 0).setDisplaySize(800, 112);

        this._score = new Score(this);
        this._player = new Player(this);
        this.physics.world.setBounds(0, 108, 800, 452);

        this._music = this.sound.add('battle', { volume: 0.5 });
        this._music.play();
        this._firespirits = this.physics.add.group({
            classType: FireSpirit,
            runChildUpdate: true,
        });
        this._waterspirits = this.physics.add.group({
            classType: WaterSpirit,
            runChildUpdate: true,
        });
        this._earthspirits = this.physics.add.group({
            classType: EarthSpirit,
            runChildUpdate: true,
        });

        this._earthspirits
            .get()
            .setActive(true)
            .setVisible(true)
            .spawn(this._player);
        this._waterspirits
            .get()
            .setActive(true)
            .setVisible(true)
            .spawn(this._player);
        this._firespirits
            .get()
            .setActive(true)
            .setVisible(true)
            .spawn(this._player);

        this.physics.add.collider(this._earthspirits, this._waterspirits);
        this.physics.add.collider(this._earthspirits, this._firespirits);
        this.physics.add.collider(this._waterspirits, this._firespirits);
        this.physics.add.collider(
            this._player.gameObject,
            [this._earthspirits, this._waterspirits, this._firespirits],
            (
                player: GameObjects.GameObject,
                spirit: GameObjects.GameObject
            ) => {
                spirit.destroy();
            },
            null,
            this
        );
    }

    public update(): void {
        this._score.update();
        this._player.update();
    }
}
