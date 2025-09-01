import PlaylisterModel from './PlaylisterModel.js';
import PlaylisterView from './PlaylisterView.js';
import PlaylisterController from './PlaylisterController.js';

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
    loadListsFromJSON(jsonFilePath) {
        let xmlhttp = new XMLHttpRequest();
        let modelToUpdate = this.model;

        // THIS DEFINES A CALLBACK THAT WILL BE INVOKED ONCE
        // THE CONTENTS OF THE JSON FILE ARE ACTUALLY RECEIVED,
        // NOTE THAT THIS ONLY HAPPENS IN RESPONSE TO THE
        // open AND THEN send FUNCTIONS BEING CALLED ON A VALID
        // JSON FILE
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let lists = JSON.parse(this.responseText).playlists;

                // GO THROUGH THE DATA AND LOAD IT INTO OUR APP'S DATA MODEL
                for (let i = 0; i < lists.length; i++) {
                    let listData = lists[i];
                    let songs = [];
                    for (let j = 0; j < listData.songs.length; j++) {
                        songs[j] = listData.songs[j];
                    }
                    modelToUpdate.addNewList(listData.name, songs);
                }
            }
        };
        xmlhttp.open("GET", jsonFilePath, true);
        xmlhttp.send();
    }

    /**
     * Sets up the application for use once the initial HTML file has fully loaded
     * meaning it will load the initial lists such that all needed playlist cards
     * are available.
     * 
     * @param {*} testFile The JSON file containing initial playlists of data.
     */
    start() {
        // DISABLE ALL RELEVANT 
        this.view.init();

        // FIRST TRY AND GET THE LISTS FROM LOCAL STORAGE
        let success = this.model.loadLists();
        if (!success) {
            this.loadListsFromJSON("./data/default_lists.json");
        }
    }
}

/**
 * This callback is where our application begins as this function is invoked once the HTML page
 * has fully loaded its initial elements into the DOM.
 */
window.onload = function() {
    // MAKE THE APP AND START IT
    let app = new PlaylisterApp();
    app.start(); 
}