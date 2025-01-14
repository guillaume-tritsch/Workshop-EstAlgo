class AppFooter extends HTMLElement {
    constructor() {
      super();
  
      const shadow = this.attachShadow({ mode: "open" });
  
      const template = document.createElement("template");
      template.innerHTML = `
          <style>
              :host {
                  display:flex;
              }
  
              footer {            
                  width: 100vw;
                  display:flex;
                  flex-direction: row;
                  justify-content: space-between;
                  align-items: center;
                  padding: 0 1.5rem;
              }
          </style>
          <footer>
                <p>Website developped by Ilyass Remmane and Guillaume Tritsch</p>
          </footer>
        `;
  
        shadow.appendChild(template.content.cloneNode(true));
    }
  }
  
  customElements.define("app-footer", AppFooter);
  