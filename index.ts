import { screenWidth, screenHeight } from './src/configs/Screen';
import { Game, Types } from 'phaser';
import { Menu } from './src/scenes/menu/Menu';
import { Room } from './src/scenes/room/Room';
import { Death } from './src/scenes/Death';
import { Intro } from './src/scenes/Intro';
import { Help } from './src/scenes/Help';
import { About } from './src/scenes/menu/About';
import { Selection } from './src/scenes/menu/Selection';
import { TopBar } from './src/scenes/room/TopBar';
import { CountDown } from './src/scenes/room/CountDown';

export const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: screenWidth,
    height: screenHeight,
    parent: document.getElementById('game'),
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
        },
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

const game = new Game(config);
