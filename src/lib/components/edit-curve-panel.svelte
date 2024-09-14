<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import EditCurveInput from "./edit-curve-input.svelte";
	import Pencil from "./icons/pencil.svelte";
	import Plus from "./icons/plus.svelte";
	import Trash from "./icons/trash.svelte";
	import MinimalButton from "./minimal-button.svelte";

	const dispatch = createEventDispatcher<{ create: undefined; delete: number }>();

	export let curve: number[];
</script>

<div class="text-white bg-black border shadow-lg rounded-xl border-white/10">
	<div class="flex items-center justify-between p-3 border-b border-white/10">
		<h3 class="flex items-center gap-1 text-sm">
			<Pencil class="opacity-50" width="15px" height="15px" />
			Edit Curve
		</h3>

		<MinimalButton
			on:click={() => {
				dispatch("create");
			}}
		>
			<Plus />
		</MinimalButton>
	</div>

	<div class="flex items-center w-full gap-2 p-3 overflow-auto">
		{#each curve as _, i}
			<div class="flex flex-col items-center w-6 gap-2">
				<input
					class="w-[22px] appearance-none rounded-sm bg-transparent p-0 text-center text-[10px] tabular-nums outline-none ring-white/20 transition-all focus:ring-2"
					bind:value={curve[i]}
				/>
				<EditCurveInput bind:value={curve[i]} />
				<MinimalButton
					disabled={curve.length <= 4}
					on:click={() => {
						dispatch("delete", i);
					}}
				>
					<Trash />
				</MinimalButton>
			</div>
		{/each}
	</div>
</div>
