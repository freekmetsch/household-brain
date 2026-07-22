export function batchServingTarget(
	recipeServings: number | null,
	multiplier: number
): number | null {
	if (
		recipeServings == null ||
		!Number.isInteger(recipeServings) ||
		recipeServings < 1 ||
		!Number.isInteger(multiplier) ||
		multiplier < 1
	) {
		return null;
	}

	const target = recipeServings * multiplier;
	return target <= 99 ? target : null;
}
