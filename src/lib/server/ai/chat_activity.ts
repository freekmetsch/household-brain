// The app is one Node process, so an in-memory counter is enough to distinguish
// a genuinely orphaned final user row from a reply that is still streaming in
// another tab. The safety timeout prevents a crashed stream from latching the
// user in an "active" state forever.
const activeTurns = new Map<number, number>();
const ACTIVE_TURN_TIMEOUT_MS = 5 * 60 * 1000;

export function beginChatTurn(userId: number): () => void {
	activeTurns.set(userId, (activeTurns.get(userId) ?? 0) + 1);
	let ended = false;
	const timeout = setTimeout(end, ACTIVE_TURN_TIMEOUT_MS);

	function end(): void {
		if (ended) return;
		ended = true;
		clearTimeout(timeout);
		const remaining = (activeTurns.get(userId) ?? 1) - 1;
		if (remaining > 0) activeTurns.set(userId, remaining);
		else activeTurns.delete(userId);
	}

	return end;
}

export function isChatTurnActive(userId: number): boolean {
	return (activeTurns.get(userId) ?? 0) > 0;
}
