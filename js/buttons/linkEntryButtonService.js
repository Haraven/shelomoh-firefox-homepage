/**
 * @class LinkEntryButtonService provides a service for creating{@link LinkEntryButton}s.
 */
class LinkEntryButtonService {
    /**
     * @param {LinkEntryButtonRepository} repository the repository to add the buttons to
     */
    constructor() {
        this.repository = new LinkEntryButtonRepository();
    }

    /**
     * Adds a {@link LinkEntryButton} to the repository.
     * 
     * @param {LinkEntryButton} button the button to add
     */
    add(button) {
        this.repository.add(button);
    }
}