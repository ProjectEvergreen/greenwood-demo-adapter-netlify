# greenwood-demo-adapter-netlify

[![Netlify Status](https://api.netlify.com/api/v1/badges/7ad371a0-a026-423f-8a92-73b762975cc6/deploy-status)](https://app.netlify.com/sites/harmonious-gaufre-bb14cf/deploys)

A demonstration repo for deploying a full-stack [**Greenwood**](https://www.greenwoodjs.dev/) app with Netlify static hosting and Serverless + Edge functions.

## Setup

To run locally
1. Clone the repo
1. Run `npm ci`

You can now run these npm scripts
- `npm run dev` - Start the demo with Greenwood local dev server
- `npm run serve` - Start the demo with a production Greenwood build
- `npm run serve:netlify` - Start the Netlify CLI server for testing production Greenwood builds locally (see caveats section in the plugin's README)

> 👉 **Note**: _If deploying to your own Netlify instance, make sure you set the `AWS_LAMBDA_JS_RUNTIME` environment variable [in your Netlify UI](https://answers.netlify.com/t/aws-lambda-js-runtime-nodejs14-x/32161/2) to the value of  `nodejs18.x`_.

## Demo

This repo aims to demonstrate a couple of Greenwood's features ([API Routes](https://www.greenwoodjs.dev/docs/pages/api-routes/) and [SSR pages](https://www.greenwoodjs.dev/docs/pages/server-rendering/)) leveraging Netlify's serverless and edge function capabilities, focused on using Web Components (WCC) and Web Standards to deliver the content for the demo.

## Status

|Feature    |Greenwood |Serverless|Edge|
|---------- |----------|----------|----|
|API Routes |   ✅     |  ✅      | ❓ |
|SSR Pages  |   ✅     |  ✅      | ❓ |

## Serverless

The serverless demos include the following examples:

### API Routes

- ✅  [`/api/greeting?name{xxx}`](https://harmonious-gaufre-bb14cf.netlify.app/api/greeting) - An API that returns a JSON response and optionally uses the `name` query param for customization.  Otherwise returns a default message.
- ✅  [`/api/fragment`](https://harmonious-gaufre-bb14cf.netlify.app/api/fragment) - An API for returning fragments of server rendered Web Components as HTML, that are then appended to the DOM.  The same card component used in SSR also runs on the client to provide interactivity, like event handling.
- ✅ [`/api/search`](https://greenwood-demo-adapter-vercel.vercel.app/api/event) - An API for handling a search using  `request.formData()`
- ✅ [`/api/event`](https://greenwood-demo-adapter-vercel.vercel.app/api/event) - An API for mimicking a webhook `POST` request that uses `request.json()`

### SSR Pages

-  ✅ [`/products/`](https://harmonious-gaufre-bb14cf.netlify.app/products/) - SSR page for rendering Greenwood pages.

### Known Issues

> _**All known issue resolved!  Information left here for posterity**_

####  ✅ import.meta.url

> _**Note**: Solved by [bypassing Netlify's bundling and just creating a zip file custom build output](https://github.com/ProjectEvergreen/greenwood-demo-adapter-netlify/pull/4/commits/7787bc62cb891169a2c8156c0790f648288cab0b)_

Seeing this issue when creating an "idiomatic" example of a custom element using WCC's `renderFromHTML` because [Netlify / esbuild](https://github.com/evanw/esbuild/issues/795) does not support `import.meta.url`, though hopefully it is [coming soon](https://github.com/evanw/esbuild/pull/2508)? 🥺

![Netlify invalid URL](./netlify-invalid-url.png)

```js
import { renderFromHTML } from 'wc-compiler';
import { getArtists } from '../services/artists.js';

export async function handler(request) {
  const params = new URLSearchParams(request.url.slice(request.url.indexOf('?')));
  const offset = params.has('offset') ? parseInt(params.get('offset'), 10) : null;
  const headers = new Headers();
  const artists = await getArtists(offset);
  const { html } = await renderFromHTML(`
    ${
      artists.map((item, idx) => {
        const { name, imageUrl } = item;

        return `
          <app-card
            title="${offset + idx + 1}) ${name}"
            thumbnail="${imageUrl}"
          ></app-card>
        `;
      }).join('')
    }
  `, [
    new URL('../components/card.js', import.meta.url)
  ]);

  headers.append('Content-Type', 'text/html');

  return new Response(html, {
    headers
  });
}
```

The above would be the ideal implementation, so instead have to do something more "manual" for now.
```js
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
```

####  ✅ ERR_REQUIRE_ESM

> _**Note**: Solved by [pointing to Greenwood's bundled output in the _public/_ directory](https://github.com/ProjectEvergreen/greenwood-demo-adapter-netlify/pull/1)_

So although this runs fine locally for `/api/fragment-manual`, when run on Netlify, the `ERR_REQUIRE_ESM` message is seen.

![Netlify ERR_REQUIRE_ESM](./netlify-err-require-esm.png)

## Edge

TODO

### API Routes

TODO

### SSR page