export const EnemyTypes = {
    WATER: 'waterspirit',
    EARTH: 'earthspirit',
    FIRE: 'firespirit',
} as const;
export type EnemyType = EnumValue<typeof EnemyTypes>;
