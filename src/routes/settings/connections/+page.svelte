<script lang="ts">
	import { base } from '$app/paths';
	import { invalidateAll } from '$app/navigation';
	import SettingsPanelHeader from '$lib/components/settings/SettingsPanelHeader.svelte';
	import PendingButton from '$lib/components/ui/PendingButton.svelte';
	import { m } from '$lib/paraglide/messages';
	import { toast } from '$lib/stores/toast.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function connectionChip(connected: boolean): string {
		return connected ? 'ui-chip-active' : 'ui-chip-muted';
	}

	let ahPayload = $state('');
	let ahSaving = $state(false);
	let ahError = $state('');
	let ahShowForm = $state(false);

	function toggleAhForm() {
		ahShowForm = !ahShowForm;
		if (!ahShowForm) {
			ahError = '';
			ahPayload = '';
		}
	}

	async function connectAh() {
		const payload = ahPayload.trim();
		if (!payload) return;
		ahSaving = true;
		ahError = '';
		try {
			const res = await fetch(`${base}/api/settings/ah`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ payload })
			});
			const body = await res.json();
			if (!res.ok || !body.ok) {
				ahError = body.reason ?? m.settings_connections_connect_failed();
				toast.error(ahError);
			} else {
				toast.success(
					body.memberName
						? m.settings_connections_connected_as_toast({ name: body.memberName })
						: m.settings_connections_connected_toast()
				);
				ahPayload = '';
				ahShowForm = false;
				await invalidateAll();
			}
		} catch {
			ahError = m.settingsshell_toast_connection_error();
			toast.error(ahError);
		} finally {
			ahSaving = false;
		}
	}
</script>

<svelte:head>
	<title>{m.settings_connections_title()}</title>
</svelte:head>

<div class="ui-page-shell px-4 pt-4">
	<SettingsPanelHeader title={m.settingsshell_panel_connections()} />

	<section class="ui-form-card">
		<div class="mb-3 flex items-center justify-between gap-3">
			<h2 class="ui-section-label">{m.settings_connections_ah_heading()}</h2>
			<div class="flex flex-wrap justify-end gap-1.5" role="status" aria-live="polite">
				<span class={connectionChip(data.ah.connected)}>{data.ah.connected ? m.settings_connections_status_connected() : m.settings_connections_status_off()}</span>
			</div>
		</div>

		<div class="flex flex-col gap-4">
			<div>
				<div class="mb-1 flex items-center justify-between gap-2">
					<h3 class="text-sm font-semibold">{m.settings_connections_ah_heading()}</h3>
					{#if data.ah.connected && data.ah.memberName}
						<span class="text-xs text-base-content/50">{data.ah.memberName}</span>
					{/if}
				</div>
				<p class="text-xs text-base-content/50">
					{data.ah.connected
						? m.settings_connections_ah_connected_desc()
						: m.settings_connections_ah_disconnected_desc()}
				</p>
				{#if data.ah.connected}
					<button type="button" class="btn btn-xs btn-ghost mt-2 px-0 text-base-content/60" onclick={toggleAhForm}>
						{ahShowForm ? m.settings_connections_cancel_button() : m.settings_connections_reconnect_button()}
					</button>
				{:else}
					<button type="button" class="btn btn-sm btn-primary mt-2" onclick={toggleAhForm}>
						{ahShowForm ? m.settings_connections_cancel_button() : m.settings_connections_connect_button()}
					</button>
				{/if}
			</div>

			{#if ahShowForm}
				<div class="flex flex-col gap-3 border-t border-base-300 pt-3">
					<p class="text-xs text-base-content/50">
						{m.settings_connections_connect_intro()}
					</p>
					<details open class="text-xs">
						<summary class="cursor-pointer font-medium text-base-content/50 select-none">
							{m.settings_connections_how_to_connect()}
						</summary>
						<div class="mt-2 flex flex-col gap-2">
							<label class="ui-field-label" for="ah-payload">{m.settings_connections_token_label()}</label>
							<p class="text-xs text-base-content/50">
								{m.settings_connections_token_instructions_a()} <code class="font-mono">python scripts/ah_local_login.py</code>
								{m.settings_connections_token_instructions_b()}
							</p>
							<textarea
								id="ah-payload"
								class="textarea textarea-bordered textarea-sm font-mono text-xs"
								rows="3"
								placeholder={'{"access_token": "...", "refresh_token": "..."}'}
								bind:value={ahPayload}
							></textarea>
							<PendingButton
								class="btn btn-sm btn-primary self-start"
								onclick={connectAh}
								pending={ahSaving}
								disabled={!ahPayload.trim()}
							>
								{ahSaving ? m.settings_connections_checking_label() : m.settings_connections_connect_ah_button()}
							</PendingButton>
							{#if ahError}
								<p class="text-sm text-error" role="alert">{ahError}</p>
							{/if}
						</div>
					</details>
				</div>
			{/if}
		</div>
	</section>
</div>
