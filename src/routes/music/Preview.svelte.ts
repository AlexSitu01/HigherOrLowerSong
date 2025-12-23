import type { Song } from "./+page.server";

const BATCH_NUM_PREVIEWS = 10
interface PreviewProps {
    name: string;
    artist?: string;
    limit?: number;
}

interface PreviewInfo {
    name: string
    spotifyUrl: string
    previewUrls: string[]
    trackId: string
    albumName: string
    releaseDate: string
    popularity: number
    durationMs: number
}

interface PreviewResponse {
    success: boolean
    searchQuery: string
    results: PreviewInfo[]
    error: string
}

interface PreviewInterface {
    firstSong: { name: string, previewUrl: string } | null
    secondSong: { name: string, previewUrl: string } | null
    loading: boolean
}

export class Preview implements PreviewInterface {
    private songs: Song[]
    private previews: PreviewInfo[] = []
    private previewIndex: number = 0 //Pointer into the previews buffer
    firstSong: { name: string, previewUrl: string, artist: string, spotifyUrl: string, popularity: number, poster: string } | null = $state(null)
    secondSong: { name: string, previewUrl: string, artist: string, spotifyUrl: string, popularity: number, poster: string } | null = $state(null)
    loading: boolean = $state(false)
    private fetching: boolean = false

    constructor(songs: Song[]) {
        this.loading = true
        this.shuffle(songs)
        this.songs = songs
        this.initialLoad()
        this.loading = false
    }

    private async initialLoad() {
        await this.loadPreviews()
        if (this.previews.length > 2) {
            this.firstSong = { name: this.songs[0].title, previewUrl: this.previews[0].previewUrls[0], artist: this.songs[0].artist, spotifyUrl: this.previews[0].spotifyUrl, popularity: this.previews[0].popularity, poster: this.songs[0].poster }
            this.secondSong = { name: this.songs[1].title, previewUrl: this.previews[1].previewUrls[0], artist: this.songs[1].artist, spotifyUrl: this.previews[1].spotifyUrl, popularity: this.previews[1].popularity, poster: this.songs[1].poster }
            this.previewIndex += 2
        }
    }

    private async loadPreviews(start: number = 0): Promise<void> {
        const startIndex = start
        const endIndex = Math.min(startIndex + BATCH_NUM_PREVIEWS, this.songs.length)

        const promises = []
        for (let i = startIndex; i < endIndex; i++) {
            promises.push(
                this.getPreviewInfo(this.songs[i].title, this.songs[i].artist, 1)
                    .catch(err => {
                        console.error(`Failed to load preview for ${this.songs[i].title}:`, err)
                        return null // Return null for failed previews
                    })
            )
        }
        const newPreviews = await Promise.all(promises)
        this.previews.push(...newPreviews.filter(p => p !== null))
    }

    async nextSong(): Promise<void> {
        // If next song is not available, return early
        if (this.previewIndex >= this.previews.length) {
            return;
        }

        if (this.previewIndex == this.previews.length - 1) {
            this.loading = true
        }

        this.firstSong = this.secondSong
        this.secondSong = { name: this.songs[this.previewIndex].title, previewUrl: this.previews[this.previewIndex].previewUrls[0], artist: this.songs[this.previewIndex].artist, spotifyUrl: this.previews[this.previewIndex].spotifyUrl, popularity: this.previews[this.previewIndex].popularity, poster: this.songs[this.previewIndex].poster }
        this.previewIndex++

        // Prefetch next batch when buffer is running low
        const remainingInBuffer = this.previews.length - this.previewIndex
        if (remainingInBuffer <= 4 && this.previewIndex < this.songs.length && !this.fetching) {
            this.fetching = true
            try {
                await this.loadPreviews(this.previews.length)
            }
            finally {
                this.fetching = false
                this.loading = false
            }
        }
    }

    private async getPreviewInfo(name: string, artist: string, limit: number) {
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

            const data: PreviewResponse = await response.json();
            if (data.success) {
                return data.results[0] as PreviewInfo
            }
            else {
                throw Error("Failed to fetch preview")
            }
        } catch (error) {
            console.error('Error fetching preview:', error);
            throw error;
        }
    }

    private shuffle(array: any[]) {
        let currentIndex = array.length;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
    }


}