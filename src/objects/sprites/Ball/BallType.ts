export const BallTypes = {
    FIRE: 'fireball',
    EARTH: 'earthball',
    WATER: 'waterball',
} as const;

export type BallType = EnumValue<typeof BallTypes>;
