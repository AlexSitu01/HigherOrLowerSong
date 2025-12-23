import type { Song } from "./+page.server";

const BATCH_NUM_PREVIEWS = 5
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
    songs: Song[]
    currentSongIndex: number
    firstSong: { name: string, previewUrl: string } | null
    secondSong: { name: string, previewUrl: string } | null
    loading: boolean
}

export class Preview implements PreviewInterface {
    songs: Song[]
    private previews: PreviewInfo[] = []
    private previewIndex: number = 0 //Pointer into the previews buffer
    currentSongIndex: number = $state(0)     //Pointer into the songs list
    firstSong: { name: string, previewUrl: string } | null = $state(null)
    secondSong: { name: string, previewUrl: string } | null = $state(null)
    loading: boolean = $state(false)
    private fetching: boolean = false

    constructor(songs: Song[]) {
        this.loading = true
        this.songs = songs
        this.initialLoad()
        this.loading = false
    }

    private async initialLoad() {
        await this.loadPreviews()
        if (this.previews.length > 2) {
            this.firstSong = { name: this.previews[0].name, previewUrl: this.previews[0].previewUrls[0] }
            this.secondSong = { name: this.previews[1].name, previewUrl: this.previews[1].previewUrls[0] }
            this.previewIndex += 2
            this.currentSongIndex += 2
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
        this.secondSong = { name: this.previews[this.previewIndex].name, previewUrl: this.previews[this.previewIndex].previewUrls[0] }
        this.previewIndex++
        this.currentSongIndex++
        
        // Prefetch next batch when buffer is running low
        const remainingInBuffer = this.previews.length - this.previewIndex 
        if (remainingInBuffer <= 2 && this.currentSongIndex < this.songs.length && !this.fetching) {
            this.fetching = true
            try{
                await this.loadPreviews(this.previews.length)
            }
            finally{
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


}