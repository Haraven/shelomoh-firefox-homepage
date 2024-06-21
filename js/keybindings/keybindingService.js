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
    #MODIFIERS = ['control', 'meta', 'shift', 'alt', 'command'];

    /**
     * @type {LinkEntryKeybinding[]}
     */
    registeredKeybindings;

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
     * The sequence of keys that have been pressed in the allowed time interval (without modifiers)
     * @private
     * @type {string[]}
     */
    #currentlyPressedKeys;

    /**
     * The sequence of modifiers that have been pressed
     * @private
     * @type {string[]}
     */
    #currentlyPressedModifiers;

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

    /**
     * The keys to ignore when detecting key sequences
     * @private
     * @type {string[]}
     */
    #ignoredKeys;

    constructor() {
        this.#ignoredKeys = [];

        this.registeredKeybindings = [];
        this.#currentlyPressedKeys = [];

        this.#currentlyPressedModifiers = [];

        document.addEventListener('keydown', (event) => this.#onKeyDown(event));
        document.addEventListener('keyup', (event) => this.#onKeyUp(event));
    }

    /**
     * @param {KeyboardEvent} event 
     */
    #onKeyDown(event) {
        let key = event.key.toLowerCase();
        if (this.#isModifier(key)) {
            if (!this.#currentlyPressedModifiers.includes(key)) {
                this.#currentlyPressedModifiers.push(key);
            }
        }
        else {
            this.#currentlyPressedKeys.push(key);
        }
        console.log(this.#currentlyPressedKeys, this.#currentlyPressedModifiers);
        this.#ensureCurrentlyPressedKeySequenceFitsMaxSequenceLength();

        if (this.#onKeyPressed) {
            this.#onKeyPressed(this.#currentlyPressedKeys);
        }

        this.#resetKeyPressTimeout();
        this.#startKeyPressResetTimeout();
    }

    /**
     * @param {KeyboardEvent} event 
     */
    #onKeyUp(event) {
        let key = event.key.toLowerCase();
        if (this.#isModifier(key)) {
            this.#currentlyPressedModifiers.splice(this.#currentlyPressedModifiers.indexOf(key), 1);
        }
    }

    /**
     * @param {string} key 
     * @returns {boolean}
     */
    #isModifier(key) {
        return this.#MODIFIERS.includes(key);
    }

    #ensureCurrentlyPressedKeySequenceFitsMaxSequenceLength() {
        let numberOfIgnoredKeysInSequence = this.#getSequenceIgnoredKeys(this.#currentlyPressedKeys).length;
        if (this.#currentlyPressedKeys.length > this.#maxKeySequenceLength + numberOfIgnoredKeysInSequence) {
            this.#currentlyPressedKeys.shift();
        }
    }

    #getSequenceWithoutIgnoredKeys(keySequence) {
        return keySequence.filter(key => !this.#ignoredKeys.includes(key));
    }

    #getSequenceIgnoredKeys(keySequence) {
        return keySequence.filter(key => this.#ignoredKeys.includes(key));
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
            let keySequenceWithModifiers = this.#currentlyPressedModifiers.concat(this.#currentlyPressedKeys);
            keybindingAssociatedWithKeySequence.callback(keybindingAssociatedWithKeySequence.linkEntry, keySequenceWithModifiers);
            if (this.#onLinkEntryActivated) {
                this.#onLinkEntryActivated(keybindingAssociatedWithKeySequence.linkEntry, keySequenceWithModifiers);
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
        keySequence = this.#getSequenceWithoutIgnoredKeys(keySequence);
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
     * @param {string} key - The key to ignore
     */
    ignoreKey(key) {
        key = key.toLowerCase();
        if (!this.#ignoredKeys.includes(key)) {
            this.#ignoredKeys.push(key);
        }
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