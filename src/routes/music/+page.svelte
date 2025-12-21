<script lang="ts">
	import { highscore } from '../../globalState.svelte';
	import { Preview } from './Preview.svelte.js';

	const { data } = $props();
	const songs = data.songs; // Extract the songs array
	const preview = new Preview(songs)
	$inspect(preview.secondSongPreview);
	
	
	let score = $state(0);

	const incrementScore = () => {
		score++;
	};


</script>

<div class="flex h-screen w-screen flex-col items-center justify-center gap-y-4">
	<div class="dsf justify-self-center">{score}</div>
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

	<button class="cursor-pointer rounded-2xl border-2 px-3 py-2" onclick={() => preview.nextSong(preview.firstSongPreview ?? "")}>
		Console spotify api
	</button>
</div>
