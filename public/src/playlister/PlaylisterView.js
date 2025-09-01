import PlaylisterController from "./PlaylisterController.js";

/**
 * The PlaylistView class manages the view of our Web application, providing services
 * for loading data into our user interface (UI) controls and dynamically updating,
 * including creating and destroying, UI components. Note that the user interface (UI)
 * of this application is implemented using an MVC type-strategy (Observer design pattern)
 * where one class manages the application state/data (Model), one class manages the
 * application UI components (View), and one class manages the event handling (Controller).
 * 
 * @author McKilla Gorilla
 */
export default class PlaylisterView {
    /**
     * Object initialization is done via the init method rather than the constructor. Note
     * that for updating the browser view this class will make use of the document object,
     * is a global variable that represents the Document Object Model (DOM), a K-ary
     * tree initialized and provided by the browser that stores all the HTML components 
     * for the Web page currently being viewed. Updating the DOM updates what the user sees 
     * in the browser.
     */
    constructor() { }

    /**
     * Adds a playlist card to to the left sidebar in the UI.
     * 
     * @param {Playlist} newList The list to be added.
     */
    appendListToView(newList) {
        // EACH CARD WILL HAVE A UNIQUE ID
        let listId = "playlist-card-" + newList.id;

        // MAKE A DEEP COPY OF THE PROTOTYPE FOR OUR NEW PLAYLIST CARD
        let playlistCard = document.getElementById("playlist-card-prototype").cloneNode(true);
        playlistCard.id = listId;
        playlistCard.classList.add("playlist-card", "unselected-playlist-card");

        playlistCard.querySelector("span").id = "playlist-card-text-" + newList.id;
        playlistCard.querySelector("span").textContent = newList.name;

        let textInput = playlistCard.querySelector("#playlist-card-text-input-");
        textInput.id += newList.id;

        playlistCard.querySelector('input[id^="duplicate-list-button-"]').id += newList.id;

        playlistCard.querySelector('input[id^="delete-list-button-"]').id += newList.id;

        playlistCard.hidden = false;

        // AND PUT THE NEW CARD INTO THE LISTS DIV
        let listsElement = document.getElementById("playlist-cards");
        listsElement.appendChild(playlistCard);

        // SETUP THE HANDLER FOR WHEN SOMEONE MOUSE CLICKS ON OUR LIST
        this.controller.registerPlaylistCardHandlers(newList.id);


    }

    /**
     * This removes all the songs from UI workspace, which should be
     * done whenever a list is closed.
    */
    clearWorkspace() {
        // REMOVE THE ITEMS        
        let itemsDiv = document.getElementById("song-cards");
        itemsDiv.innerHTML = "";
    }

    /**
     * Closes the edit song modal, which would be because either the
     * confirm or cancel button was pressed.
     */
    closeEditSongModal() {
        // CLOSE THE MODAL
        let editSongModal = document.getElementById("edit-song-modal");
        editSongModal.classList.remove("is-visible");
    }

    /**
     * This function disables the button that has the id parameter
     * as it's id property. This should be done as part of a foolproof
     * design strategy.
     * 
     * @param {number} id The id of the button control to disable.
     */
    disableButton(id) {
        let button = document.getElementById(id);
        button.classList.add("disabled");
        button.disabled = true;
    }

    /**
     * This function enables the button that has the id parameter
     * as it's id property. This should be done as part of a foolproof
     * design strategy.
     * 
     * @param {number} id The id of the button control to enable.
     */
    enableButton(id) {
        let button = document.getElementById(id);
        button.classList.remove("disabled");
        button.disabled = false;
    }

    /**
     * Hides the textfield control on the playlist card corresponding to id.
     * 
     * @param {number} id The id of the playlist whose textfield we wish to hide.
     */
    hidePlaylistTextInput(id) {
        document.getElementById("playlist-card-text-" + id).hidden = false;
        document.getElementById("playlist-card-text-input-" + id).hidden = true;
    }

    /**
     * Changes the background of a list card to make it look selected.
     * 
     * @param {number} listId The id of the list card to highlight.
     */
    highlightList(listId) {
        // HIGHLIGHT THE LIST
        let listCard = document.getElementById("playlist-card-" + listId);
        listCard.classList.remove("unselected-playlist-card");
        listCard.classList.add("selected-playlist-card");
    }

    /**
     * The application's UI starts with the editing buttons disabled.
     */
    init() {
        this.disableButton('add-song-button');
        this.disableButton('undo-button');
        this.disableButton('redo-button');
        this.disableButton('close-button');
    }

    /**
     * This function is called each time the number of lists or the names
     * of lists change, like when a list is added, deleted, or renamed. It
     * simply rebuilds the cards in playlist-cards.
     * 
     * @param {Playlist[]} lists All the lists to be shown.
    */
    refreshPlaylistCards(lists) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("playlist-cards");
        listsElement.innerHTML = "";

