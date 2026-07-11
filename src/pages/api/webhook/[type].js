export async function handler(request, { params }) {
  if(params?.type !== 'event') {
    return new Response('Not Found', { status: 404 });
  }

  const data = await request.json();
  const now = new Date().getTime();
  const message = `Webhook "${data.name}" sent at "${data.time}" was successfully processed at "${now}".  Thank you!`;

  return new Response(JSON.stringify({ message }), { 
    headers: {
      "Content-Type": "application/json"
    }
  })
}