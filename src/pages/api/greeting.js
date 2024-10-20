import { getMessage } from '../../services/message.js';

export async function handler(request) {
  const params = new URLSearchParams(request.url.slice(request.url.indexOf('?')));
  const name = params.has('name') ? params.get('name') : 'Greenwood';
  const body = { message: getMessage(name) };

  return new Response(JSON.stringify(body), {
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  });
}