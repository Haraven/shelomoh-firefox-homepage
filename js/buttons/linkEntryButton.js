/**
 * @class LinkEntryButton provides a displayable button for a {@link LinkEntry}.
 * 
 * @property {LinkEntry} linkEntry the link this button holds
 * @property {HTMLElement} domElement the DOM element of the button
 * @property {function} #pressed the callback to call when the button is pressed
 */
class LinkEntryButton {
    /**
     * @type {function}
     */
    #pressed;

    /**
     * @param {LinkEntry} linkEntry 
     * @param {HTMLElement} domContainer the DOM container to append the button to
     */
    constructor(linkEntry, domContainer) {
        this.linkEntry = linkEntry;
        this.domElement = this.#createDomElement(domContainer);
    }

    /**
     * Adds an event listener to the button's DOM element to invoke a callback when the button is pressed.
     * 
     * @param {function} callback the callback to call when the button is pressed
     * @returns {LinkEntryButton} this
     */
    whenPressed(callback) {
        this.#pressed = callback;

        return this;
    }

    #clicked() {
        if (this.#pressed) {
            this.#pressed(this);
        }
    }

    #createDomElement(domContainer) {
        let button = document.createElement("button");
        button.classList.add("link-entry");

        let shortcutSpan = document.createElement("span");
        shortcutSpan.classList.add("link-entry-shortcut");
        shortcutSpan.textContent = this.linkEntry.shortcutSequence.join("+");

        let titleSpan = document.createElement("span");
        titleSpan.classList.add("link-entry-title");
        titleSpan.textContent = this.linkEntry.title;

        button.appendChild(shortcutSpan);
        button.appendChild(titleSpan);

        button.addEventListener("click", () => this.#clicked());

        domContainer.appendChild(button);

        return button;
    }
}