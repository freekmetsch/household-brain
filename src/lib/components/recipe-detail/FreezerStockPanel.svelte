<!--
	Freezer & stock panel: frozen-portion status, the keep-stocked staple toggle,
	and the target-portions stepper — one card, one PATCH endpoint
	(/api/recipes/[slug]). Parent applies the staple patch to its recipe state
	via onSaved (the payload mirrors the API body). The serve-from-freezer flow
	was removed 2026-07: serving is handled from the meal plan, and the button
	added noise without adding a workflow.
-->
<script lang="ts">
	import { base } from '$app/paths';
	import { untrack } from 'svelte';
	import Icon from '$lib/components/ui/icons/Icon.svelte';
	import { toast } from '$lib/stores/toast.svelte';
	import { m } from '$lib/paraglide/messages';
	import type { Recipe } from './types';

	let {
		recipe,
		frozenPortions,
		onSaved
	}: {
		recipe: Recipe;
		frozenPortions: number;
		onSaved: (payload: { is_freezer_staple?: boolean; target_portions?: number }) => void;
	} = $props();

	let stapleSaving = $state(false);
	let stapleError = $state('');
	let targetInput = $state(
		untrack(() => recipe.targetPortions ?? recipe.servings ?? 2)
	);

	let belowTarget = $derived(
		recipe.isFreezerStaple &&
			recipe.targetPortions != null &&
			frozenPortions < recipe.targetPortions
	);

	async function patchFreezer(payload: {
		is_freezer_staple?: boolean;
		target_portions?: number;
	}) {
		stapleSaving = true;
		stapleError = '';
		try {
			const res = await fetch(`${base}/api/recipes/${recipe.slug}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				stapleError = body.message ?? m.recipes_freezer_toast_save_failed({ status: res.status });
				toast.error(stapleError);
			} else {
				onSaved(payload);
			}
		} catch {
			stapleError = m.recipes_toast_connection_failed();
			toast.error(stapleError);
		}
		stapleSaving = false;
	}

	function sanitizedTarget(): number {
		return Number.isFinite(targetInput) && targetInput >= 1
			? Math.round(targetInput)
			: (recipe.servings ?? 2);
	}

	async function toggleFreezerStaple(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const on = input.checked;
		await patchFreezer(
			on
				? { is_freezer_staple: true, target_portions: sanitizedTarget() }
				: { is_freezer_staple: false }
		);
		// PATCH failed → snap the checkbox back to the authoritative state.
		if (stapleError) input.checked = recipe.isFreezerStaple;
	}

	function stepTarget(delta: number) {
		const next = Math.max(1, sanitizedTarget() + delta);
		if (next === recipe.targetPortions) return;
		targetInput = next;
		void patchFreezer({ target_portions: next });
	}
</script>

<section class="px-3 pt-3">
	<div class="rounded-2xl border border-base-200 bg-base-100 p-3 flex flex-col gap-2.5">
		<div class="flex items-center justify-between gap-3">
			<span
				class="inline-flex min-w-0 items-center gap-2 text-[13px] {belowTarget
					? 'text-warning'
					: 'text-base-content/70'}"
			>
				<Icon name="snowflake" class="h-4 w-4 shrink-0 {belowTarget ? 'text-warning' : 'text-base-content/40'}" />
				<span class="min-w-0 truncate">
					{#if recipe.isFreezerStaple && recipe.targetPortions}
						{m.recipes_freezer_portions_of_target({ frozen: frozenPortions, target: recipe.targetPortions })}{belowTarget
							? m.recipes_freezer_below_target_suffix()
							: ''}
					{:else}
						{frozenPortions === 1
							? m.recipes_freezer_portion_singular_in_freezer({ count: frozenPortions })
							: m.recipes_freezer_portions_plural_in_freezer({ count: frozenPortions })}
					{/if}
				</span>
			</span>
			<label class="flex items-center gap-2 py-1 min-h-8 cursor-pointer shrink-0">
				<span class="text-xs text-base-content/70">{m.recipes_freezer_keep_stocked_label()}</span>
				<input
					type="checkbox"
					class="toggle toggle-sm toggle-primary"
					checked={recipe.isFreezerStaple}
					disabled={stapleSaving}
					onchange={toggleFreezerStaple}
				/>
			</label>
		</div>
		{#if recipe.isFreezerStaple}
			<div class="flex items-center justify-between gap-3">
				<span class="text-xs text-base-content/70">{m.recipes_freezer_target_portions_label()}</span>
				<div class="flex items-center gap-1">
					<button
						type="button"
						class="btn btn-ghost btn-xs h-9 min-h-9 w-9 border border-base-300 p-0"
						aria-label="−1"
						disabled={stapleSaving || sanitizedTarget() <= 1}
						onclick={() => stepTarget(-1)}><Icon name="minus" class="h-3.5 w-3.5" /></button
					>
					<span class="w-8 text-center text-sm font-semibold tabular-nums">{sanitizedTarget()}</span>
					<button
						type="button"
						class="btn btn-ghost btn-xs h-9 min-h-9 w-9 border border-base-300 p-0"
						aria-label="+1"
						disabled={stapleSaving}
						onclick={() => stepTarget(1)}><Icon name="plus" class="h-3.5 w-3.5" /></button
					>
				</div>
			</div>
		{/if}
		{#if stapleError}
			<p class="text-[11px] text-error">{stapleError}</p>
		{/if}
	</div>
</section>
