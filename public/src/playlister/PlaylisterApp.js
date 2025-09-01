import PlaylisterModel from './PlaylisterModel.js';
import PlaylisterView from './PlaylisterView.js';
import PlaylisterController from './PlaylisterController.js';
import PlaylistSongPrototype from './PlaylistSongPrototype.js';

/**
 * This is the entry point into our application, it launches the app by first
 * checking to see if any playlists were saved to the browsers's local storage,
 * loads them if found.
 * 
 * @author McKilla Gorilla
 */
export class PlaylisterApp {
    /**
     * Initializes the application, setting up MVC for use, but still needs to be started.
     */
    constructor() {
        // FIRST MAKE THE APP COMPONENTS
        this.model = new PlaylisterModel();
        this.view = new PlaylisterView();
        this.controller = new PlaylisterController();

        // THE MODEL NEEDS THE VIEW TO NOTIFY IT EVERY TIME DATA CHANGES
        this.model.setView(this.view);

        // THE VIEW NEEDS THE CONTROLLER TO HOOK UP HANDLERS TO ITS CONTROLS
        this.view.setController(this.controller);

        // AND THE CONTROLLER NEEDS TO MODEL TO UPDATE WHEN INTERACTIONS HAPPEN
        this.controller.setModel(this.model);
    }

    /**
     * This function loads the playlists found inside the JSON file into the app.
     * If the playlists have never been stored in local storage this function 
     * can be used to store initial playlist data for the purpose of testing 
     * using the provided lists.
    */
    loadListsFromJSON(jsonFilePath, replace = false) {
        const req = new XMLHttpRequest();
        const model = this.model;

        req.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                const lists = JSON.parse(this.responseText).playlists;

                if (replace) {
                    // clear model state so we don't append duplicates
                    model.unselectCurrentList();
                    model.playlists = [];
                    model.tps.clearAllTransactions?.();
                }

                for (const listData of lists) {
                    const songs = (listData.songs || []).map(s =>
                        new PlaylistSongPrototype(s.title, s.artist, s.youTubeId, s.year)
                    );
                    model.addNewList(listData.name, songs);
                }

                model.saveLists(); // persist the seeded data
            }
        };

        req.open("GET", jsonFilePath, true);
        req.send();
    }




    /**
     * Sets up the application for use once the initial HTML file has fully loaded
     * meaning it will load the initial lists such that all needed playlist cards
     * are available.
     * 
     * @param {*} testFile The JSON file containing initial playlists of data.
     */
    start() {
        // Disable unusable controls, etc.
        this.view.init();

        // If there is saved data, load ONLY that and stop.
        if (this.model.loadLists()) {
            return;
        }

        // Otherwise seed once from JSON (replace in-memory lists)
        this.loadListsFromJSON("./data/default_lists.json", /*replace=*/true);
    }


}

/**
 * This callback is where our application begins as this function is invoked once the HTML page
 * has fully loaded its initial elements into the DOM.
 */
window.onload = function () {
    // MAKE THE APP AND START IT
    let app = new PlaylisterApp();
    app.start();
}