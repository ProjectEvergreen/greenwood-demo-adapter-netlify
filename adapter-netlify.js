// https://docs.netlify.com/functions/deploy/?fn-language=js#custom-build-2
import fs from 'fs/promises';
import { checkResourceExists } from '@greenwood/cli/src/lib/resource-utils.js';

function generateOutputFormat(id, type) {
  // const path = type === 'page'
  //   ? `__${id}`
  //   : `_${id;

  // TODO use `new Headers` here?
  return `
    import { handler as ${id} } from './__${id}.js';

    export async function handler (event, context) {
      console.log('enter api handler for ${id}!');
      const { rawUrl, headers } = event;
      const request = new Request(rawUrl, { headers });
      const response = await ${id}(request);
    
      // TODO need to handle all Response properties like headers
      return {
        statusCode: response.status,
        body: await response.text()
      };
    }
  `

  // return `
  //   import { handler as ${id} } from './${path}.js';

  //   export default async function handler (request, response) {
  //     console.log('enter api handler for ${id}!');
  //     const { url, headers } = request;
  //     const req = new Request(new URL(url, \`http://\${headers.host}\`), {
  //       headers: new Headers(headers)
  //     });
  //     const res = await ${id}(req);

  //     // TODO need to handle all Response properties like headers
  //     // https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/node-js#node.js-request-and-response-objects
  //     response.status(res.status);
  //     response.send(await res.text());
  //   }
  // `;
}

async function netlifyAdapter(compilation) {
  console.log('ENTER netlifyAdapter');
  const { outputDir, projectDirectory } = compilation.context;
  const adapterOutputUrl = new URL('./netlify/functions/', projectDirectory);
  const ssrPages = compilation.graph.filter(page => page.isSSR);
  const apiRoutes = compilation.manifest.apis;

  if (!await checkResourceExists(adapterOutputUrl)) {
    await fs.mkdir(adapterOutputUrl, { recursive: true });
  }

  // await fs.writeFile(new URL('./.vercel/output/config.json', projectDirectory), JSON.stringify({
  //   'version': 3
  // }));

  console.log({ ssrPages, apiRoutes, adapterOutputUrl });
  console.log('compilation.context.outputDir ????', outputDir);
  console.log('CWD (import.meta.url)????', import.meta.url);

  const files = await fs.readdir(outputDir);
  const isExecuteRouteModule = files.find(file => file.startsWith('execute-route-module'));

  for (const page of ssrPages) {
    const { id } = page;
    const outputFormat = generateOutputFormat(id, 'page');
    const outputRoot = new URL(`./${id}/`, adapterOutputUrl);

    await fs.mkdir(outputRoot, { recursive: true });
    await fs.writeFile(new URL(`./index.js`, outputRoot), outputFormat);
    // TODO needed?
    // await fs.writeFile(new URL(`./package.json`, outputRoot), JSON.stringify({
    //   type: 'module'
    // }));

    await fs.cp(
      new URL(`./_${id}.js`, outputDir),
      new URL(`./_${id}.js`, outputRoot),
      { recursive: true }
    );

    await fs.cp(
      new URL(`./__${id}.js`, outputDir),
      new URL(`./__${id}.js`, outputRoot),
      { recursive: true }
    );

    // TODO quick hack to make serverless pages are fully self-contained
    // for example, execute-route-module.js will only get code split if there are more than one SSR pages
    // https://github.com/ProjectEvergreen/greenwood/issues/1118
    if (isExecuteRouteModule) {
      await fs.cp(
        new URL(`./${isExecuteRouteModule}`, outputDir),
        new URL(`./${isExecuteRouteModule}`, outputRoot),
      )
    }
  }

  // public/api/
  for (const [key] of apiRoutes) {
    const id = key.replace('/api/', '');
    const outputFormat = generateOutputFormat(id, 'api');
    const outputRoot = new URL(`./api/${id}/`, adapterOutputUrl);

    await fs.mkdir(outputRoot, { recursive: true });
    await fs.writeFile(new URL(`./index.js`, outputRoot), outputFormat);
    // TODO needed?
    // await fs.writeFile(new URL(`./package.json`, outputRoot), JSON.stringify({
    //   type: 'module'
    // }));

    // TODO ideally all functions would be self contained
    // https://github.com/ProjectEvergreen/greenwood/issues/1118
    await fs.cp(
      new URL(`./api/${id}.js`, outputDir),
      new URL(`./__${id}.js`, outputRoot),
      { recursive: true }
    );
    await fs.cp(
      new URL(`./api/assets/`, outputDir),
      new URL('./assets/', outputRoot),
      { recursive: true }
    );
  }

  // static assets / build
  // await fs.cp(
  //   outputDir,
  //   new URL('./.vercel/output/static/', projectDirectory),
  //   {
  //     recursive: true
  //   }
  // )
}

const greenwoodPluginAdapterNetlify = (options = {}) => [{
  type: 'adapter',
  name: 'plugin-adapter-netlify',
  provider: (compilation) => {
    return async () => {
      await netlifyAdapter(compilation, options);
    };
  }
}];

export { greenwoodPluginAdapterNetlify };