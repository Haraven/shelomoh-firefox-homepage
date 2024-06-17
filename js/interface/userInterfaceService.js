/**
 * @class UserInterfaceService exposes the user interface HTML elements.
 * 
 * @property {UserInterfaceElements} uiElements - The user interface elements.
 */
class UserInterfaceService {
    constructor() {
        this.uiElements = new UserInterfaceElements();
    }

    /**
     * Searches through the user interface elements to find the container for the given category (see {@link LinkCategories}).
     * @param {string} linkCategory 
     * @returns {HTMLElement}
     */
    getContainerForLinkCategory(linkCategory) {
        switch (linkCategory) {
            case LinkCategories.REDDIT:
                return this.uiElements.redditContainer;
            case LinkCategories.YOUTUBE:
                return this.uiElements.youtubeContainer;
            case LinkCategories.GITHUB:
                return this.uiElements.githubContainer;
            case LinkCategories.GITLAB:
                return this.uiElements.gitlabContainer;
            case LinkCategories.COGNITROM:
                return this.uiElements.cognitromContainer;
            case LinkCategories.SAPIENTIA_SALOMONIS:
                return this.uiElements.sapientiaSalomonisContainer;
            default:
                return null;
        }
    }
}