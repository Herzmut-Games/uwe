import { Scene, GameObjects, Physics, Sound } from 'phaser';
import { Player, PlayerEvent, Element } from '../../objects/Player';
import {
    FireSpirit,
    WaterSpirit,
    EarthSpirit,
    Enemy,
} from '../../objects/Enemy';
import { BallType, Ball } from '../../objects/Ball';
import { EnemyController } from '../../objects/EnemyController';
import { fonts } from '../../objects/Fonts';
import { colors } from '../../objects/Colors';
import { GameAudio, GameImage } from '../../configs/Resources';
import { Death } from '../Death';
import { TopBar, TopBarEvent } from './TopBar';

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
    private _countdownText: GameObjects.Text;
    private _countdownTexts: string[] = [
        'und ab',
        'eins',
        'zwei',
        'drei',
        'vier',
    ];
    private _currentCountdown: number = 4;
    private _soundPlayerImpact: Sound.BaseSound;
    private _soundBattleIntro: Sound.BaseSound;
    private _soundBattleMain: Sound.BaseSound;
    private _topBarScene: TopBar;

    constructor() {
        super({ key: Room.name });
    }

    public create() {
        console.log('Create Room', Room.name);
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
        this._displayStartCountdown();
    }

    public update(): void {
        this._player.update();
        this._enemyController.update();
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
