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

    public create() {
        const background = this.add.image(0, 88, 'background');
        background.setOrigin(0, 0).setDisplaySize(800, 512);

        this.add
            .graphics()
            .fillStyle(0x3b3332, 1)
            .fillRect(0, 0, 800, 112);

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
                this._player.onHit();
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

        this.physics.world.setBounds(10, 131, 780, 429);

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
        if (!this._checkGameEnd()) {
            this._enemyController.update();
        }
    }

    private _checkGameEnd(): boolean {
        if (this._healthbar.health <= 0) {
            this._music.stop();
            this.scene.stop();
            this.scene.start('Death', { score: this._score.score });
            this._player.removeListeners();
            return true;
        }
        return false;
    }

    private _displayStartCountdown(): void {
        this._countdownText = this.add
            .text(400, 300, this._countdownTexts[this._currentCountdown], {
                fill: colors.white,
                fontSize: 68,
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
            this._currentCountdown = 4;
        }
    }
}
