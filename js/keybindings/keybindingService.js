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
    #keyPressTimeoutMs = 500;

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
        this.registeredKeybindings = [];
        this.#currentlyPressedKeys = [];

        document.addEventListener('keydown', (event) => this.#onKeyDown(event));
    }

    #onKeyDown(event) {
        this.#currentlyPressedKeys.push(event.key);
        this.#ensureCurrentlyPressedKeySequenceFitsMaxSequenceLength();

        if (this.#onKeyPressed) {
            this.#onKeyPressed(this.#currentlyPressedKeys);
        }

        let keybindingAssociatedWithKeySequence = this.#getKeybindingForSequence(this.#currentlyPressedKeys);
        if (keybindingAssociatedWithKeySequence) {
            this.#activateKeybinding(keybindingAssociatedWithKeySequence);
            this.#resetKeyPressTimeout();
            this.#resetCurrentKeySequence();

            return;
        }

        this.#resetKeyPressTimeout();

        this.#startKeyPressResetTimeout();
    }

    #ensureCurrentlyPressedKeySequenceFitsMaxSequenceLength() {
        if (this.#currentlyPressedKeys.length > this.#maxKeySequenceLength) {
            this.#currentlyPressedKeys.shift();
        }
    }

    #startKeyPressResetTimeout() {
        this.#keyPressTimeoutHandler = setTimeout(() => {
            this.#resetCurrentKeySequence();
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

    #activateKeybinding(keybindingAssociatedWithKeySequence) {
        try {
            keybindingAssociatedWithKeySequence.callback();
            if (this.#onLinkEntryActivated) {
                this.#onLinkEntryActivated(keybindingAssociatedWithKeySequence.linkEntry);
            }
        }
        catch (error) {
            console.error(`Error invoking keybinding callback for ${keybindingAssociatedWithKeySequence.linkEntry.name}: ${error}`);
        }
    }

    /**
     * 
     * @param {string[]} keySequence - The key sequence to look up
     * @returns {LinkEntryKeybinding} - The keybinding associated with the key sequence, or null if no keybinding is found
     */
    #getKeybindingForSequence(keySequence) {
        for (let registeredKeybinding of this.registeredKeybindings) {
            if (keySequence.length !== registeredKeybinding.linkEntry.keySequence.length) {
                continue;
            }

            let doKeybindingsMatch = this.#checkIfKeySequenceMatchesKeybinding(keySequence, registeredKeybinding);

            if (doKeybindingsMatch) {
                return registeredKeybinding;
            }
        }

        return null;
    }

    #checkIfKeySequenceMatchesKeybinding(keySequence, registeredKeybinding) {
        for (let i = 0; i < keySequence.length; i++) {
            if (keySequence[i] !== registeredKeybinding.linkEntry.keySequence[i]) {
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
     * Sets the callback to invoke when a keybinding is activated. Invokes with the key sequence that was activated
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
     * @param {LinkEntry[]} linkEntry - The link entry to bind
     * @param {function} callback - The callback to invoke when the key sequence for the entry is pressed
     */
    addKeybinding(linkEntry, callback) {
        this.registeredKeybindings.push(new LinkEntryKeybinding(linkEntry, callback));
    }
}