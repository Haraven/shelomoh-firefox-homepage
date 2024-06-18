/**
 * @class LinkEntryKeybinding contains a {@link LinkEntry} and callback information for a single action associated with the link entry.
 * @param {LinkEntry} linkEntry - The link entry to bind
 * @param {function} callback - The callback to invoke when the key sequence for the entry is pressed
 */
class LinkEntryKeybinding {
    /**
     * @param {LinkEntry} linkEntry - The link entry to bind
     * @param {function} callback - The callback to invoke when the key sequence for the entry is pressed
     */
    constructor(linkEntry, callback) {
        this.linkEntry = linkEntry;
        this.callback = callback;
    }
}

/**
 * @class KeybindingService manages {@link LinkEntryKeybinding}s, detecting user key presses and invoking the appropriate callbacks.
 * @property {Keybinding[]} registeredKeybindings - The list of registered keybindings
 */
class LinkEntryKeybindingService {
    /**
     * The maximum length of a key sequence to match
     * @private
     * @type {number}
     */
    #maxKeySequenceLength = 1;

    /**
     * The time in milliseconds to wait in between key presses 
     * (if this interval is exceeded, the key sequence should be reset)
     * @private
     * @type {number}
     */
    #keyPressTimeoutMs = 250;

    /**
     * The sequence of keys that have been pressed in the allowed time interval
     * @private
     * @type {string[]}
     */
    #currentlyPressedKeys;

    /**
     * The timeout handler for the key press timeout
     * @private
     * @type {number}
     */
    #keyPressTimeoutHandler;

    /**
     * The callback to invoke when a key is pressed. Invokes with the currently pressed key sequence
     * (sequence length does not exceed the longest keybinding sequence length)
     * @private
     * @type {function}
     */
    #onKeyPressed;

    /**
     * The callback to invoke when the currently pressed key sequence resets (i.e., it is cleared).
     * @private
     * @type {function}
     */
    #onKeySequenceReset;

    /**
     * The callback to invoke when a keybinding is activated. Invokes with the {@link LinkEntry} that was activated
     * @private
     * @type {function}
     */
    #onLinkEntryActivated;

    constructor() {
        /**
         * @type {LinkEntryKeybinding[]}
         */
        this.registeredKeybindings = [];
        /**
         * @type {string[]}
         */
        this.#currentlyPressedKeys = [];

        document.addEventListener('keydown', (event) => this.#onKeyDown(event));
    }

    #onKeyDown(event) {
        this.#currentlyPressedKeys.push(event.key.toLowerCase());
        this.#ensureCurrentlyPressedKeySequenceFitsMaxSequenceLength();

        if (this.#onKeyPressed) {
            this.#onKeyPressed(this.#currentlyPressedKeys);
        }

        this.#resetKeyPressTimeout();
        this.#startKeyPressResetTimeout();
    }

