import '../components/card.js';

export default class ArtistsPage extends HTMLElement {
  async connectedCallback() {
    const artists = await fetch('https://www.analogstudios.net/api/artists').then(resp => resp.json());
    const html = artists.map(artist => {
      const { name, imageUrl } = artist;

      return `
        <app-card
          title="${name}"
          thumbnail="${imageUrl}"
        >
        </app-card>
      `;
    }).join('');

    this.innerHTML = `
      <h1>List of Artists: ${artists.length}</h1>
      ${html}
    `;
  }
}