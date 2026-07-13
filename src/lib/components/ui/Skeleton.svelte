<script lang="ts">
	// Pulse placeholder box. Caller sets width/height/rounding via `class`.
	// Reduced-motion safe. Converges the ad-hoc animate-pulse skeletons (AhSheet)
	// on one primitive. `tone` classes are enumerated (not interpolated) so the
	// Tailwind JIT always generates them.
	let {
		class: klass = '',
		tone = 'base-300'
	}: {
		class?: string;
		tone?: 'base-200' | 'base-300';
	} = $props();

	const toneClass = $derived(tone === 'base-200' ? 'bg-base-200' : 'bg-base-300');
</script>

<div class="animate-pulse motion-reduce:animate-none {toneClass} {klass}" aria-hidden="true"></div>
