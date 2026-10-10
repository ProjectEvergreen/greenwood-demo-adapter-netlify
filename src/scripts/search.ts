globalThis.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const output = document.getElementById('search-products-output');
  if (!form || !output) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const value = formData.get('term');
    const term = typeof value === 'string' ? value : '';
    const html = await fetch('/api/search', {
      method: 'POST',
      body: new URLSearchParams({ term }).toString(),
      headers: new Headers({
        'content-type': 'application/x-www-form-urlencoded'
      })
    }).then(resp => resp.text());
    const fragment = Document.parseHTMLUnsafe(html);

    output.innerHTML = fragment.body.innerHTML;
  });
});
