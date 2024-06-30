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
     * @type {function}
     */
    #middleClicked;

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

    whenMiddleClicked(callback) {
        this.#middleClicked = callback;

        return this;
    }

    #clicked(event) {
        if (this.#pressed) {
            this.#pressed(this, event);
        }
    }

    #checkForMiddleClick(event) {
        if (!this.#middleClicked) {
            return;
        }

        if (event.button === 4 || event.which === 2) {
            this.#middleClicked(this, event);
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
    
        let container = document.createElement("div");
        container.classList.add("link-entry-container");
        container.appendChild(shortcutSpan);
        container.appendChild(titleSpan);
    
        button.appendChild(container);
    
        button.addEventListener("click", (event) => this.#clicked(event));
        button.addEventListener("mousedown", (event) => this.#checkForMiddleClick(event));
    
        domContainer.appendChild(button);
    
        return button;
    }
}