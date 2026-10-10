globalThis.addEventListener('DOMContentLoaded', () => {
  const formElement = document.querySelector('form');
  const output = document.getElementById('greeting-output');
  if (!formElement || !output) return;

  formElement.addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = new FormData(formElement);
    const name = form.get('name');
    const data: { message: string } = await fetch(new URL(`/api/greeting?name=${name}`, window.location.href)).then(resp => resp.json());

    output.textContent = `${data.message}! 👋`;
  });
});
globalThis.addEventListener('DOMContentLoaded', () => {
  const page = 5;
  let offset = 0 - page;
  const button = document.getElementById('load-products');
  const output = document.getElementById('load-products-output');
  if (!button || !output) return;

  button.addEventListener('click', async () => {
    offset += page;
    const html = await fetch(`/api/fragment?offset=${offset}`).then(resp => resp.text());
    const fragment = Document.parseHTMLUnsafe(html);

    output.insertAdjacentHTML('beforeend', fragment.body.innerHTML);
  });
});
