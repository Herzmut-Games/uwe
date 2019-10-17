import { Scene, Physics, Sound } from 'phaser';
import {
    FireSpirit,
    WaterSpirit,
    EarthSpirit,
    Enemy,
} from '../../objects/sprites/Enemy';
import { BallType, Ball } from '../../objects/sprites/Ball';
import { EnemyController } from '../../objects/EnemyController';
import { GameAudio, GameImage } from '../../configs/Resources';
import { Death } from '../Death';
import { TopBar, TopBarEvent } from './TopBar';
import { CountDown } from './CountDown';
import { Player, PlayerEvent } from '../../objects/sprites/Player';

export enum RoomEvent {
    Damage = 'room_dmg',
    Kill = 'room_kill',
    WeaponSwitch = 'room_switch',
}

export class Room extends Scene {
    private _player: Player;
    private _enemyController: EnemyController;
    private _firespirits: Physics.Arcade.Group;
    private _waterspirits: Physics.Arcade.Group;
    private _earthspirits: Physics.Arcade.Group;
    private _soundPlayerImpact: Sound.BaseSound;
    private _soundBattleIntro: Sound.BaseSound;
    private _soundBattleMain: Sound.BaseSound;
    private _topBarScene: TopBar;
    private _countDownScene: CountDown;

    constructor() {
        super({ key: Room.name });
    }

    public create() {
        const background = this.add.image(0, 88, GameImage.ROOM_BACKGROUND);
        background.setOrigin(0, 0).setDisplaySize(800, 512);
        this.physics.world.setBounds(10, 131, 780, 429);

        this.scene.launch(TopBar.name);
        this._topBarScene = this.scene.get(TopBar.name) as TopBar;

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
        this._enemyController.update();
    }

    private _startCountdown() {
        this.scene.launch(CountDown.name);
        this._countDownScene = this.scene.get(CountDown.name) as CountDown;
    }

    private _setupCollision() {
        this.physics.add.overlap(
            this._player,
            [this._waterspirits, this._firespirits, this._earthspirits],
            (_: Player, spirit: Enemy) => {
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
            (spirit: Enemy, ball: Ball) => {
                const ballType: BallType = ball.getData('type');
                ball.fadeOut();
                if (spirit.hit(ballType)) {
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

        this._enemyController = new EnemyController(this, this._player, [
            this._earthspirits,
            this._firespirits,
            this._waterspirits,
        ]);
    }

    private _endGame(score: number): void {
        this._soundBattleMain.stop();
        this.scene.stop();
        this.scene.stop(TopBar.name);
        this.scene.start(Death.name, { score });
        this._topBarScene.cleanup();
        this._player.cleanup();
        this.events.removeListener(RoomEvent.Damage);
        this.events.removeListener(RoomEvent.Kill);
        this.events.removeListener(RoomEvent.WeaponSwitch);
    }
}