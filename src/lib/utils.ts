import chroma from "chroma-js";
import type { OKLCH } from "./types";
import { twMerge } from "tailwind-merge";
import { cubicOut } from "svelte/easing";
import { type ClassValue, clsx } from "clsx";
import type { TransitionConfig } from "svelte/transition";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === "none" ? "" : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, "");
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

export function resizeNumberArray(arr: number[], newSize: number) {
	const originalSize = arr.length;
	const step = (originalSize - 1) / (newSize - 1);

	return Array.from({ length: newSize }, (_, index) => {
		const leftIndex = Math.floor(index * step);
		const rightIndex = Math.ceil(index * step);
		const weight = index * step - leftIndex;

		if (leftIndex === rightIndex) {
			return arr[leftIndex];
		} else {
			return (1 - weight) * arr[leftIndex] + weight * arr[rightIndex];
		}
	});
}

// function that finds the closest number in an array of numbers
export function findClosestNumber(arr: number[], target: number) {
	return arr.reduce((prev, curr) => {
		return Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev;
	});
}

type PaletteJSON = Record<
	string,
	Record<
		string,
		{
			name: string;
			description: string;
			value: string;
			type: string;
		}
	>
>;

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export function paletteToJSON(name: string, palette: OKLCH[]): { [key: string]: PaletteJSON } {
	return {
		[capitalize(name)]: palette.reduce((obj, [l, c, h], i) => {
			const name = i + 1;
			const value = chroma.oklch(l, c, h).hex();
			const description = "";
			const type = "color";

			return {
				...obj,
				[name]: {
					name,
					description,
					value,
					type
				}
			};
		}, {})
	};
}

export function downloadFile(data: string, fileName = "palette.json") {
	const blob = new Blob([data], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = fileName;
	a.click();
	URL.revokeObjectURL(url);
}
