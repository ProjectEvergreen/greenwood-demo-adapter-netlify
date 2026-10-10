import { renderFromHTML } from 'wc-compiler';
import { getProducts } from '../../services/products.ts';

export async function handler(request: Request): Promise<Response> {
  const limit = 5;
  const params = new URLSearchParams(request.url.slice(request.url.indexOf('?')));
  const offset = parseInt(params.get('offset') ?? '0', 10);
  const products = (await getProducts()).slice(offset, offset + limit);
  const { html } = await renderFromHTML(`
    ${
      products.map((item, idx) => {
        const { title, thumbnail, id } = item;

        return `
          <app-card
            id="${id}"
            title="${offset + idx + 1}) ${title}"
            thumbnail="${thumbnail}"
          ></app-card>
        `;
      }).join('')
    }
  `, [
    new URL('../../components/card.ts', import.meta.url)
  ]);


  return new Response(html, {
    headers: new Headers({
      'Content-Type': 'text/html'
    })
  });
}
