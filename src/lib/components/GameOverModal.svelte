<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		score: number;
		playlist: {
			nextSong: () => void;
		};
		showModal: boolean;
	}
	let { score = $bindable(), playlist, showModal = $bindable() }: Props = $props();
	import { highscore } from '../../globalState.svelte';
	let show = $state(false);
	let timer: string | number | NodeJS.Timeout | undefined;

	$effect(() => {
		if (!showModal) {
			clearTimeout(timer);
			return;
		}

		show = false;

		timer = setTimeout(() => {
			show = true;
		}, 3500);
	});

	const retry = () => {
		showModal = false;
		// right now the game is sudo reset by just going to the next song twice
		// might want to change this later to fully reset the playlist instead
        score = 0;
		playlist.nextSong();
		playlist.nextSong();
	};
</script>

{#if show}
	<div
		class="absolute z-50 flex size-full items-center justify-center bg-white/0 {!showModal
			? 'hidden'
			: ''}"
	>
		<div
			class="absolute z-50 flex h-96 w-80 flex-col items-center justify-center rounded-xl bg-white shadow-2xl"
		>
			<div class="absolute top-15 text-xl font-semibold">Game Over</div>

			<div class="flex flex-col items-center justify-center gap-2">
				<div class="">Highscore: {highscore.value}</div>
				<div class="">Score: {score}</div>
			</div>
			<button
				class="absolute bottom-20 rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 shadow-lg hover:cursor-pointer"
				onclick={retry}>Retry</button
			>
		</div>
	</div>
{/if}
