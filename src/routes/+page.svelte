<script lang="ts">
	import chroma from "chroma-js";
	import { Drawer } from "vaul-svelte";
	import { slide } from "svelte/transition";

	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { browser } from "$app/environment";

	import { DEFAULT } from "$lib/constants";
	import { generatePalette } from "$lib/color";
	import { cn } from "$lib/utils";

	import Input from "$lib/components/input.svelte";
	import Button from "$lib/components/button.svelte";
	import SlidersHorizontal from "$lib/components/icons/sliders-horizontal.svelte";
	import Crosshair from "$lib/components/icons/crosshair.svelte";
	import PaletteIcon from "$lib/components/icons/palette.svelte";
	import ConfigurationField from "$lib/components/configuration-field.svelte";
	import Palette from "$lib/components/palette.svelte";
	import Plus from "$lib/components/icons/plus.svelte";
	import SmallButton from "$lib/components/small-button.svelte";
	import RepeatableRow from "$lib/components/repeatable-row.svelte";
	import Pencil from "$lib/components/icons/pencil.svelte";
	import Curve from "$lib/components/curve.svelte";
	import EditCurvePanel from "$lib/components/edit-curve-panel.svelte";
	import MinimalButton from "$lib/components/minimal-button.svelte";
	import Reset from "$lib/components/icons/reset.svelte";
	import Select from "$lib/components/select.svelte";
	import { parseColor, parser, serializer } from "$lib/params";
	import Eye from "$lib/components/icons/eye.svelte";
	import EyeClosed from "$lib/components/icons/eye-closed.svelte";

	import bear from "$lib/assets/girl.png";

	const config = parser($page.url.searchParams);

	let color = "";
	let invalid = false;

	let colors = config.colors;

	let scales = config.scales;
	let chromaStepType = config.chromaStepType;
	let chromaStep = config.chromaStep;
	let chromaMinimum = config.chromaMinimum;
	let overrides = config.overrides;
	let curve = config.curve;

	$: if (browser) {
		const params = serializer({
			colors,
			scales,
			chromaStep,
			chromaMinimum,
			overrides,
			curve
		});

		goto(`?${params}`, { replaceState: true, keepFocus: true });
	}

	let mobileColorsPanel = false;
</script>

