/**
 * @class LinkEntryButtonRepository provides a repository for {@link LinkEntryButton}s.
 * 
 * @property {Object<string, LinkEntryButton[]>} entries the list of link entry buttons, grouped by {@link LinkCategories}
 */
class LinkEntryButtonRepository {
    constructor() {
        this.entries = {};
    }

    /**
     * Adds a {@link LinkEntryButton} to the repository.
     * 
     * @param {LinkEntryButton} button the button to add
     */
    add(button) {
        if (!this.entries[button.linkEntry.category]) {
            this.entries[button.linkEntry.category] = [];
        }
        
        this.entries[button.linkEntry.category].push(button);
    }
}