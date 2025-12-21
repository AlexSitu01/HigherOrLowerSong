import axios from "axios";
import type { PageServerLoad } from "./$types";
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "$env/static/private";

export interface Song{
    title: string,
    artist: string
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

    const response = await instance.get(
        "playlists/7nnkHluVGMvzxEFI1aEWOb",
        {
            params: {
                limit: 50,
                market: "US"
            }
        }
    );
    
    const songs: Song[] = response.data.tracks.items.map((item: { track: { name: any; artists: { name: any; }[]; }; }) => ({
        title: item.track.name,
        artist: item.track.artists[0].name
    }));

    return { songs };
};
