import axios from "axios";
import type { PageServerLoad } from "./$types";

// Use ES module import instead of require
import spotifyPreviewFinder from "spotify-preview-finder";

export const load: PageServerLoad = async () => {
    let songs = []
    try {
        for(let i = 0; i < songs.length; )
        const result = await spotifyPreviewFinder('Shape of You', 1);
        if (result.success) {
            return result 
        }
    } catch (error) {
        console.error(error);
    }
};
