import { screenWidth, screenHeight } from './src/config';
import { Game, Types } from 'phaser';
import { Start } from './src/scenes/Start';
import { Room } from './src/scenes/Room';
import { Death } from './src/scenes/Death';

export const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: screenWidth,
    height: screenHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
        },
    },
    scene: [Start, Death, Room],
};

const game = new Game(config);
