const template = document.createElement('template');

template.innerHTML = `
  <style>
    ::slotted(img) {
      width: 50%;
    }
  </style>

  <div>
    <slot name="title">My default title</slot>
    <button onclick="this.parentNode.parentNode.selectArtist()">View Artist Details</button>
    <slot name="thumbnail"></slot>
    <hr/>
  </div>
`;

export default class Card extends HTMLElement {

  selectArtist() {
    alert(`selected artist is => ${this.getAttribute('title')}!`);
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }
}

customElements.define('app-card-manual', Card);