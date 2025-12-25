<script lang="ts">
	import { onMount } from 'svelte';
	import { highscore } from '../../globalState.svelte';
	import { MusicCard } from '$lib/components/MusicCard';
	import PopularityPlain from '$lib/components/MusicCard/PopularityPlain.svelte';
	import { Playlist } from './Playlist.svelte';
	import PopularityGuessable from '$lib/components/MusicCard/PopularityGuessable.svelte';
	import VolumeSlider from '$lib/components/VolumeSlider.svelte';

	const { data } = $props();

	const songs = $derived(data.songs); // Extract the songs array

	const playlist = $derived(new Playlist(songs));
	onMount(() => {
		playlist.load();
	});
	let volume = $state(0.3);

	let score = $state(0);

	const incrementScore = () => {
		score++;
		highscore.updateScore(score);
	};

	const resetScore = () => {
		score = 0;
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

<div class="m-6 flex items-center justify-center gap-4 text-2xl font-semibold relative">
	<span>
		{score}
	</span>
	<div class="right-0 absolute">
		<VolumeSlider bind:volume />
	</div>
</div>
<main
	class="relative flex flex-col items-center justify-center gap-10 overflow-x-hidden overscroll-none pt-0 pb-8 sm:flex-row sm:p-20 sm:pt-0"
>
	{#if !playlist.loading}
		{#if playlist.previews[0]}
			<div data-card1={slideCards}>
				<MusicCard preview={playlist.previews[0]} {volume}>
					<PopularityPlain popularity={playlist.previews[0].popularity} />
				</MusicCard>
			</div>
		{/if}

		<span class="-z-10 w-10 text-center text-2xl font-bold">vs</span>

		{#if playlist.previews[1]}
			<div data-card2={slideCards} class="relative">
				<MusicCard preview={playlist.previews[1]} {volume}>
					{#key playlist.previews[1]}
						<PopularityGuessable
							disabled={slideCards}
							oncorrect={incrementScore}
							onguessed={onGuess}
							thisPopularity={playlist.previews[1].popularity}
							otherPopularity={playlist.previews[0].popularity}
							onincorrect={resetScore}
						/>
					{/key}
				</MusicCard>

				{#if playlist.previews[2]}
					<div
						data-card3={slideCards}
						aria-hidden="true"
						class="absolute hidden translate-x-[50vw] -translate-y-full sm:block"
					>
						<MusicCard preview={playlist.previews[2]} {volume}>
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

<style>
	@media (min-width: 640px) {
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
	}
</style>
