<script lang="ts">
	import Reset from "$lib/components/icons/reset.svelte";
	import MinimalButton from "$lib/components/minimal-button.svelte";
	import { createEventDispatcher } from "svelte";

	export let id: string;
	export let label: string;
	export let value: number | undefined = undefined;
	export let description: string | undefined = undefined;

	const dispatch = createEventDispatcher<{ reset: undefined }>();
</script>

<div>
	<div class="mb-1 flex items-center justify-between text-sm">
		<label for={id}>
			{label}{#if value !== undefined}: <span class="font-mono tabular-nums opacity-50"
					>{value}</span
				>{/if}
		</label>
		<MinimalButton on:click={() => dispatch("reset")}>
			<Reset />
		</MinimalButton>
	</div>
	<div class="flex items-center gap-2">
		<slot />
	</div>
	{#if description}
		<span class="mt-2 block text-xs text-gray-400">{description}</span>
	{/if}
</div>
