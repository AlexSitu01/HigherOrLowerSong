<script lang="ts">
	import { onMount } from 'svelte';
	import { highscore } from '../../globalState.svelte';
	import { MusicCard } from '$lib/components/MusicCard';
	import PopularityPlain from '$lib/components/MusicCard/PopularityPlain.svelte';
	import { Playlist } from './Playlist.svelte';
	import PopularityGuessable from '$lib/components/MusicCard/PopularityGuessable.svelte';

	const { data } = $props();

	const songs = $derived(data.songs); // Extract the songs array

	const playlist = $derived(new Playlist(songs));
	onMount(() => {
		playlist.load();
	});

	let score = $state(0);
	const incrementScore = () => {
		score++;
		highscore.updateScore(score);
	};

	let slideCards = $state(false);
	const onGuess = async () => {
		await new Promise((r) => setTimeout(r, 2500));
		slideCards = true;

		await new Promise((r) => setTimeout(r, 1500));
		slideCards = false;
		playlist.nextSong();
	};
</script>

<main
	class="relative flex flex-col items-center justify-center gap-10 overscroll-none p-8 sm:flex-row sm:p-20"
>
	{#if !playlist.loading}
		{#if playlist.previews[0]}
			<div data-card1={slideCards}>
				<MusicCard preview={playlist.previews[0]}>
					<PopularityPlain popularity={playlist.previews[0].popularity} />
				</MusicCard>
			</div>
		{/if}

		<span class="w-10 text-center text-2xl font-bold">vs</span>

		{#if playlist.previews[1]}
			<div data-card2={slideCards} class="relative">
				<MusicCard preview={playlist.previews[1]}>
					{#key playlist.previews[1]}
						<PopularityGuessable
							disabled={slideCards}
							oncorrect={incrementScore}
							onguessed={onGuess}
							thisPopularity={playlist.previews[1].popularity}
							otherPopularity={playlist.previews[1].popularity}
						/>
					{/key}
				</MusicCard>

				{#if playlist.previews[2]}
					<div
						data-card3={slideCards}
						aria-hidden="true"
						class="absolute translate-x-[50vw] -translate-y-full"
					>
						<MusicCard preview={playlist.previews[2]}>
							{#key playlist.previews[2]}
								<PopularityGuessable
									disabled
									thisPopularity={playlist.previews[2].popularity}
									otherPopularity={playlist.previews[2].popularity}
								/>
							{/key}
						</MusicCard>
					</div>
				{/if}
			</div>
		{/if}
	{/if}
</main>
<button onclick={() => playlist.nextSong()} class="cursor-pointer rounded-2xl border-2 p-2"
	>Next Song</button
>
<button onclick={() => (slideCards = !slideCards)} class="cursor-pointer rounded-2xl border-2 p-2"
	>Toggle Anim</button
>

<style>
	div[data-card1='true'] {
		animation: card1 1.5s ease-out forwards;
	}

	div[data-card2='true'] {
		animation: card2 1.5s ease-in-out forwards;
	}

	div[data-card3='true'] {
		animation: card3 1.5s ease-in-out forwards;
	}

	@keyframes card1 {
		to {
			translate: -50vw;
		}
	}

	@keyframes card2 {
		to {
			translate: calc(-31.5rem + -4px);
		}
	}

	@keyframes card3 {
		to {
			transform: translateX(calc(-50vw + 31.5rem + 4px));
		}
	}
</style>
