import type { Song } from './+page.server';

const PRELOAD_COUNT = 15;

export interface SongPreview {
	name: string;
	artist: string;
	previewUrl: string;
	spotifyUrl: string;
	popularity: number;
	poster: string;
}

interface PreviewResponse {
	success: boolean;
	searchQuery: string;
	results: PreviewDto[];
	error: string;
}

interface PreviewDto {
	name: string;
	spotifyUrl: string;
	previewUrls: string[];
	trackId: string;
	albumName: string;
	releaseDate: string;
	popularity: number;
	durationMs: number;
}

export class Playlist {
	previews: SongPreview[] = $state([]);
	loading: boolean = $state(false);
	fetching: boolean = $state(false);
	private songs: ArrayIterator<Song>;

	constructor(songs: Song[]) {
		shuffle(songs);
		this.songs = songs.values();
	}

	async load() {
		this.loading = true;
		await this.loadPreviews(PRELOAD_COUNT).finally(() => {
			this.loading = false;
		});
	}

	async nextSong(): Promise<void> {
		this.previews = this.previews.slice(1);

		const PRELOAD_TRIGGER = 10;
		if (this.previews.length < PRELOAD_TRIGGER) {
			this.loadPreviews(PRELOAD_COUNT);
		}
	}

	private async loadPreviews(batch: number): Promise<void> {
		if (this.fetching) {
			return;
		}
		this.fetching = true;

		const promises = this.songs.take(batch).map(songToPreview);
		const newPreviews = (await Promise.all(promises)).filter((p) => p !== null);
		this.previews.push(...newPreviews);

		this.fetching = false;
	}
}

function shuffle(array: unknown[]) {
	let currentIndex = array.length;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {
		// Pick a remaining element...
		const randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}
}

async function songToPreview({ title, artist, poster }: Song): Promise<SongPreview | null> {
	const LIMIT = 1;

	const preview = await fetchPreview(title, artist, LIMIT).catch((err) => {
		console.error(`Failed to load preview for ${title}:`, err);
		return null;
	});
	if (!preview) {
		return null;
	}

	return {
		name: title,
		artist,
		previewUrl: preview.previewUrls[0],
		spotifyUrl: preview.spotifyUrl,
		popularity: preview.popularity,
		poster
	};
}

async function fetchPreview(name: string, artist: string, limit: number) {
	// return {
	// 	name: 'Devil Doesn’t Bargain - Acoustic - Alec Benjamin',
	// 	spotifyUrl: 'https://open.spotify.com/track/5iRlgbAfme5SYmUPYnZs6y',
	// 	previewUrls: ['https://p.scdn.co/mp3-preview/3cb72e15d03c6c1aa8cc1534e011649e5308b70f'],
	// 	trackId: '5iRlgbAfme5SYmUPYnZs6y',
	// 	albumName: 'Devil Doesn’t Bargain (Acoustic)',
	// 	releaseDate: '2022-07-15',
	// 	popularity: 44,
	// 	durationMs: 161537
	// };

	try {
		const response = await fetch('/api/preview', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name, artist, limit })
		});

		if (!response.ok) {
			throw new Error('Failed to fetch preview');
		}

		const data = (await response.json()) as PreviewResponse;
		if (!data.success) {
			throw Error('Failed to fetch preview');
		}

		return data.results[0];
	} catch (error) {
		console.error('Error fetching preview:', error);
		throw error;
	}
}
