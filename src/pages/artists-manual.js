import Card from '../components/card.manual.js';

export default class ArtistsPage extends HTMLElement {
  async connectedCallback() {
    const artists = await fetch('https://www.analogstudios.net/api/artists').then(resp => resp.json());
    const card = new Card();
  
    await card.connectedCallback();

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

    this.innerHTML = `
      <h1>List of Artists: ${artists.length}</h1>
      ${html}
    `;
  }
}