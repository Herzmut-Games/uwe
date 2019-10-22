import { Game, Types } from 'phaser';
import { screenWidth, screenHeight } from './configs/Screen';
import { Intro } from './scenes/Intro';
import { About } from './scenes/menu/About';
import { Menu } from './scenes/menu/Menu';
import { Death } from './scenes/Death';
import { TopBar } from './scenes/room/TopBar';
import { CountDown } from './scenes/room/CountDown';
import { Room } from './scenes/room/Room';
import { Help } from './scenes/Help';
import { Selection } from './scenes/menu/Selection';

const parent: string = 'game';

export class UweGame extends Game {
    constructor() {
        const config: Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: screenWidth,
            height: screenHeight,
            parent,
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false,
                },
            },
            fps: {
                min: 40,
                target: 40,
            },
            scene: [
                Intro,
                About,
                Selection,
                Menu,
                Death,
                TopBar,
                CountDown,
                Room,
                Help,
            ],
            render: {
                pixelArt: true,
            },
            audio: {
                disableWebAudio: true,
            },
        };

        super(config);
    }
}
