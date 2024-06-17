var Services = {
    links: new LinkEntryService(),
    routing: new LinkRoutingService(),
    buttons: new LinkEntryButtonService(),
    ui: new UserInterfaceService(),
    keybindings: new LinkEntryKeybindingService()
}

function init() {
    let allLinks = Services.links.getAll();

    for (let link of allLinks) {
        try {
            let linkCategory = link.category;
            let categoryContainer = Services.ui.getContainerForLinkCategory(linkCategory);
            let button = new LinkEntryButton(link, categoryContainer);
            button.whenPressed(onLinkPressed)
                .whenMiddleClicked(onLinkMiddleClicked);
            Services.buttons.add(button);
        } catch (error) {
            console.error(`Error adding link ${link.url} to the user interface: ${error}`);
            console.log(link.category);
        }
    }
}

document.addEventListener('DOMContentLoaded', init);

function onLinkMiddleClicked(button, _) {
    Services.routing.openInBackgroundTab(button.linkEntry.url);
}

function onLinkPressed(button, event) {
    if (event.shiftKey) {
        Services.routing.openInBackgroundTab(button.linkEntry.url);
    } else {
        Services.routing.replaceTab(button.linkEntry.url);
    }
}
