export interface ModalDetail {
  content: string;
}

declare global {
  interface WindowEventMap {
    'update-modal': CustomEvent<ModalDetail>;
  }
}

const template = document.createElement('template');

template.innerHTML = `
  <style>
    dialog {
      border: 1px solid #818181;
      text-align: center;
      width: 40%;
      border-radius: 10px;
      padding: 2rem 1rem;
      min-height: 200px;
      background-color: #fff;
      overflow-x: hidden;
    }
    
    h3 {
      font-size: 1.85rem;
    }
    
    button {
      background: var(--color-accent);
      color: var(--color-white);
      padding: 1rem 2rem;
      border: 0;
      font-size: 1rem;
      border-radius: 5px;
      cursor: pointer;
    }
    @media(max-width: 768px) {
      dialog {
        width: 80%;
      }
    }
  </style>
  <dialog>
    <h3 id="content"></h3>
    <button autofocus>Close</button>
  </dialog>
`;

export default class Modal extends HTMLElement {

  updateModal(detail: ModalDetail): void {
    console.log(`selected item is => ${detail.content}`);
    const modal = this.shadowRoot?.querySelector('dialog');

    if (!modal) return;

    const content = modal.querySelector('#content');
    if (content) content.textContent = detail.content;
    modal.showModal();
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(template.content.cloneNode(true));
    }

    // setup event handlers for updating and closing the dialog
    window.addEventListener('update-modal', (event) => {
      this.updateModal(event.detail);
    })

    const modal = this.shadowRoot?.querySelector('dialog');

    modal?.querySelector('button')?.addEventListener("click", () => {
      modal.close();
    });
  }
}

customElements.define('app-modal', Modal);
