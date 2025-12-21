import { json } from '@sveltejs/kit';
import spotifyPreviewFinder from 'spotify-preview-finder';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { name, artist, limit } = await request.json();
		
		const response = await spotifyPreviewFinder(name, artist, limit);
		
		if (response.success) {
			return json(response);
		} else {
			return json({ error: 'Could not find the preview' }, { status: 404 });
		}
	} catch (error) {
		console.error('Preview fetch error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};