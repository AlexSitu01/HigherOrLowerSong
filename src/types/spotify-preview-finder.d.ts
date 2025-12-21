declare module 'spotify-preview-finder' {
  interface SpotifyPreviewResult {
    success: boolean;
    [key: string]: any; // fallback for unknown properties
  }

  function spotifyPreviewFinder(query: string, artist?:string ,limit?: number): Promise<SpotifyPreviewResult>;

  export default spotifyPreviewFinder;
}
