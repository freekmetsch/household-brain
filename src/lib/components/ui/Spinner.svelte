<script lang="ts">
	// Shared loading spinner. Wraps daisyUI's `loading loading-spinner` so the
	// inline copies scattered across the app converge on one accessible primitive.
	// daisyUI emits every `loading-<size>` class from the plugin, so the dynamic
	// size class below is safe from Tailwind's JIT purge.
	let {
		size = 'sm',
		class: klass = '',
		label = 'Loading'
	}: {
		/** daisyUI loading size. */
		size?: 'xs' | 'sm' | 'md' | 'lg';
		class?: string;
		/** Screen-reader status text (visually hidden by daisyUI's loading class). */
		label?: string;
	} = $props();
</script>

<span class="loading loading-spinner loading-{size} {klass}" role="status" aria-label={label}></span>
