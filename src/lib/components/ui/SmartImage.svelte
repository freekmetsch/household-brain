<script lang="ts">
	import type { HTMLImgAttributes } from 'svelte/elements';
	import Skeleton from './Skeleton.svelte';

	// <img> that fades in over a skeleton once loaded, avoiding pop-in / reflow.
	// The caller sizes + rounds the box via `class` (applied to the wrapper, which
	// clips via overflow-hidden); the inner img fills it with the chosen `fit`.
	let {
		src,
		alt,
		class: klass = '',
		fit = 'cover',
		loading = 'lazy',
		...rest
	}: {
		src: string;
		alt: string;
		class?: string;
		/** object-fit of the inner image. */
		fit?: 'cover' | 'contain';
		loading?: 'lazy' | 'eager';
	} & HTMLImgAttributes = $props();

	let loaded = $state(false);
	const fitClass = $derived(fit === 'contain' ? 'object-contain' : 'object-cover');
</script>

<span class="relative block overflow-hidden {klass}">
	{#if !loaded}
		<Skeleton class="absolute inset-0 h-full w-full" />
	{/if}
	<img
		{...rest}
		{src}
		{alt}
		{loading}
		class="h-full w-full {fitClass} transition-opacity duration-300 motion-reduce:transition-none {loaded
			? 'opacity-100'
			: 'opacity-0'}"
		onload={() => (loaded = true)}
	/>
</span>
