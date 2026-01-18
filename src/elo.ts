/**
 * Core ELO calculation logic for FAB Regional ELO System.
 */

export interface EloConfig {
    kFactor: number;
}

export const DEFAULT_ELO_CONFIG: EloConfig = {
    kFactor: 32, // Standard K-factor
};

/**
 * Calculates the expected score for player A.
 */
export function calculateExpectedScore(ratingA: number, ratingB: number): number {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

/**
 * Calculates the rating change for a player.
 */
export function calculateRatingChange(
    currentRating: number,
    expectedScore: number,
    actualScore: number, // 1 for win, 0.5 for draw, 0 for loss
    config: EloConfig = DEFAULT_ELO_CONFIG
): number {
    return config.kFactor * (actualScore - expectedScore);
}

/**
 * Updates ratings for two players after a match.
 * @returns [newRatingA, newRatingB, changeMagnitude]
 */
export function updateRatings(
    ratingA: number,
    ratingB: number,
    scoreA: number, // 1 for win, 0.5 for draw, 0 for loss
    config: EloConfig = DEFAULT_ELO_CONFIG
): [number, number, number] {
    const expectedA = calculateExpectedScore(ratingA, ratingB);
    const change = calculateRatingChange(ratingA, expectedA, scoreA, config);

    return [
        ratingA + change,
        ratingB - change,
        change
    ];
}
