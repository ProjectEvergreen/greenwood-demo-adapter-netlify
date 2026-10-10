globalThis.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('test-webhook');
  const output = document.getElementById('test-webhook-output');
  if (!button || !output) return;

  button.addEventListener('click', async (e) => {
    e.preventDefault();

    const data: { message: string } = await fetch('/api/webhook/event', {
      method: 'POST',
      body: JSON.stringify({
        name: "Test Event",
        time: new Date().getTime()
      }),
      headers: new Headers({
        'content-type': 'application/json'
      })
    }).then(resp => resp.json());

    output.innerHTML = data.message;
  });
});
