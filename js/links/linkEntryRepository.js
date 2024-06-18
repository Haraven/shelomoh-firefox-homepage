/**
 * @class LinkEntryRepository container for all link entries that are displayed on the homepage.
 * 
 * @property {Object<string, LinkEntry[]>} entries the link entries that are displayed on the homepage, grouped by category
 */
class LinkEntryRepository {
    constructor() {
        this.entries = {};
    }

    /**
     * Populates the repository with predefined link entries across all {@link LinkCategories}.
     */
    populate() {
        this.entries = {};

        this.fillCategory(LinkCategories.REDDIT);
        this.fillCategory(LinkCategories.YOUTUBE);
        this.fillCategory(LinkCategories.GITHUB);
        this.fillCategory(LinkCategories.GITLAB);
        this.fillCategory(LinkCategories.COGNITROM);
        this.fillCategory(LinkCategories.SAPIENTIA_SALOMONIS);
    }

    /**
     * Adds a link entry to the repository
     * @param {LinkEntry} entry 
     */
    add(entry) {
        if (!this.entries[entry.category]) {
            this.entries[entry.category] = [];
        }

        this.entries[entry.category].push(entry);
    }

    /**
     * @returns {LinkEntry[]} all link entries in the repository
     */
    getAll() {
        let linkCategories = Object.keys(this.entries);
        let linkEntries = [];

        for (let category of linkCategories) {
            linkEntries = linkEntries.concat(this.entries[category]);
        }

        return linkEntries;
    }

    /**
     * Fills a category with predefined link entries
     * @param {string} category 
     */
    fillCategory(category) {
        switch (category) {
            case LinkCategories.REDDIT:
                this.#fillRedditLinks();
                break;
            case LinkCategories.YOUTUBE:
                this.#fillYoutubeLinks();
                break;
            case LinkCategories.GITHUB:
                this.#fillGithubLinks();
                break;
            case LinkCategories.GITLAB:
                this.#fillGitlabLinks();
                break;
            case LinkCategories.COGNITROM:
                this.#fillCognitromLinks();
                break;
            case LinkCategories.SAPIENTIA_SALOMONIS:
                this.#fillSapientiaSalomonisLinks();
                break;
        }
    }

    #fillRedditLinks() {
        this.entries[LinkCategories.REDDIT] = [];

        this.add(new LinkEntry(["c"], "Orthodox Christianity", "https://www.reddit.com/r/OrthodoxChristianity/", LinkCategories.REDDIT));
        this.add(new LinkEntry(["j"], "Jung", "https://www.reddit.com/r/Jung/", LinkCategories.REDDIT));
        this.add(new LinkEntry(["k"], "Demon Slayer", "https://www.reddit.com/r/KimetsuNoYaiba/", LinkCategories.REDDIT));
        this.add(new LinkEntry(["l"], "Linux", "https://www.reddit.com/r/Linux/", LinkCategories.REDDIT));
        this.add(new LinkEntry(["u"], "Unix Porn", "https://www.reddit.com/r/UnixPorn/", LinkCategories.REDDIT));
        this.add(new LinkEntry(["o"], "OpenSUSE", "https://www.reddit.com/r/OpenSUSE/", LinkCategories.REDDIT));
        this.add(new LinkEntry(["p"], "Pop!_OS", "https://www.reddit.com/r/Pop_OS/", LinkCategories.REDDIT));
        this.add(new LinkEntry(["k", "d", "e"], "KDE", "https://www.reddit.com/r/KDE/", LinkCategories.REDDIT));
        this.add(new LinkEntry(["s", "d"], "Steam Deck", "https://www.reddit.com/r/SteamDeck/", LinkCategories.REDDIT));
    }

    #fillYoutubeLinks() {
        this.entries[LinkCategories.YOUTUBE] = [];

        this.add(new LinkEntry(["y"], "Home", "https://www.youtube.com/", LinkCategories.YOUTUBE));
        this.add(new LinkEntry(["j", "p"], "Jonathan Pageau Clips", "https://www.youtube.com/@JonathanPageauClips", LinkCategories.YOUTUBE));
        this.add(new LinkEntry(["j", "b", "p"], "Jordan Peterson Clips", "https://www.youtube.com/@DrJordanBPetersonClips", LinkCategories.YOUTUBE));
        this.add(new LinkEntry(["k", "l"], "Demon Slayer Lofi", "https://www.youtube.com/watch?v=q1iv8Ec9-TY", LinkCategories.YOUTUBE));
    }

    #fillGithubLinks() {
        this.entries[LinkCategories.GITHUB] = [];

        this.add(new LinkEntry(["c", "t", "s"], "Cts", "https://github.com/cognitrom/cognitrom.test.scorer", LinkCategories.GITHUB));
    }

    #fillGitlabLinks() {
        this.entries[LinkCategories.GITLAB] = [];

        this.add(new LinkEntry(["d"], "Dreamway", "https://gitlab.com/sapientia-salomonis/dreamway", LinkCategories.GITLAB));
    }

    #fillCognitromLinks() {
        this.entries[LinkCategories.COGNITROM] = [];

        this.add(new LinkEntry(["c", "o", "g"], "Drive Home", "https://drive.google.com/u/1", LinkCategories.COGNITROM));
    }

    #fillSapientiaSalomonisLinks() {
        this.entries[LinkCategories.SAPIENTIA_SALOMONIS] = [];

        this.add(new LinkEntry(["s"], "Drive Home", "https://drive.google.com/drive/u/0/folders/1-SAgdH6eBOw4ZNEXjfYSDd_EBAuhxVoX", LinkCategories.SAPIENTIA_SALOMONIS));
    }
}