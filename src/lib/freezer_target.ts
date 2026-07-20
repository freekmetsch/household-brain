export type FreezerTargetState = {
	isFreezerStaple: boolean;
	targetPortions: number | null;
};

export function freezerTargetPayload(keepStocked: boolean, targetPortions: number) {
	return {
		is_freezer_staple: keepStocked,
		target_portions: keepStocked ? Math.max(1, Math.min(99, Math.round(targetPortions))) : null
	};
}

export function parseFreezerTargetResponse(value: unknown): FreezerTargetState | null {
	if (!value || typeof value !== 'object') return null;
	const candidate = value as Record<string, unknown>;
	if (typeof candidate.isFreezerStaple !== 'boolean') return null;
	if (candidate.targetPortions !== null && typeof candidate.targetPortions !== 'number') return null;
	return {
		isFreezerStaple: candidate.isFreezerStaple,
		targetPortions: candidate.targetPortions as number | null
	};
}
