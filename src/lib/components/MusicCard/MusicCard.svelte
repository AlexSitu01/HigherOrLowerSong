<script lang="ts">
	import AudioPlayer from '$lib/components/AudioPlayer.svelte';
	import type { Snippet } from 'svelte';
	import type { PreviewSong } from '../../../routes/music/Preview.svelte';

	interface Props extends PreviewSong {
		popularitySnippet: Snippet<[popularity: number]>;
	}

	let { name, artist, poster, popularity, previewUrl, spotifyUrl, popularitySnippet }: Props =
		$props();
</script>

<div class="flex flex-col gap-3 rounded-2xl border-2 p-8 shadow-xl">
	<a href={spotifyUrl} target="_blank" class="self-center">
		<img
			src={poster}
			alt="Song Artwork"
			class="aspect-square w-60 rounded-2xl border-2 object-cover sm:w-80 shadow-sm"
		/>
	</a>

	<div class="max-w-60 sm:max-w-80">
		<h2 class="line-clamp-2 mb-1 text-lg leading-tight font-bold">{name}</h2>
		<p class="text-lg">
			<span class="sr-only">by</span><cite class="line-clamp-2 not-italic">{artist}</cite>
		</p>
	</div>

	{@render popularitySnippet(popularity)}

	<div class="self-center">
		<AudioPlayer src={previewUrl} />
	</div>
</div>
