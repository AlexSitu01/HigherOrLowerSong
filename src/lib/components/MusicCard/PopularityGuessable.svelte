<script lang="ts">
	import { fade } from 'svelte/transition';
	import NumberFlow from '@number-flow/svelte';
	import { tick } from 'svelte';

	interface Props {
		thisPopularity: number;
		otherPopularity: number;
		disabled?: boolean;
		onguessed?: () => void;
		oncorrect?: () => void;
		onincorrect?: () => void;
	}

	const { thisPopularity, otherPopularity, disabled, onguessed, oncorrect, onincorrect }: Props =
		$props();

	let didGuess = $state(false);

	let correct: boolean | undefined = $state(undefined);

	let popularityView = $state(0);

	async function guessPopularity(guess: 'high' | 'low') {
		didGuess = true;
		onguessed?.();

		await tick();

		popularityView = thisPopularity;

		if (guess === 'high') {
			correct = thisPopularity >= otherPopularity;
			if (correct) {
				oncorrect?.();
			} else {
				onincorrect?.();
			}
		} else {
			correct = thisPopularity <= otherPopularity;
			if (correct) {
				oncorrect?.();
			} else {
				onincorrect?.();
			}
		}

		setTimeout(() => {
			correct = undefined;
		}, 3000);
	}
</script>

<div class="flex flex-col items-center justify-center rounded-2xl border-2 p-3 shadow-sm">
	<span class="uppercase">Popularity</span>

	<div class="relative flex h-10 items-center justify-center self-stretch">
		{#if !didGuess}
			<div transition:fade={{ duration: 200 }} class="absolute flex text-4xl font-semibold">
				<button
					{disabled}
					onclick={() => guessPopularity('high')}
					class="cursor-pointer px-2 hover:underline hover:drop-shadow-xs">HI</button
				>
				<div class="mx-2 mt-1 w-px items-stretch bg-gray-500"></div>
				<button
					{disabled}
					onclick={() => guessPopularity('low')}
					class="cursor-pointer px-2 hover:underline hover:drop-shadow-xs">LO</button
				>
			</div>
		{:else}
			<div
				id="popularityView"
				data-correct={correct}
				transition:fade={{ delay: 200, duration: 500 }}
				class="absolute text-4xl font-semibold"
			>
				<NumberFlow
					value={popularityView}
					suffix="%"
					spinTiming={{
						delay: 200,
						duration: 1000,
						easing: 'ease-out'
					}}
					class="transition-colors duration-500"
				/>
			</div>
		{/if}
	</div>
</div>

<style>
	#popularityView[data-correct='true'] {
		color: green;
		transition-delay: 1750ms;
	}

	#popularityView[data-correct='false'] {
		color: red;
		transition-delay: 1750ms;
	}
</style>