    #ensureCurrentlyPressedKeySequenceFitsMaxSequenceLength() {
        let numberOfModifiersInSequence = this.#getSequenceModifiers(this.#currentlyPressedKeys).length;
        if (this.#currentlyPressedKeys.length > this.#maxKeySequenceLength + numberOfModifiersInSequence) {
            this.#currentlyPressedKeys.shift();
        }
    }

    #getSequenceWithoutModifiers(keySequence) {
        return keySequence.filter(key => key !== "shift" && key !== "control" && key !== "alt" && key !== "meta");
    }

    #getSequenceModifiers(keySequence) {
        return keySequence.filter(key => key === "shift" || key === "control" || key === "alt" || key === "meta");
    }

    #startKeyPressResetTimeout() {
        this.#keyPressTimeoutHandler = setTimeout(() => {
            let keybindingAssociatedWithKeySequence = this.#getKeybindingForSequence(this.#currentlyPressedKeys);
            if (keybindingAssociatedWithKeySequence) {
                this.#activateKeybinding(keybindingAssociatedWithKeySequence);
            }

            this.#resetCurrentKeySequence();
            this.#keyPressTimeoutHandler = null;
        }, this.#keyPressTimeoutMs);
    }

    #resetKeyPressTimeout() {
        if (this.#keyPressTimeoutHandler) {
            clearTimeout(this.#keyPressTimeoutHandler);
            this.#keyPressTimeoutHandler = null;
        }
    }

    #resetCurrentKeySequence() {
        this.#currentlyPressedKeys = [];

        if (this.#onKeySequenceReset) {
            this.#onKeySequenceReset();
        }

        this.#keyPressTimeoutHandler = null;
    }

    /**
     * 
     * @param {LinkEntryKeybinding} keybindingAssociatedWithKeySequence 
     */
    #activateKeybinding(keybindingAssociatedWithKeySequence) {
        try {
            keybindingAssociatedWithKeySequence.callback(keybindingAssociatedWithKeySequence.linkEntry, this.#currentlyPressedKeys);
            if (this.#onLinkEntryActivated) {
                this.#onLinkEntryActivated(keybindingAssociatedWithKeySequence.linkEntry, this.#currentlyPressedKeys);
            }
        }
        catch (error) {
            console.error(`Error invoking keybinding callback for ${keybindingAssociatedWithKeySequence.linkEntry.title}: ${error}`);
        }
    }

    /**
     * 
     * @param {string[]} keySequence - The key sequence to look up
     * @returns {LinkEntryKeybinding} - The keybinding associated with the key sequence, or null if no keybinding is found
     */
    #getKeybindingForSequence(keySequence) {
        keySequence = this.#getSequenceWithoutModifiers(keySequence);
        for (let registeredKeybinding of this.registeredKeybindings) {
            if (keySequence.length !== registeredKeybinding.linkEntry.shortcutSequence.length) {
                continue;
            }

            let doKeybindingsMatch = this.#checkIfKeySequenceMatchesKeybinding(keySequence, registeredKeybinding);

            if (doKeybindingsMatch) {
                return registeredKeybinding;
            }
        }

        return null;
    }

    /**
     * 
     * @param {string[]} keySequence 
     * @param {LinkEntryKeybinding} registeredKeybinding 
     * @returns 
     */
    #checkIfKeySequenceMatchesKeybinding(keySequence, registeredKeybinding) {
        for (let i = 0; i < keySequence.length; i++) {
            if (keySequence[i] !== registeredKeybinding.linkEntry.shortcutSequence[i]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Sets the callback to invoke when a key is pressed. Invokes with the currently pressed key sequence
     * (sequence length does not exceed the longest keybinding sequence length)
     * @param {function} callback - The callback to invoke when a key is pressed
     * @returns {LinkEntryKeybindingService} - this instance
     */
    whenKeyIsPressed(callback) {
        this.#onKeyPressed = callback;

        return this;
    }

    /**
     * Sets the callback to invoke when a keybinding is activated. Invokes with the key sequence that was activated, as well as any active modifier keys
     * @param {function} callback - The callback to invoke when a keybinding is activated
     * @returns {LinkEntryKeybindingService} - this instance
     */
    whenKeybindingIsActivated(callback) {
        this.#onLinkEntryActivated = callback;

        return this;
    }

    /**
     * Sets the callback to invoke when a key sequence resets (i.e., it is cleared).
     * @param {function} callback - The callback to invoke when the currently pressed key sequence resets
     * @returns {LinkEntryKeybindingService} - this instance
     */
    whenKeySequenceResets(callback) {
        this.#onKeySequenceReset = callback;

        return this;
    }

    /**
     * @param {LinkEntry} linkEntry - The link entry to bind
     * @param {function} callback - The callback to invoke when the key sequence for the entry is pressed
     */
    add(linkEntry, callback) {
        this.registeredKeybindings.push(new LinkEntryKeybinding(linkEntry, callback));
        if (this.#maxKeySequenceLength < linkEntry.shortcutSequence.length) {
            this.#maxKeySequenceLength = linkEntry.shortcutSequence.length;
        }
    }
}