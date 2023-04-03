class Card extends Component {
    constructor() {
        super("Card");
    }

    connectedCallback() {
        super.connectedCallback();
        console.log("Mounted");
    }
}

customElements.define("card-item", Card);
