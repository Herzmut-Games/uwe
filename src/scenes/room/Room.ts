import { Scene, Physics, Sound } from 'phaser';
import { Enemy } from '../../objects/sprites/Enemy/Enemy';
import { WaterSpirit } from '../../objects/sprites/Enemy/WaterSpirit';
import { EarthSpirit } from '../../objects/sprites/Enemy/EarthSpirit';
import { FireSpirit } from '../../objects/sprites/Enemy/FireSpirit';
import { Ball } from '../../objects/sprites/Ball/Ball';
import { EnemyController } from '../../objects/EnemyController';
import { GameAudio, GameImage } from '../../configs/Resources';
import { TopBar } from './TopBar';
import { TopBarEvent } from './TopBar.event';
import { CountDown } from './CountDown';
import { CountDownEvent } from './CountDown.event';
import { Player } from '../../objects/sprites/Player/Player';
import { PlayerEvent } from '../../objects/sprites/Player/Player.event';
import { RoomEvent } from './Room.event';
import { Scenes } from '../../configs/Scenes';

export class Room extends Scene {
    private _player!: Player;
    private _enemyController!: EnemyController;
    private _firespirits!: Physics.Arcade.Group;
    private _waterspirits!: Physics.Arcade.Group;
    private _earthspirits!: Physics.Arcade.Group;
    private _soundPlayerImpact!: Sound.BaseSound;
    private _soundBattleIntro!: Sound.BaseSound;
    private _soundBattleMain!: Sound.BaseSound;
    private _topBarScene!: TopBar;
    private _countDownScene!: CountDown;

    constructor() {
        super({ key: Scenes.Room });
    }

    public create() {
        this.add
            .image(0, 88, GameImage.ROOM_BACKGROUND)
            .setOrigin(0, 0)
            .setDisplaySize(800, 512);

        this.physics.world.setBounds(10, 131, 780, 429);

        this.scene.launch(Scenes.TopBar);
        this._topBarScene = this.scene.get(Scenes.TopBar) as TopBar;

        this._topBarScene.events.on(TopBarEvent.NoHealth, (score: number) =>
            this._endGame(score)
        );

        this._player = new Player(this);
        this._player.on(PlayerEvent.ChangeElement, (element: Element) =>
            this.events.emit(RoomEvent.WeaponSwitch, element)
        );

        this._setupSpirits();
        this._setupSounds();
        this._setupCollision();

        this._startCountdown();
    }

    public update(): void {
        this._player.update();
    }

    private _startCountdown() {
        this.scene.launch(Scenes.CountDown);
        this._countDownScene = this.scene.get(Scenes.CountDown) as CountDown;
        this._countDownScene.events.once(CountDownEvent.Done, () =>
            this._spawnEnemies()
        );
    }

    private _setupCollision() {
        this.physics.add.overlap(
            this._player,
            [this._waterspirits, this._firespirits, this._earthspirits],
            (_, _spirit) => {
                const spirit = _spirit as Enemy;

                spirit.kill();
                this.events.emit(RoomEvent.Damage);
                this._player.onHit();
                this.cameras.main.shake(100, 0.01);
                this._soundPlayerImpact.play();
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
            (_spirit, _ball) => {
                const spirit = _spirit as Enemy;
                const ball = _ball as Ball;
                ball.fadeOut();
                if (spirit.onHit(ball)) {
                    this.events.emit(RoomEvent.Kill);
                }
            }
        );
    }

    private _setupSounds() {
        this._soundPlayerImpact = this.sound.add(GameAudio.PLAYER_IMPACT);
        this._soundBattleIntro = this.sound.add(GameAudio.BATTLE_INTRO, {
            volume: 0.5,
        });
        this._soundBattleMain = this.sound.add(GameAudio.BATTLE_MAIN, {
            volume: 0.5,
            loop: true,
        });
        this._soundBattleIntro.play();
        this._soundBattleIntro.once('complete', () => {
            this._soundBattleMain.play();
        });
    }

    private _setupSpirits() {
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
    }

    private _spawnEnemies(): void {
        this._enemyController = new EnemyController(this, this._player, [
            this._earthspirits,
            this._firespirits,
            this._waterspirits,
        ]);
    }

    private _endGame(score: number): void {
        this._soundBattleMain.stop();
        this.scene.stop();
        this.scene.stop(Scenes.TopBar);
        this.scene.start(Scenes.Death, { score });
        this._topBarScene.cleanup();
        this._player.cleanup();
        this.events.removeListener(RoomEvent.Damage);
        this.events.removeListener(RoomEvent.Kill);
        this.events.removeListener(RoomEvent.WeaponSwitch);
    }
}
