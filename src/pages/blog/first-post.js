export default class FirstPostsPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<h2>First Post Page</h2>`
  }
}