<main class="mx-auto flex h-screen gap-2">
	<div
		class={cn(
			"flex flex-col gap-2 overflow-auto bg-white shadow-sm",
			"lg:m-2 lg:mr-0 lg:w-80 lg:border",
			"pb-10 lg:pb-0" // account for the colors panel at the bottom in mobile
		)}
	>
		<header class="border-b px-4 py-2">
			<h1 class="flex items-center gap-1 text-sm">Palette generator</h1>
		</header>

		<form
			class="flex-1 px-4 py-2"
			on:submit={(e) => {
				e.preventDefault();

				if (!color) return;

				if (!chroma.valid(color)) {
					invalid = true;
					return;
				}

				// assign variables
				invalid = false;
				colors = [color, ...parseColor($page.url.searchParams)];
				color = "";
				mobileColorsPanel = true;
			}}
		>
			<div>
				<label for="color" class="mb-1 block text-sm">Base color</label>
				<Input
					autocomplete="off"
					on:focus={() => (invalid = false)}
					class={cn(invalid && " border-pink-300")}
					id="color"
					bind:value={color}
					placeholder="Type your color"
				/>
				{#if invalid}
					<span class="text-xs text-pink-500">Invalid color</span>
				{/if}
			</div>
			<Button class="mt-2 w-full" type="submit">Create palette</Button>
			<span class="mt-2 block text-xs text-gray-400"
				>Type a valid color in any format to generate a monochromatic palette. It will range from
				dark to light with the saturation decreasing as it moves away from the base color.</span
			>
		</form>

		<div class="border-t p-4">
			<h3 class="mb-3 flex items-center gap-1 text-sm text-gray-500">
				<SlidersHorizontal width="15px" height="15px" />
				Configuration
			</h3>
			<div transition:slide>
				<div class="flex flex-col gap-3">
					<ConfigurationField
						id="scales"
						label="Scales"
						description="The amount of scales to generate"
						value={scales}
						on:reset={() => {
							scales = DEFAULT.scales;
						}}
					>
						<Input id="scales" type="number" bind:value={scales} step={1} min={8} max={20} />
					</ConfigurationField>

					<ConfigurationField
						id="chroma-step"
						label="Saturation step"
						description="The amount of saturation that reduces as we go further from the base color"
						value={chromaStep}
						on:reset={() => {
							chromaStep = DEFAULT.chromaStep;
						}}
					>
						<Select class="flex-1" bind:value={chromaStepType}>
							<option value="value">Value</option>
							<option value="percentage">Percentage</option>
						</Select>
						<Input
							class="flex-1"
							type="number"
							bind:value={chromaStep}
							step={0.001}
							min={0}
							max={1}
						/>
					</ConfigurationField>

					<ConfigurationField
						id="chroma-min"
						label="Minimum saturation"
						description="The minimum amount of saturation allowed. The base color's saturation will be used instead if
          it's below this value."
						value={chromaMinimum}
						on:reset={() => {
							chromaMinimum = DEFAULT.chromaMinimum;
						}}
					>
						<Input
							id="chroma-min"
							type="number"
							bind:value={chromaMinimum}
							step={0.001}
							min={0}
							max={0.1}
						/>
					</ConfigurationField>
				</div>
			</div>
		</div>

		<!-- Curve -->
		<div class="border-t p-4">
			<div class="flex items-center justify-between">
				<h3 class="flex items-center gap-1 text-sm text-gray-500">
					<Pencil width="15px" height="15px" />
					Curve
				</h3>
				<MinimalButton
					aria-label="Reset curve"
					on:click={() => {
						curve = [...DEFAULT.curve];
					}}
				>
					<Reset />
				</MinimalButton>
			</div>

			<div class="mt-3">
				<Curve {curve}>
					<EditCurvePanel
						bind:curve
						on:create={() => {
							curve = [...curve, curve[curve.length - 1] ?? 1];
						}}
						on:delete={(event) => {
							curve = curve.filter((_, index) => index !== event.detail);
						}}
					/>
				</Curve>
			</div>

			<span class="mt-4 block text-xs text-gray-400"
				>You can create your own lightness curve. The numbers between steps will be interpolated
				linearly. A shift will be applied to make sure your base color remains unchanged.</span
			>
		</div>

		<!-- Overrides -->
		<div class="border-t p-4">
			<div class="flex items-center justify-between">
				<h3 class="flex items-center gap-1 text-sm text-gray-500">
					<Crosshair width="15px" height="15px" />
					Overrides
				</h3>
				<SmallButton
					aria-label="Add override"
					on:click={() => {
						overrides = [...overrides, {}];
					}}
				>
					<Plus />
				</SmallButton>
			</div>

			{#each overrides as override, i}
				<RepeatableRow
					label="Override {i + 1}"
					on:delete={() => {
						overrides = overrides.filter((_, index) => index !== i);
					}}
				>
					<Input type="number" placeholder="Scale" bind:value={override.scale} min={0} max={99} />
					<Input
						type="number"
						placeholder="C"
						bind:value={override.chroma}
						step={0.001}
						min={0}
						max={0.37}
					/>
					<Input
						type="number"
						placeholder="L"
						bind:value={override.lightness}
						step={0.01}
						min={0}
						max={1}
					/>
				</RepeatableRow>
			{/each}

			<span class="mt-4 block text-xs text-gray-400"
				>You can add chroma and lightness overrides to specific scales. It will never affect the
				base color. If the chroma override is greater than the original, it will not be applied.</span
			>
		</div>
	</div>

	<div
		class={cn(
			"flex-1 lg:overflow-auto",
			"fixed top-[100dvh-theme(space.6)] z-40 h-full w-full bg-white",
			"lg:static lg:top-auto lg:w-auto lg:bg-transparent",
			"transition-all",
			mobileColorsPanel ? "top-0 bg-black/10" : "top-[calc(100dvh-theme(space.10))] bg-black/0"
		)}
	>
		<button
			on:click={() => {
				mobileColorsPanel = !mobileColorsPanel;
			}}
			class={cn(
				"block h-10 w-full border bg-white px-4 py-2 transition-all lg:hidden",
				mobileColorsPanel ? "mt-4" : "mt-0",
				"shadow-[0_-1px_2px_rgba(0,0,0,0.04),0_-2px_4px_rgba(0,0,0,0.02)]"
			)}
		>
			<h1 class="flex items-center justify-between gap-1 text-sm">
				Palettes
				{#if mobileColorsPanel}
					<EyeClosed />
				{:else}
					<Eye />
				{/if}
			</h1>
		</button>
		<div
			class={cn(
				"flex flex-col lg:gap-2 lg:p-2 lg:pl-0",
				"h-[calc(100dvh-theme(space.10)-theme(space.4))] overflow-auto bg-white",
				"lg:h-full lg:overflow-visible lg:bg-transparent"
			)}
		>
			{#each colors as c}
				{@const { base, palette } = generatePalette(
					c,
					parser(
						serializer({
							scales,
							chromaStepType,
							chromaStep,
							chromaMinimum,
							overrides,
							curve
						})
					)
				)}
				<Palette
					color={c}
					{palette}
					colorIndex={base.index}
					on:delete={(event) => {
						colors = colors.filter((c) => c !== event.detail);
					}}
				/>
			{:else}
				<div class="flex items-center justify-center w-full h-full">
					<div class="flex flex-col items-center text-center">
						<p class="text-gray-500">Start creating palette</p>
					</div>
				</div>
			{/each}
			<div class="flex flex-1 items-end justify-end gap-1 p-1 text-xs">
				<a
					class="transition-opacity hover:opacity-80"
					href="https://twitter.com/metro_0x"
					target="_blank"
					rel="noopener noreferrer">Built by Metro</a
				>
				<!-- <span class="opacity-20"> / </span>
				<a
					class="transition-opacity hover:opacity-80"
					target="_blank"
					rel="noopener noreferrer"
					href="https://github.com/ibrahimraimi/coco-palette">Source on Github</a
				> -->
			</div>
		</div>
	</div>
</main>
