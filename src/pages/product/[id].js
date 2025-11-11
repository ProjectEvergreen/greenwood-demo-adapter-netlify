import '../../components/card.js';
import { getProducts } from '../../services/products.js';

export default class BlogPostPage extends HTMLElement {
  #id;

  constructor({ props }) {
    super();
    console.log({ props });
    this.#id = props?.id;
  }

  async connectedCallback() {
    const product = await getProducts(this.#id);
    const { title, thumbnail } = product;

    this.innerHTML = `
      <div class="products-cards-container">
        <app-card
          title="${title}"
          thumbnail="${thumbnail}"
        >
        </app-card>
      </div>
    `;
  }
}