class AppHeader extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    const template = document.createElement("template");
    template.innerHTML = `
        <style>
            :host {
                display:flex;
            }

            header {            
                width: 100vw;
                display:flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                padding: 0 1.5rem;
            }
        </style>
        <header>    
            <h2>Color Set Reviewer</h2>
            <p>Workshop S1 | Design Algorithmic</p>
        </header>
      `;

      shadow.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("app-header", AppHeader);
