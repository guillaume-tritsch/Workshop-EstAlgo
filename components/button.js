class AppButton extends HTMLElement {
  constructor() {
    super();

    // Crée un Shadow DOM
    const shadow = this.attachShadow({ mode: "open" });

    // Structure HTML de base
    const template = document.createElement("template");
    template.innerHTML = `
          <style>
            :host {
              display: inline-block;
              margin: 5px;
            }
            button {
              border: none;
              padding: 10px 20px;
              font-size: 16px;
              border-radius: 4px;
              cursor: pointer;
              min-height: 44px;
              transition: background-color 0.3s, color 0.3s;
            }
            button.primary {
              background-color: #007BFF;
              color: white;
            }
            button.primary:hover {
              background-color: #0056b3;
            }
            button.secondary {
              background-color: white;
              outline: #007BFF solid 1px;
              color: #007BFF;
            }
            button.secondary:hover {
              background-color:rgba(0, 0, 0, 0.03);
              outline:#0056b3 solid 1px;
              color: #0056b3;
            }
              
            ::slotted(.icon) {
                margin-left: 8px;
                width: 24px;
                height: 24px;
            }
            button.secondary ::slotted(.icon) {
                filter: invert(28%) sepia(96%) saturate(2828%) hue-rotate(201deg) brightness(106%) contrast(102%);
            }
            button.primary ::slotted(.icon) {
                filter: invert(100%) sepia(0%) saturate(7500%) hue-rotate(17deg) brightness(123%) contrast(114%);
            }
          </style>
          <button><slot style="display:flex; align-items: center"></slot></button>
        `;

    // Ajoute le contenu au Shadow DOM
    shadow.appendChild(template.content.cloneNode(true));

    // Référence au bouton
    this.button = shadow.querySelector("button");
  }

  connectedCallback() {
    this.updateType();
    this.updateHref();
  }

  static get observedAttributes() {
    return ["type", "href"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "type") {
      this.updateType();
    }
    if (name === "href") {
      this.updateHref();
    }
  }

  updateType() {
    // Efface les classes existantes
    this.button.className = "";

    // Ajoute une classe basée sur l'attribut `type`
    const type = this.getAttribute("type");
    if (type) {
      this.button.classList.add(type);
    }
  }

  updateHref() {
    const href = this.getAttribute("href");
    if (href) {
      this.button.onclick = () => {
        window.location.href = href;
      };
    } else {
      this.button.onclick = null; // Supprime l'événement si href est retiré
    }
  }
}

// Définit le custom element
customElements.define("app-button", AppButton);
