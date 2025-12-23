<script lang="ts">
	let { src } = $props();
	// svelte-ignore state_referenced_locally
		const audioSource = src as string;
	// 2. Declare a variable to hold the reference to the <audio> DOM element.
	let audioPlayer: HTMLAudioElement;
    
	// 3. State to track if the audio is playing or paused
	let isPlaying = $state(false);

    $effect(() => {
		if (audioPlayer && src) {
			audioPlayer.src = src;
			audioPlayer.load();         
			isPlaying = false;
			audioPlayer.currentTime = 0; // Rewind when the source changes
			audioPlayer.volume = 0.3; // Set initial volume
		}
	});

	// 4. Function to toggle playback
	async function togglePlayPause() {
		try {
			if (isPlaying) {
				audioPlayer.pause();
			} else {
				await audioPlayer.play();
			}
		} catch (e) {
			console.error(e);
		}
	}
</script>

<!-- 5. Hidden <audio> element bound to the audioPlayer variable -->
<audio
	bind:this={audioPlayer}
	src={audioSource}
	onplay={() => (isPlaying = true)}
	onpause={() => (isPlaying = false)}
	onended={() => {
		isPlaying = false;
		audioPlayer.currentTime = 0; // Rewind when finished
	}}
></audio>

<!-- 6. Button with click handler -->
<button onclick={togglePlayPause} class="rounded-full border-2 p-2">
	{#if isPlaying}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="2"
			stroke="currentColor"
			class="size-6"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
		</svg>
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="2"
			stroke="currentColor"
			class="size-6"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
			/>
		</svg>
	{/if}
</button>
