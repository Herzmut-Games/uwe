import { TestScene } from './src/TestScene';
import { screenWidth, screenHeight } from './src/config';
import { Game, Types } from 'phaser';

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
    scene: [TestScene],
};

const game = new Game(config);
