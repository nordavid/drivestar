class Component extends HTMLElement {
    constructor(componentId) {
        super();
        this.htmlPath = `./components/${componentId}/${componentId}.html`;
        this.cssPath = `./components/${componentId}/${componentId}.css`;
    }

    async connectedCallback() {
        const cssresp = await fetch(this.cssPath);
        const css = await cssresp.text();

        const htmlresp = await fetch(this.htmlPath);
        const html = await htmlresp.text();

        console.log(html);

        const template = document.createElement("template");
        template.innerHTML = `<style>${css}</style>${html}`;
        this.attachShadow({ mode: "open" }).appendChild(template.content.cloneNode(true));
    }
}
