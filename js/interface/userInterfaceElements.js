class UserInterfaceElements {
    /**
     * @type {HTMLTableElement}
     */
    #linksTable;
    /**
     * @type {HTMLTableRowElement}
     */
    #entertainmentLinksRow;
    /**
     * @type {HTMLTableRowElement}
     */
    #codingLinksRow;
    /**
     * @type {HTMLTableRowElement}
     */
    #driveLinksRow;

    /**
     * @type {HTMLTableCellElement}
     */
    #redditLinksColumn;
    /**
     * @type {HTMLTableCellElement}
     */
    #youtubeLinksColumn;
    /**
     * @type {HTMLTableCellElement}
     */
    #githubLinksColumn;
    /**
     * @type {HTMLTableCellElement}
     */
    #gitlabLinksColumn;
    /**
     * @type {HTMLTableCellElement}
     */
    #cognitromLinksColumn;
    /**
     * @type {HTMLTableCellElement}
     */
    #sapientiaSalomonisLinksColumn;

    /**
     * @type {HTMLDivElement}
     */
    #redditContainer;
    /**
     * @type {HTMLDivElement}
     */
    #youtubeContainer;
    /**
     * @type {HTMLDivElement}
     */
    #githubContainer;
    /**
     * @type {HTMLDivElement}
     */
    #gitlabContainer;
    /**
     * @type {HTMLDivElement}
     */
    #cognitromContainer;
    /**
     * @type {HTMLDivElement}
     */
    #sapientiaSalomonisContainer;

    get linksTable() {
        if (!this.#linksTable) {
            this.#linksTable = document.getElementById("links-table");
        }
        return this.#linksTable;
    }

    get entertainmentLinksRow() {
        if (!this.#entertainmentLinksRow) {
            this.#entertainmentLinksRow = document.getElementById("entertainment-links-row");
        }
        return this.#entertainmentLinksRow;
    }

    get codingLinksRow() {
        if (!this.#codingLinksRow) {
            this.#codingLinksRow = document.getElementById("coding-links-row");
        }
        return this.#codingLinksRow;
    }

    get driveLinksRow() {
        if (!this.#driveLinksRow) {
            this.#driveLinksRow = document.getElementById("drive-links-row");
        }
        return this.#driveLinksRow;
    }

    get redditLinksColumn() {
        if (!this.#redditLinksColumn) {
            this.#redditLinksColumn = document.getElementById("reddit-links-column");
        }
        return this.#redditLinksColumn;
    }

    get youtubeLinksColumn() {
        if (!this.#youtubeLinksColumn) {
            this.#youtubeLinksColumn = document.getElementById("youtube-links-column");
        }
        return this.#youtubeLinksColumn;
    }

    get githubLinksColumn() {
        if (!this.#githubLinksColumn) {
            this.#githubLinksColumn = document.getElementById("github-links-column");
        }
        return this.#githubLinksColumn;
    }

    get gitlabLinksColumn() {
        if (!this.#gitlabLinksColumn) {
            this.#gitlabLinksColumn = document.getElementById("gitlab-links-column");
        }
        return this.#gitlabLinksColumn;
    }

    get cognitromLinksColumn() {
        if (!this.#cognitromLinksColumn) {
            this.#cognitromLinksColumn = document.getElementById("cognitrom-links-column");
        }
        return this.#cognitromLinksColumn;
    }

    get sapientiaSalomonisLinksColumn() {
        if (!this.#sapientiaSalomonisLinksColumn) {
            this.#sapientiaSalomonisLinksColumn = document.getElementById("sapientia-salomonis-links-column");
        }
        return this.#sapientiaSalomonisLinksColumn;
    }

    get redditContainer() {
        if (!this.#redditContainer) {
            this.#redditContainer = document.getElementById("reddit-container");
        }
        return this.#redditContainer;
    }

    get youtubeContainer() {
        if (!this.#youtubeContainer) {
            this.#youtubeContainer = document.getElementById("youtube-container");
        }
        return this.#youtubeContainer;
    }

    get githubContainer() {
        if (!this.#githubContainer) {
            this.#githubContainer = document.getElementById("github-container");
        }
        return this.#githubContainer;
    }

    get gitlabContainer() {
        if (!this.#gitlabContainer) {
            this.#gitlabContainer = document.getElementById("gitlab-container");
        }
        return this.#gitlabContainer;
    }

    get cognitromContainer() {
        if (!this.#cognitromContainer) {
            this.#cognitromContainer = document.getElementById("cognitrom-container");
        }
        return this.#cognitromContainer;
    }

    get sapientiaSalomonisContainer() {
        if (!this.#sapientiaSalomonisContainer) {
            this.#sapientiaSalomonisContainer = document.getElementById("sapientia-salomonis-container");
        }
        return this.#sapientiaSalomonisContainer;
    }
}