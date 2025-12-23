<script lang="ts">
	import { onMount } from 'svelte';
	import { highscore } from '../../globalState.svelte';
	import { Preview } from './Preview.svelte.js';
	import AudioPlayer from '$lib/components/AudioPlayer.svelte';

	const { data } = $props();
	const songs = data.songs; // Extract the songs array
	let preview: Preview | null = $state(null);

	let score = $state(0);

	const incrementScore = () => {
		score++;
	};

	$effect(() => {
		preview = new Preview(songs);
	});
</script>

<div class="flex flex-col items-center justify-center gap-y-4">
	<div class="justify-self-center">{score}</div>
	<div>{highscore.value}</div>

	<button class="cursor-pointer rounded-2xl border-2 px-3 py-2" onclick={incrementScore}>
		test
	</button>

	<button
		class="cursor-pointer rounded-2xl border-2 px-3 py-2"
		onclick={() => {
			highscore.updateScore(score);
		}}
	>
		update Highscore
	</button>

	<button
		class="cursor-pointer rounded-2xl border-2 px-3 py-2"
		onclick={() => preview?.nextSong()}
	>
		Get Next song
	</button>


	{#if preview?.firstSong}
		<AudioPlayer src={preview.firstSong?.previewUrl} />
		{console.log(songs[preview.currentSongIndex - 2])}
		{console.log(preview.firstSong?.previewUrl)}
		{console.log()}
		<img src={songs[preview.currentSongIndex - 2].poster} alt="poster" />
	{/if}
	{#if preview?.secondSong}
		<AudioPlayer src={preview.secondSong?.previewUrl} />
		<img src={songs[preview.currentSongIndex - 1].poster} alt="poster" />
	{/if}
</div>
