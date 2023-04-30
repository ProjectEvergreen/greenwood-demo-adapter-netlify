import '../../node_modules/wc-compiler/src/dom-shim.js';
import { getArtists } from '../services/artists.js';
import Card from '../components/card.manual.js';

export async function handler(request) {
  const params = new URLSearchParams(request.url.slice(request.url.indexOf('?')));
  const offset = params.has('offset') ? parseInt(params.get('offset'), 10) : null;
  const headers = new Headers();
  const artists = await getArtists(offset);
  const card = new Card();
  
  card.connectedCallback();

  const html = artists.map((artist) => {
    const { name, imageUrl } = artist;
    return `
      <app-card-manual>
        ${card.getInnerHTML({ includeShadowRoots: true })}

        <h2 slot="title">${name}</h2>
        <img slot="thumbnail" src="${imageUrl}" alt="${name}"/>
      </app-card-manual>
    `;
  }).join('');

  headers.append('Content-Type', 'text/html');

  return new Response(html, {
    headers
  });
}