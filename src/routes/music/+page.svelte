<script lang="ts">
	import { onMount } from 'svelte';
	import { highscore } from '../../globalState.svelte';
	import { Preview } from './Preview.svelte.js';
	import AudioPlayer from '$lib/components/AudioPlayer.svelte';

	const { data } = $props();
	const songs = $derived(data.songs); // Extract the songs array
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

	{#if preview?.loading}
		<div>Loading...</div>
	{:else}
		<button
			class="cursor-pointer rounded-2xl border-2 px-3 py-2"
			onclick={() => preview?.nextSong()}
		>
			Get Next song
		</button>
	{/if}

	{#if preview?.firstSong && !preview?.loading}
		<AudioPlayer src={preview.firstSong?.previewUrl} />
		{console.log(preview.firstSong?.previewUrl)}
		{console.log()}
		<img src={preview.firstSong?.poster} alt="poster" />
	{/if}
	{#if preview?.secondSong && !preview?.loading}
		<AudioPlayer src={preview.secondSong?.previewUrl} />
		<img src={preview.secondSong?.poster} alt="poster" />
	{/if}
	<div>Total Songs: {songs.length}</div>
</div>
