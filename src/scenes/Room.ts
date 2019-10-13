import { Scene, GameObjects, Physics } from 'phaser';
import { Score } from '../objects/Score';
import { Player, Element } from '../objects/Player';
import { Fireball } from '../objects/Fireball';
import {
    FireSpirit,
    WaterSpirit,
    EarthSpirit,
    Enemy,
    EnemyType,
} from '../objects/Enemy';
import { BallType, Ball } from '../objects/Ball';
import { EnemyController } from '../objects/EnemyController';
import { Healthbar } from '../objects/Healthbar';
import { WeaponStatus } from '../objects/WeaponStatus';
import { fonts } from '../objects/Fonts';
import { colors } from '../objects/Colors';

export class Room extends Scene {
    private _score: Score;
    private _player: Player;
    private _healthbar: Healthbar;
    private _weaponStatus: WeaponStatus;
    private _music: Phaser.Sound.BaseSound;
    private _enemyController: EnemyController;
    private _firespirits: Phaser.Physics.Arcade.Group;
    private _waterspirits: Phaser.Physics.Arcade.Group;
    private _earthspirits: Phaser.Physics.Arcade.Group;
    private _countdownText: GameObjects.Text;
    private _countdownPost: GameObjects.Text;
    private _countdownPre: GameObjects.Text;
    private _countdownTexts: string[] = [
        'und ab',
        'eins',
        'zwei',
        'drei',
        'vier',
    ];
    private _currentCountdown: number = 4;

    constructor() {
        super({ key: 'Room' });
    }

    public preload() {
        this.load.image('background', 'assets/backgrounds/map.png');
        this.load.image('topbar', 'assets/backgrounds/topbar.png');
        this.load.image('fullHeart', 'assets/heart.png');
        this.load.image('halfHeart', 'assets/heart_half.png');
        this.load.spritesheet('player', 'assets/uwe.png', {
            frameWidth: 48,
            frameHeight: 48,
        });
        this.load.audio('battle-intro', 'assets/sounds/battle_intro.mp3');
        this.load.audio('battle-main', 'assets/sounds/battle_main.mp3');
        this.load.audio(
            'enemy-death',
            'assets/sounds/effects/sfx_deathscream_alien4.wav'
        );
        this.load.audio(
            'player-impact',
            'assets/sounds/effects/sfx_deathscream_human12.wav'
        );
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
        this.load.spritesheet('earthstatus', 'assets/objects/earthstatus.png', {
            frameWidth: 13,
            frameHeight: 40,
        });
        this.load.spritesheet('firestatus', 'assets/objects/firestatus.png', {
            frameWidth: 14,
            frameHeight: 45,
        });
        this.load.spritesheet('waterstatus', 'assets/objects/waterstatus.png', {
            frameWidth: 14,
            frameHeight: 41,
        });
    }

    public create() {
        const background = this.add.image(0, 88, 'background');
        background.setOrigin(0, 0).setDisplaySize(800, 512);

        const topbar = this.add.image(0, 0, 'topbar');
        topbar.setOrigin(0, 0).setDisplaySize(800, 112);

        this._score = new Score(this);
        this._player = new Player(this);
        this._healthbar = new Healthbar(this);
        this._weaponStatus = new WeaponStatus(this);

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

        this._enemyController = new EnemyController(this, this._player, [
            this._earthspirits,
            this._firespirits,
            this._waterspirits,
        ]);

        this.physics.add.overlap(
            this._player.gameObject,
            [this._waterspirits, this._firespirits, this._earthspirits],
            (_: GameObjects.GameObject, spirit: Enemy) => {
                spirit.kill();
                this._healthbar.ouch();
                this.cameras.main.shake(100, 0.01);
                this.sound.add('player-impact', { volume: 2 }).play();
            }
        );

        this.physics.add.collider(
            [this._waterspirits, this._firespirits, this._earthspirits],
            [this._waterspirits, this._firespirits, this._earthspirits]
        );

        this.physics.add.overlap(
            [this._waterspirits, this._firespirits, this._earthspirits],
            [
                this._player.earthballs,
                this._player.fireballs,
                this._player.waterballs,
            ],
            (spirit: Enemy, ball: Ball) => {
                const ballType: BallType = ball.getData('type');
                ball.fadeOut();

                if (spirit.hit(ballType)) {
                    this._score.add(100);
                }
            }
        );

        this.physics.world.setBounds(0, 108, 800, 452);

        this._music = this.sound.add('battle-intro', { volume: 0.5 });
        this._music.play();
        this._music.once('complete', () => {
            this._music = this.sound.add('battle-main', {
                volume: 0.5,
                loop: true,
            });
            this._music.play();
        });

        this._displayStartCountdown();
    }

    public update(): void {
        this._score.update();
        this._player.update();
        this._weaponStatus.update(this._player.element);
        this._checkGameEnd();
    }

    private _checkGameEnd(): void {
        if (this._healthbar.health <= 0) {
            this._music.stop();
            this.scene.stop();
            this.scene.start('Death', { score: this._score.score });
            this._player.removeShootListeners();
        }
    }

    private _displayStartCountdown(): void {
        this._countdownPre = this.add
            .text(400, 250, 'Mach dich ma fertich', {
                fill: colors.white,
                fontSize: 30,
                fontFamily: fonts.primary,
            })
            .setOrigin(0.5, 0.5);
        this._countdownText = this.add
            .text(400, 300, this._countdownTexts[this._currentCountdown], {
                fill: colors.white,
                fontSize: 68,
                fontFamily: fonts.primary,
            })
            .setOrigin(0.5, 0.5);
        this._countdownPost = this.add
            .text(400, 350, 'geht gleich los', {
                fill: colors.white,
                fontSize: 30,
                fontFamily: fonts.primary,
            })
            .setOrigin(0.5, 0.5);

        this._countDown();
    }

    private _countDown(): void {
        this._currentCountdown -= 1;
        if (this._currentCountdown >= 0) {
            this._countdownText.setText(
                this._countdownTexts[this._currentCountdown]
            );
            this.time.delayedCall(1000, this._countDown, [], this);
        } else {
            this._countdownText.destroy();
            this._countdownPost.destroy();
            this._countdownPre.destroy();
            this._currentCountdown = 4;
        }
    }
}
