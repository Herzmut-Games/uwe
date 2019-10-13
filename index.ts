import { screenWidth, screenHeight } from './src/config';
import { Game, Types } from 'phaser';
import { Start } from './src/scenes/Start';
import { Room } from './src/scenes/Room';
import { Death } from './src/scenes/Death';
import { Intro } from './src/scenes/Intro';

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
    scene: [Intro, Start, Death, Room],
    render: {
        pixelArt: true,
    },
};

const game = new Game(config);
