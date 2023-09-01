import { renderFromHTML } from 'wc-compiler';
import { getProducts } from '../services/products.js';

export async function handler(request) {
  const limit = 5;
  const params = new URLSearchParams(request.url.slice(request.url.indexOf('?')));
  const offset = params.has('offset') ? parseInt(params.get('offset'), 10) : null;
  const products = (await getProducts()).slice(offset, offset + limit);
  const { html } = await renderFromHTML(`
    ${
      products.map((item, idx) => {
        const { title, thumbnail } = item;

        return `
          <app-card
            title="${offset + idx + 1}) ${title}"
            thumbnail="${thumbnail}"
          ></app-card>
        `;
      }).join('')
    }
  `, [
    new URL('../components/card.js', import.meta.url)
  ]);


  return new Response(html, {
    headers: new Headers({
      'Content-Type': 'text/html'
    })
  });
}