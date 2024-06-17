/**
 * Handles routing of links to different pages
 */
class LinkRoutingService {
    /**
     * Opens a URL in a new background tab
     * @param {string} url 
     */
    openInBackgroundTab(url) {
        var a = document.createElement("a");
        a.href = url;
        document.body.appendChild(a);
        var evt = document.createEvent("MouseEvents");
        //the tenth parameter of initMouseEvent sets ctrl key
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0,
            true, false, false, false, 0, null);
        a.dispatchEvent(evt);
        document.body.removeChild(a);
    }

    replaceTab(url) {
        window.location.href = url;
    }
}