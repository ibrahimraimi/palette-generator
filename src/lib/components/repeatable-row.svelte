<script lang="ts">
	import Trash from "$lib/components/icons/trash.svelte";
	import MinimalButton from "$lib/components/minimal-button.svelte";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher<{ delete: undefined }>();

	export let label: string;
	export let isDeletable = true;
</script>

<div class="mt-3">
	<div class="mb-1 flex items-center justify-between text-sm">
		<p>{label}</p>
		{#if isDeletable}
			<MinimalButton on:click={() => dispatch("delete")}>
				<Trash class="text-pink-500" />
			</MinimalButton>
		{/if}
	</div>
	<div class="flex items-center gap-2">
		<slot />
	</div>
</div>
