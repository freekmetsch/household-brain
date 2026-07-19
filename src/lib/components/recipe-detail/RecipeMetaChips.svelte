<!--
	Meta strip: the recipe's basic facts only — servings, time, rating,
	cuisine/category — as one quiet icon-led row. Tags and notes are deliberately
	NOT here (tags ride at the page bottom, notes get their own bottom section):
	the top of the page belongs to orientation, not metadata noise.
	Renders nothing when the recipe has no basic facts at all.
-->
<script lang="ts">
	import Icon from '$lib/components/ui/icons/Icon.svelte';
	import { m } from '$lib/paraglide/messages';
	import type { Recipe } from './types';

	let {
		recipe,
		displayCategory,
		displayCuisine
	}: {
		recipe: Recipe;
		displayCategory: string | null;
		displayCuisine: string | null;
	} = $props();

	function stars(rating: number): string {
		return `${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}`;
	}
</script>

{#if recipe.servings || recipe.totalTimeMin || recipe.rating || displayCuisine || displayCategory}
	<section
		class="mx-3 mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-xl border border-base-200 bg-base-100 px-3 py-2.5 text-[13px] text-base-content/75"
	>
		{#if recipe.servings}
			<span class="inline-flex items-center gap-1.5">
				<Icon name="cutlery" class="h-3.5 w-3.5 text-base-content/45" />
				{m.recipes_meta_servings({ count: recipe.servings })}
			</span>
		{/if}
		{#if recipe.totalTimeMin}
			<span class="inline-flex items-center gap-1.5">
				<Icon name="clock" class="h-3.5 w-3.5 text-base-content/45" />
				{recipe.totalTimeMin} min
			</span>
		{/if}
		{#if displayCuisine ?? displayCategory}
			<span class="inline-flex items-center gap-1.5">
				<Icon name="chefHat" class="h-3.5 w-3.5 text-base-content/45" />
				{displayCuisine ?? displayCategory}
			</span>
		{/if}
		{#if recipe.rating}
			<span class="text-warning tracking-tight" aria-label={`${recipe.rating}/5`}
				>{stars(recipe.rating)}</span
			>
		{/if}
	</section>
{/if}
