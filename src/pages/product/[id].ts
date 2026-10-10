import '../../components/card.ts';
import { getProducts } from '../../services/products.ts';

export default class ProductDetailsPage extends HTMLElement {
  #id: string;

  constructor({ params }: { params: { id: string } }) {
    super();
    this.#id = params.id;
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
