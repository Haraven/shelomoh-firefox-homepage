var Services = {
    links: new LinkEntryService(),
    routing: new LinkRoutingService(),
    buttons: new LinkEntryButtonService(),
    ui: new UserInterfaceService()
}

function init() {
    let allLinks = Services.links.getAll();

    for (let link of allLinks) {
        try {
            let linkCategory = link.category;
            let categoryContainer = Services.ui.getContainerForLinkCategory(linkCategory);
            let button = new LinkEntryButton(link, categoryContainer);
            button.whenPressed((button) => Services.routing.openInBackgroundTab(button.linkEntry.url));
            Services.buttons.add(button);
        } catch (error) {
            console.error(`Error adding link ${link.url} to the user interface: ${error}`);
            console.log(link.category);
        }
    }
}

document.addEventListener('DOMContentLoaded', init);