import axios from "axios";
import type { PageServerLoad } from "./$types";
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "$env/static/private";

const PLAYLIST_ID = "7nnkHluVGMvzxEFI1aEWOb";
const MAX_SONGS = 200;

export interface Song {
    title: string,
    artist: string
    poster: string
}

export const load: PageServerLoad = async () => {

    const tokenResponse = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
            grant_type: "client_credentials",
        }),
        {
            headers: {
                Authorization:
                    "Basic " +
                    Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64"),
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );
    const access_token = tokenResponse.data?.access_token

    const instance = axios.create({
        baseURL: "https://api.spotify.com/v1/",
        timeout: 5000,
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    })

    let offset = 0;
    const limit = 50;
    let allSongs: Song[] = [];
    let hasNext = true;

    while (hasNext && allSongs.length < MAX_SONGS) {
        const response = await instance.get(
            `playlists/${PLAYLIST_ID}/tracks`,
            {
                params: {
                    limit,
                    offset,
                    market: "US",
                    fields: "items(track(name,artists(name),album(images))),next"
                }
            }
        );

        const items = response.data.items;

        const songs: Song[] = items
            .filter((item: any) => item.track) // protect against null tracks
            .map((item: any) => ({
                title: item.track.name,
                artist: item.track.artists?.[0]?.name ?? "Unknown Artist",
                poster: item.track.album?.images?.[0]?.url ?? ""
            }));

        allSongs.push(...songs);

        hasNext = response.data.next !== null;
        offset += limit;
    }

    return { songs: allSongs };

};
