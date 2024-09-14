<script lang="ts">
	import chroma from "chroma-js";
	import { createEventDispatcher } from "svelte";

	import { cn, downloadFile, paletteToJSON } from "$lib/utils";
	import { getC, getH, getL, getOklch } from "$lib/color";
	import { copyToClipboard } from "$lib/clipboard";
	import { paletteToSvg } from "$lib/svg";

	import SmallButton from "$lib/components/small-button.svelte";
	import Copy from "$lib/components/icons/copy.svelte";
	import Trash from "$lib/components/icons/trash.svelte";
	import Download from "$lib/components/icons/download.svelte";
	import type { OKLCH } from "$lib/types";

	const dispatch = createEventDispatcher<{ delete: string }>();

	export let color: string;
	export let palette: OKLCH[];
	export let colorIndex: number;

	$: oklch = chroma(color).oklch();
</script>

<div class="border-b bg-white lg:rounded-lg lg:border lg:shadow-sm">
	<div class="flex items-center justify-between p-2 pb-0 lg:p-3 lg:pb-0">
		<div class="flex items-center gap-2">
			<div
				class="h-6 w-6 rounded-md border border-black/10"
				style="background-color: {getOklch(...oklch)};"
			/>
			<SmallButton
				class="hidden sm:inline-flex"
				on:click={() => {
					copyToClipboard(color, { id: color });
				}}
			>
				<Copy class="opacity-50" width="16px" height="16px" />
				{color}
			</SmallButton>

			<SmallButton
				class="hidden lg:inline-flex"
				on:click={() => {
					copyToClipboard(getOklch(...oklch), { id: `${color}-oklch` });
				}}
			>
				<Copy class="opacity-50" width="16px" height="16px" />
				{getOklch(...oklch)}
			</SmallButton>
		</div>
		<div class="flex items-center gap-2">
			<SmallButton
				class="hidden lg:inline-flex"
				on:click={() => {
					if (palette) {
						downloadFile(
							JSON.stringify(paletteToJSON(`${color} Palette`, palette), null, 2),
							`${color}.json`
						);
					}
				}}
			>
				<Download class="opacity-50" width="16px" height="16px" />
				Download JSON
			</SmallButton>
			<SmallButton
				class="hidden lg:inline-flex"
				on:click={() => {
					if (palette) {
						copyToClipboard(paletteToSvg(palette), { id: `${color}-svg` });
					}
				}}
			>
				<Copy class="opacity-50" width="16px" height="16px" />
				Copy SVG
			</SmallButton>
			<SmallButton
				on:click={() => {
					dispatch("delete", color);
				}}
			>
				<Trash class="opacity-50" width="16px" height="16px" />
				Delete
			</SmallButton>
		</div>
	</div>
	<div class={cn("mt-2 flex overflow-auto p-2 pt-1", "lg:p-3 lg:pt-2")}>
		{#each palette as [l, c, h], i}
			<button
				on:click={() => {
					copyToClipboard(chroma.oklch(l, c, h).hex(), { id: `${color}-hex-${i}` });
				}}
				class={cn(
					"group flex-1 border border-r-0 bg-[--square-color] outline-none transition-all last:border-r lg:border-0",
					i === 0 && "rounded-l-md",
					i === palette.length - 1 && "rounded-r-md",
					colorIndex === i && "scale-105 rounded-md border shadow-lg lg:border",
					l >= 0.6
						? "border-black/10 text-black/50 hover:text-black focus-visible:text-black"
						: "border-white/10 text-white/50 hover:text-white focus-visible:text-white",
					"h-24 lg:h-32"
				)}
				style="--square-color: {getOklch(l, c, h)}"
			>
				<div
					class="flex h-full flex-col items-start justify-between gap-0.5 p-3 text-left text-[10px] leading-tight"
				>
					<div class="flex w-full items-center justify-between">
						<span class="tabular-nums">{i + 1}</span>
						<Copy class="opacity-0 transition-all group-hover:opacity-100" />
					</div>
					<div
						class="flex flex-col gap-0.5 pr-2 font-mono opacity-0 transition-all group-hover:opacity-100"
					>
						<span>L{getL(l)}</span>
						<span>C{getC(c)}</span>
						<span>H{getH(h)}</span>
					</div>
				</div>
			</button>
		{/each}
	</div>
</div>
