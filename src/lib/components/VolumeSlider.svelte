<script lang="ts">
    let { volume = $bindable() } = $props()
    let progress = $derived(volume * 100)
    let sliderRef: HTMLDivElement

    function updateVolume(event: MouseEvent, slider: HTMLDivElement) {
        const rect = slider.getBoundingClientRect()
        const x = event.clientX - rect.left
        const newVolume = Math.max(0, Math.min(1, x / rect.width))
        volume = newVolume
    }

    function handleMouseDown(event: MouseEvent) {
        const slider = event.currentTarget as HTMLDivElement
        
        // Update volume immediately on click
        updateVolume(event, slider)
        
        // Handle dragging
        function handleMouseMove(e: MouseEvent) {
            updateVolume(e, slider)
        }
        
        function handleMouseUp() {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
        
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }

    function handleKeyDown(event: KeyboardEvent) {
        let newVolume = volume
        
        switch(event.key) {
            case 'ArrowRight':
            case 'ArrowUp':
                newVolume = Math.min(1, volume + 0.05)
                event.preventDefault()
                break
            case 'ArrowLeft':
            case 'ArrowDown':
                newVolume = Math.max(0, volume - 0.05)
                event.preventDefault()
                break
            case 'Home':
                newVolume = 0
                event.preventDefault()
                break
            case 'End':
                newVolume = 1
                event.preventDefault()
                break
        }
        
        volume = newVolume
    }
</script>

<div class="flex flex-1 items-center gap-2">
	<div
		bind:this={sliderRef}
		class="relative h-2 flex-1 cursor-pointer rounded-full w-70 bg-gray-300"
		onmousedown={handleMouseDown}
		onkeydown={handleKeyDown}
		role="slider"
		tabindex="0"
		aria-valuemin="0"
		aria-valuemax="1"
		aria-valuenow={volume}
		aria-label="Volume slider"
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
</div>