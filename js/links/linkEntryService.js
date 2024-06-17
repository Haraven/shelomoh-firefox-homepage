/**
 * @class LinkEntryService provides a service for manipulating link entries from the {@link LinkEntryRepository}.
 * 
 * Link entries are initialized when this service is instantiated.
 * 
 * @property {LinkEntryRepository} repository the repository of all predefined link entries
 */
class LinkEntryService {
    constructor() {
        this.repository = new LinkEntryRepository();
        this.repository.populate();
    }

    /**
     * @returns {LinkEntry[]} all link entries in the repository
     */
    getAll() {
        return this.repository.getAll();
    }
}