        // APPEND A SELECTION CARD FOR EACH PLAYLIST
        for (let i = 0; i < lists.length; i++) {
            let list = lists[i];
            this.appendListToView(list);
        }
    }

    /**
     * Called each time a song is added, removed, moved, or updated,
     * this function rebuilds all the song cards for the selected playlist.
     * 
     * @param {Playlist} playlist The playlist whose songs are to be reshown.
     */
    refreshSongCards(playlist) {
        const itemsDiv = document.getElementById("song-cards");
        itemsDiv.innerHTML = "";

        const proto = document.getElementById("song-card-prototype");
        if (!proto) return;

        const len = Array.isArray(playlist?.songs) ? playlist.songs.length : 0;

        for (let i = 0; i < len; i++) {
            const song = playlist.getSongAt(i);
            if (!song) continue;

            const card = proto.cloneNode(true);
            card.hidden = false;
            card.id = `song-card-${i + 1}`;
            // number as text node
            card.insertBefore(document.createTextNode(`${i + 1}. `), card.firstChild);

            const titleA = card.querySelector(".song-card-title");
            titleA.id = `song-card-title-${i + 1}`;
            titleA.href = `https://www.youtube.com/watch?v=${song.youTubeId ?? ""}`;
            titleA.target = 1;
            titleA.textContent = song.title ?? "Untitled";

            const yearSpan = card.querySelector(".song-card-year");
            yearSpan.id = `song-card-year-${i + 1}`;
            const yr = song.year;
            yearSpan.textContent =
                (yr !== undefined && yr !== null && `${yr}`.trim() !== "") ? ` (${yr})` : "";

            const artistSpan = card.querySelector(".song-card-artist");
            artistSpan.id = `song-card-artist-${i + 1}`;
            artistSpan.textContent = song.artist ?? "???";

            const removeBtn = card.querySelector('input[id^="remove-song-"]');
            removeBtn.id = `remove-song-${i}`;

            itemsDiv.appendChild(card);
        }

        this.controller.registerSongCardHandlers();
    }







    /**
     * When UI controls are dynamically created by this object they may need
     * to register event handlers, like for songs in the playlist. Thus, when
     * view components are created they will have to wire proper coded responses
     * in the controller. This method sets the controller to use for our MVC
     * implementation.
     * 
     * @param {PlaylisterController} initController The controller object that
     * will manage event handling for the application. The view needs this to
     * connect its components to the proper event handling.
     */
    setController(initController) {
        this.controller = initController;
    }

    /**
     * Shows the textfield control on the playlist card corresponding to id.
     * 
     * @param {number} id The id of the playlist whose textfield we wish to show.
     */
    showPlaylistTextInput(id) {
        document.getElementById("playlist-card-text-" + id).hidden = true;
        document.getElementById("playlist-card-text-input-" + id).hidden = false;
    }

    /**
     * Changes the background of a list card so it doesn't look selected.
     * 
     * @param {number} listId The id of the list card no remove highlighting.
     */
    unhighlightList(listId) {
        // HIGHLIGHT THE LIST
        let listCard = document.getElementById("playlist-card-" + listId);
        listCard.classList.add("unselected-playlist-card");
        listCard.classList.remove("selected-playlist-card");
    }

    /**
     * Displays the name of the loaded list in the status bar.
     */
    updateStatusBar(hasCurrentList, currentListName) {
        let statusBar = document.getElementById("statusbar");
        if (hasCurrentList) {
            statusBar.innerHTML = currentListName;
        } else {
            statusBar.innerHTML = '';
        }
    }

    /**
     * Implements our foolproof design strategy so that when toolbar
     * buttons cannot be used they are disabled.
     */
    /**
 * Implements our foolproof design strategy so that when toolbar
 * buttons cannot be used they are disabled.
 */
    updateToolbarButtons(hasCurrentList, isConfirmDialogOpen, hasTransactionToDo, hasTransactionToUndo) {
        // === Add List Button ===
        if (isConfirmDialogOpen) {
            // if a list name is being edited (or confirm dialog open), disable
            this.disableButton("add-playlist-button");
        } else {
            this.enableButton("add-playlist-button");
        }

        // === Add Song Button ===
        if (hasCurrentList) {
            this.enableButton("add-song-button");
        } else {
            this.disableButton("add-song-button");
        }

        // === Undo Button ===
        if (hasTransactionToUndo) {
            this.enableButton("undo-button");
        } else {
            this.disableButton("undo-button");
        }

        // === Redo Button ===
        if (hasTransactionToDo) {
            this.enableButton("redo-button");
        } else {
            this.disableButton("redo-button");
        }

        // === Close List Button ===
        if (hasCurrentList) {
            this.enableButton("close-button");
        } else {
            this.disableButton("close-button");
        }
    }


    setController(initController) {
        this.controller = initController;
        // hook up the add-playlist-button to controller
        let addButton = document.getElementById("add-playlist-button");
        addButton.onclick = () => this.controller.processAddPlaylist();
    }



}