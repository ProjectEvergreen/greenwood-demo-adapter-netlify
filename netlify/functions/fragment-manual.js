import { handler as fragment } from '../../public/api/fragment-manual.js';

export async function handler (event, context) {
  const { rawUrl, headers } = event;
  const request = new Request(rawUrl, { headers });
  const response = await fragment(request);

  // TODO need to handle all Response properties like headers
  return {
    statusCode: response.status,
    body: await response.text()
  };
}