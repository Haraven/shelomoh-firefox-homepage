/**
 * @class LinkEntry container for any link entry that's displayed on the homepage.
 * A link entry is a a button that opens a URL in a new tab. This same button can be pressed via keyboard shortcut.
 * 
 * @property {string[]} shortcutSequence the keyboard shortcut sequence for the link entry
 * @property {string} title the human-readable title of the link entry
 * @property {string} url the URL of the link entry
 * @property {string} category the link category this entry belongs to (see {@link LinkCategories})
 */
class LinkEntry {
    /**
     * @param {string[]} shortcutSequence
     * @param {string} title 
     * @param {string} url 
     * @param {string} category 
     */
    constructor(shortcutSequence, title, url, category) {
        this.shortcutSequence = shortcutSequence;
        this.title = title;
        this.url = url;
        this.category = category;
    }
}