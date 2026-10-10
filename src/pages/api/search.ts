import { renderFromHTML } from 'wc-compiler';
import { getProducts } from '../../services/products.ts';

export async function handler(request: Request): Promise<Response> {
  const formData = await request.formData();
  const value = formData.get('term');
  const term = typeof value === 'string' ? value : '';
  const products = (await getProducts())
    .filter((product => {
      return term !== '' && product.title.toLowerCase().includes(term.toLowerCase());
    }));
  let body = '';

  if (products.length === 0) {
    body = 'No results found.';
  } else {
    const { html } = await renderFromHTML(`
      ${
        products.map((item, idx) => {
          const { title, thumbnail, id } = item;

          return `
            <app-card
              id="${id}"
              title="${idx + 1}) ${title}"
              thumbnail="${thumbnail}"
            ></app-card>
          `;
        }).join('')
      }
    `, [
      new URL('../../components/card.ts', import.meta.url)
    ]);

    body = html;
  }

  return new Response(body, {
    headers: new Headers({
      'Content-Type': 'text/html'
    })
  });
}
