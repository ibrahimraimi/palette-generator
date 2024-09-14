<script lang="ts">
	import { createSlider } from "@melt-ui/svelte";
	import { writable } from "svelte/store";

	export let value: number;

	const store = writable([value]);
	store.subscribe((val) => {
		value = val[0];
	});
	$: store.set([value]);

	const {
		elements: { root, range, thumb }
	} = createSlider({
		value: store,
		min: 0,
		max: 1,
		step: 0.01,
		orientation: "vertical"
	});
</script>

<div class="group flex w-6 justify-center">
	<span {...$root} use:root class="relative flex h-[100px] w-1 flex-col items-center">
		<span class="block h-[100px] w-full rounded-sm bg-white/10">
			<span {...$range} use:range class="w-full rounded-sm bg-white" />
		</span>
		<span
			{...$thumb()}
			use:thumb
			class="block h-2 w-2 rounded-full border-2 border-white bg-white shadow-md outline-none transition-[height,width] focus:ring-4 focus:ring-white/30 group-hover:h-3 group-hover:w-3"
		/>
	</span>
</div>
