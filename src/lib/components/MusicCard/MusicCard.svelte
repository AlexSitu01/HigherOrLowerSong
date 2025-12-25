<script lang="ts">
	import AudioPlayer from '$lib/components/AudioPlayer.svelte';
	import type { Snippet } from 'svelte';
	import type { PreviewSong } from '../../../routes/music/Preview.svelte';

	interface Props {
		preview: PreviewSong;
		children: Snippet;
		volume: number;
	}

	let { preview, children, volume }: Props = $props();
</script>

<div class="flex flex-col gap-3 rounded-2xl border-2 p-8 shadow-xl bg-white">
	<a href={preview.spotifyUrl} target="_blank" class="self-center">
		<img
			src={preview.poster}
			alt="Song Artwork"
			class="aspect-square w-60 rounded-2xl border-2 object-cover shadow-sm sm:w-80"
		/>
	</a>

	<div class="max-w-60 sm:max-w-80">
		<h2 class=" line-clamp-1 text-lg leading-5 font-bold">{preview.name}</h2>
		<p class="text-lg">
			<span class="sr-only">by</span><cite class="line-clamp-1 not-italic">{preview.artist}</cite>
		</p>
	</div>

	{@render children()}

	<div class="flex flex-col items-center justify-center gap-3">
		<AudioPlayer src={preview.previewUrl} {volume} />
	</div>
</div>
