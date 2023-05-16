// TODO should use src or public?  depends on dev vs production mode?
import { handler as page } from '../../public/artists-manual.js';

export async function handler (event, context) {
  const { rawUrl, headers } = event;
  const request = new Request(rawUrl, { headers });
  const response = await page(request);

  // TODO need to handle all Response properties like headers
  return {
    statusCode: response.status,
    body: await response.text()
  };
}