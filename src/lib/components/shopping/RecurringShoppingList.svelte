<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	type Recurring = {
		id: number; revision: number; name: string; amount: string | null; unit: string | null;
		entryId: number | null; entryRevision: number | null; included: boolean; bought: boolean;
	};
	type Props = {
		items: Recurring[];
		onAdd: (input: { name: string; amount: string | null; unit: string | null }) => void;
		onEdit: (item: Recurring, input: { name: string; amount: string | null; unit: string | null }) => void;
		onSkip: (item: Recurring) => void;
		onDisable: (item: Recurring) => void;
	};
	let { items, onAdd, onEdit, onSkip, onDisable }: Props = $props();
	let name = $state('');
	let amount = $state('');
	let unit = $state('');
	let editingId = $state<number | null>(null);
	let editName = $state('');
	let editAmount = $state('');
	let editUnit = $state('');

	function startEdit(item: Recurring) {
		editingId = item.id;
		editName = item.name;
		editAmount = item.amount ?? '';
		editUnit = item.unit ?? '';
	}
</script>

<form class="ui-list-card mb-3 grid grid-cols-[1fr_5.5rem_4.5rem] gap-2 p-3" onsubmit={(event) => { event.preventDefault(); if (!name.trim()) return; onAdd({ name, amount: amount || null, unit: unit || null }); name = ''; amount = ''; unit = ''; }}>
	<h2 class="col-span-3 text-sm font-semibold">{m.shopping_recurring_add()}</h2>
	<input class="input input-sm min-w-0" required maxlength="256" placeholder={m.shopping_recurring_name()} bind:value={name} />
	<input class="input input-sm min-w-0" maxlength="64" placeholder={m.shopping_recurring_amount()} bind:value={amount} />
	<input class="input input-sm min-w-0" maxlength="64" placeholder={m.shopping_recurring_unit()} bind:value={unit} />
	<button class="btn btn-primary btn-sm col-span-3" type="submit">{m.shopping_recurring_add()}</button>
</form>

{#if items.length}
	<ul class="ui-list-card divide-y divide-base-200">
		{#each items as item (item.id)}
			<li class="p-3">
				{#if editingId === item.id}
					<form class="grid grid-cols-[1fr_5.5rem_4.5rem] gap-2" onsubmit={(event) => { event.preventDefault(); onEdit(item, { name: editName, amount: editAmount || null, unit: editUnit || null }); editingId = null; }}>
						<input class="input input-sm min-w-0" required bind:value={editName} />
						<input class="input input-sm min-w-0" bind:value={editAmount} />
						<input class="input input-sm min-w-0" bind:value={editUnit} />
						<button class="btn btn-primary btn-sm col-span-2" type="submit">{m.shopping_save_choice()}</button>
						<button class="btn btn-ghost btn-sm" type="button" onclick={() => (editingId = null)}>{m.shopping_cancel_button()}</button>
					</form>
				{:else}
					<div class="flex items-start justify-between gap-3">
						<div><p class="text-sm font-semibold">{item.name}</p>{#if item.amount || item.unit}<p class="text-xs text-base-content/60">{[item.amount, item.unit].filter(Boolean).join(' ')}</p>{/if}</div>
						<div class="dropdown dropdown-end">
							<button type="button" tabindex="0" class="btn btn-ghost btn-sm" aria-label={m.shopping_source_change()}>•••</button>
							<ul class="dropdown-content menu z-20 w-56 rounded-box bg-base-100 p-2 shadow">
								<li><button type="button" onclick={() => onSkip(item)} disabled={!item.entryId || !item.included}>{m.shopping_recurring_skip()}</button></li>
								<li><button type="button" onclick={() => startEdit(item)}>{m.shopping_recurring_edit()}</button></li>
								<li><button type="button" class="text-error" onclick={() => onDisable(item)}>{m.shopping_recurring_disable()}</button></li>
							</ul>
						</div>
					</div>
				{/if}
			</li>
		{/each}
	</ul>
{:else}
	<p class="py-8 text-center text-sm text-base-content/60">{m.shopping_recurring_empty()}</p>
{/if}
