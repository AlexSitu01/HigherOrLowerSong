<script lang="ts">
	let {
		audioPlayer,
		currentTime = $bindable(),
		duration = $bindable(),
		isDragging = $bindable()
	} = $props();

	let progress = $derived(
		duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0
	);
	let seekBarEl: HTMLDivElement | null = null;

	function handleSeek(e: MouseEvent) {
		if (!seekBarEl || duration <= 0) return;

		const rect = seekBarEl.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const percentage = Math.max(0, Math.min(1, x / rect.width));
		const newTime = percentage * duration;

		audioPlayer.currentTime = newTime;
		currentTime = newTime;
	}

	function handleMouseDown(e: MouseEvent) {
		isDragging = true;
		handleSeek(e);
	}

	function handleMouseMove(e: MouseEvent) {
		if (isDragging) {
			handleSeek(e);
		}
	}

	function handleMouseUp() {
		isDragging = false;
	}

	function formatTime(seconds: number) {
		if (isNaN(seconds)) return '0:00';
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (duration <= 0) return;

		let newTime = currentTime;
		const seekAmount = 5; // seconds to skip

		switch (event.key) {
			case 'ArrowRight':
			case 'ArrowUp':
				newTime = Math.min(duration, currentTime + seekAmount);
				event.preventDefault();
				break;
			case 'ArrowLeft':
			case 'ArrowDown':
				newTime = Math.max(0, currentTime - seekAmount);
				event.preventDefault();
				break;
			case 'Home':
				newTime = 0;
				event.preventDefault();
				break;
			case 'End':
				newTime = duration;
				event.preventDefault();
				break;
		}

		audioPlayer.currentTime = newTime;
		currentTime = newTime;
	}
</script>

<svelte:window on:mousemove={handleMouseMove} on:mouseup={handleMouseUp} />

<div class="flex items-center gap-2 self-stretch">
	<span class="min-w-10 font-mono text-sm text-gray-600">
		{formatTime(currentTime)}
	</span>

	<!-- svelte-ignore element_invalid_self_closing_tag -->
	<div
		bind:this={seekBarEl}
		class="relative h-2 flex-1 cursor-pointer rounded-full bg-gray-300"
		onmousedown={handleMouseDown}
		onkeydown={handleKeyDown}
		role="slider"
		tabindex="0"
		aria-valuemin="0"
		aria-valuemax={duration}
		aria-valuenow={currentTime}
	>
		<!-- Progress track -->
		<div class="absolute inset-0 rounded-full bg-gray-300" />

		<!-- Progress fill -->

		<div
			class="absolute top-0 left-0 h-full rounded-full bg-gray-800"
			style="width: {progress}%;"
		/>

		<!-- Draggable handle -->
		<div
			class="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-900 shadow-md"
			style="left: {progress}%;"
		/>
	</div>

	<span class="min-w-10 font-mono text-sm text-gray-600">
		{formatTime(duration)}
	</span>
</div>
