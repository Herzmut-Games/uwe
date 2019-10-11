import { screenWidth, screenHeight } from './src/config';
import { Game, Types } from 'phaser';
import { StartScene } from './src/StartScene';
import { TestScene } from './src/TestScene';

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
    scene: [StartScene, TestScene],
};

const game = new Game(config);
