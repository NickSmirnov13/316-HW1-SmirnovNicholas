/**
 * This class provides responses for all user interface interactions.
 * 
 * @author McKilla Gorilla
 */
export default class PlaylisterController {
    constructor() { }

    /**
     * This function makes sure the event doesn't get propogated to other controls.
     */
    ignoreParentClick(event) {
        event.cancelBubble = true;
        if (event.stopPropagation) event.stopPropagation();
    }

    /**
     * This function defines the event handlers that will respond to interactions
     * with all the static user interface controls, meaning the controls that
     * exist in the original Web page. Note that additional handlers will need
     * to be initialized for the dynamically loaded content, like for controls
     * that are built as the user interface is interacted with.
     */
    registerStaticHandlers() {
        // SETUP THE TOOLBAR BUTTON HANDLERS
        this.registerEditToolbarHandlers();

        // SETUP THE MODAL HANDLERS
        this.registerModalHandlers();
    }

    /**
     * Specifies event handlers for buttons in the toolbar.
     */
    registerEditToolbarHandlers() {
        // HANDLER FOR ADDING A NEW SONG BUTTON
        document.getElementById("add-song-button").onmousedown = (event) => {
            this.model.addTransactionToCreateSong();
        }
        // HANDLER FOR UNDO BUTTON
        document.getElementById("undo-button").onmousedown = (event) => {
            this.model.undo();
        }
        // HANDLER FOR REDO BUTTON
        document.getElementById("redo-button").onmousedown = (event) => {
            this.model.redo();
        }
        // HANDLER FOR CLOSE LIST BUTTON
        document.getElementById("close-button").onmousedown = (event) => {
            // this.model.unselectAll();
            this.model.unselectCurrentList();
        }
    }

    /**
     * Specifies  event handlers for when confirm and cancel buttons
     * are pressed in the three modals.
     */
    registerModalHandlers() {
        // RESPOND TO THE USER CLOSING THE EDIT SONG MODAL VIA THE CANCEL BUTTON
        document.getElementById("edit-song-cancel-button").onclick = (event) => {
            // ALLOW OTHER INTERACTIONS
            this.model.toggleConfirmDialogOpen();

            // CLOSE THE MODAL
            const editSongModal = document.getElementById("edit-song-modal");
            editSongModal.classList.remove("is-visible");
        };

        const okBtn = document.getElementById("edit-song-confirm-button");
        if (okBtn) {
            okBtn.onclick = () => {
                const idx = this.model.getEditSongIndex();
                const title = document.getElementById("edit-song-modal-title-textfield")?.value;
                const artist = document.getElementById("edit-song-modal-artist-textfield")?.value;
                const youTubeId = document.getElementById("edit-song-modal-youTubeId-textfield")?.value;
                const year = document.getElementById("edit-song-modal-year-textfield")?.value;

                this.model.addTransactionToEditSong(idx, { title, artist, youTubeId, year });

                this.model.toggleConfirmDialogOpen();
                document.getElementById("edit-song-modal").classList.remove("is-visible");
            };
        }

        // REMOVE SONG — CONFIRM
        document.getElementById("remove-song-confirm-button").onclick = (event) => {
            const idx = this.model.getRemoveSongIndex();
            if (idx != null) {
                this.model.addTransactionToRemoveSong(idx); // undoable
            }

            // Allow other interactions + close modal
            this.model.toggleConfirmDialogOpen();
            document.getElementById("remove-song-modal").classList.remove("is-visible");
        };

        // REMOVE SONG — CANCEL
        document.getElementById("remove-song-cancel-button").onclick = (event) => {
            this.model.toggleConfirmDialogOpen();
            document.getElementById("remove-song-modal").classList.remove("is-visible");
        };


        // === Pressing ENTER in any field should Confirm ===
        const editFieldIds = [
            "edit-song-modal-title-textfield",
            "edit-song-modal-artist-textfield",
            "edit-song-modal-youTubeId-textfield",
            "edit-song-modal-year-textfield",
        ];
        editFieldIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) {
                el.onkeydown = (e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        okBtn?.click(); // trigger the same confirm flow
                    }
                };
            }
        });

        // RESPOND TO THE USER CONFIRMING TO DELETE A PLAYLIST
        document.getElementById("delete-list-confirm-button").onclick = (event) => {
            const deleteListId = this.model.getDeleteListId();
            this.model.deleteList(deleteListId);
            this.model.toggleConfirmDialogOpen();
            const deleteListModal = document.getElementById("delete-list-modal");
            deleteListModal.classList.remove("is-visible");
        };

        // RESPOND TO THE USER CLOSING THE DELETE PLAYLIST MODAL
        document.getElementById("delete-list-cancel-button").onclick = (event) => {
            this.model.toggleConfirmDialogOpen();
            const deleteListModal = document.getElementById("delete-list-modal");
            deleteListModal.classList.remove("is-visible");
        };
    }



    /**
     * This function specifies event handling for interactions with a
     * list selection controls in the left toolbar. Note that we say these
     * are for dynamic controls because the items in the playlists list is
     * not known, it can be any number of items. It's as many items as there
     * are playlists, and users can add new playlists and delete playlists.
     * Note that the id provided must be the id of the playlist for which
     * to register event handling.
    */
    registerPlaylistCardHandlers(id) {
        // HANDLES SELECTING A PLAYLIST
        document.getElementById("playlist-card-" + id).onmousedown = (event) => {
            if (!this.model.isListNameBeingChanged()) {
                // MAKE SURE NOTHING OLD IS SELECTED
                this.model.unselectCurrentList();

                // GET THE SELECTED LIST
                this.model.loadList(id);
            }
        }
        // HANDLES DELETING A PLAYLIST
        document.getElementById("delete-list-button-" + id).onmousedown = (event) => {
            // DON'T PROPOGATE THIS INTERACTION TO LOWER-LEVEL CONTROLS
            this.ignoreParentClick(event);

            // RECORD THE ID OF THE LIST THE USER WISHES TO DELETE
            // SO THAT THE MODAL KNOWS WHICH ONE IT IS
            this.model.setDeleteListId(id);

            // VERIFY THAT THE USER REALLY WANTS TO DELETE THE PLAYLIST
            // THE CODE BELOW OPENS UP THE LIST DELETE VERIFICATION DIALOG
            this.listToDeleteIndex = this.model.getListIndex(id);
            let listName = this.model.getList(this.listToDeleteIndex).getName();
            let deleteSpan = document.getElementById("delete-list-span");
            deleteSpan.innerHTML = "";
            deleteSpan.appendChild(document.createTextNode(listName));
            let deleteListModal = document.getElementById("delete-list-modal");

            // OPEN UP THE DIALOG
            deleteListModal.classList.add("is-visible");
            this.model.toggleConfirmDialogOpen();
        }
        // FOR RENAMING THE LIST NAME
        document.getElementById("playlist-card-" + id).ondblclick = (event) => {
            let text = document.getElementById("playlist-card-text-" + id)
            // CLEAR THE TEXT
            text.innerHTML = "";

            // SHOW THE TEXT FIELD
            this.model.setListNameBeingChanged(true, id);
            let textInput = document.getElementById("playlist-card-text-input-" + id);
            textInput.focus();
            textInput.value = this.model.getPlaylist(id).name;
        }

        // SPECIFY HANDLERS FOR THE TEXT FIELD
        let textInput = document.getElementById("playlist-card-text-input-" + id);
        textInput.ondblclick = (event) => {
            this.ignoreParentClick(event);
        }
        textInput.onkeydown = (event) => {
            if (event.key === 'Enter') {
                this.model.setListNameBeingChanged(false, id);
                this.model.renameCurrentList(event.target.value);//, id);
            }
        }
        textInput.onblur = (event) => {
            this.model.setListNameBeingChanged(false, id);
            this.model.renameCurrentList(event.target.value);//, id);
        }
        const dupBtn = document.getElementById(`duplicate-list-button-${id}`);
        if (dupBtn) {
            dupBtn.onclick = (e) => {
                e.stopPropagation();               // don’t trigger “open” on the card click
                this.model.duplicatePlaylist(id);
            };
        }

    }

    /**
     * This function specifies event handling for interactions with the playlist 
     * song cards. Note that we say these are for dynamic controls because the cards 
     * in the playlist are not known, it can be any number of songs. It's as many 
     * cards as there are songs in the playlist, and users can add and remove songs.
    */
    registerSongCardHandlers() {
        // SETUP THE HANDLERS FOR ALL SONG CARDS, WHICH ALL GET DONE
        // AT ONCE EVERY TIME DATA CHANGES, SINCE IT GETS REBUILT EACH TIME
        for (let i = 0; i < this.model.getPlaylistSize(); i++) {
            // GET THE CARD
            let card = document.getElementById("song-card-" + (i + 1));

            // USER WANTS TO EDIT THE SONG
            card.ondblclick = (event) => {
                this.ignoreParentClick(event);

                // Always use the card's id, not event.target.id
                const cardId = card.id; // e.g., "song-card-3"
                const songIndex = parseInt(cardId.split("-")[2], 10) - 1;

                this.model.setEditSongIndex(songIndex);
                const song = this.model.getSong(songIndex);

                document.getElementById("edit-song-modal-title-textfield").value = song.title;
                document.getElementById("edit-song-modal-artist-textfield").value = song.artist;
                document.getElementById("edit-song-modal-youTubeId-textfield").value = song.youTubeId;
                document.getElementById("edit-song-modal-year-textfield").value =
                    (song.year != null ? song.year : "");

                const editSongModal = document.getElementById("edit-song-modal");
                editSongModal.classList.add("is-visible");
                this.model.toggleConfirmDialogOpen();
            };



            // USER WANTS TO REMOVE A SONG FROM THE PLAYLIST
            let removeSongButton = document.getElementById("remove-song-" + i);
            removeSongButton.onclick = (event) => {
                this.ignoreParentClick(event);

                // Which song?
                const songIndex = Number.parseInt(event.target.id.split("-")[2]);
                this.model.setRemoveSongIndex(songIndex);

                // Fill the modal text with the song's title (and maybe artist)
                const song = this.model.getSong(songIndex);
                const span = document.getElementById("remove-song-span");
                span.innerHTML = ""; // reset
                const label = `${song.title} by ${song.artist}`;
                span.appendChild(document.createTextNode(label));

                // Show modal + disable other interactions
                const modal = document.getElementById("remove-song-modal");
                modal.classList.add("is-visible");
                this.model.toggleConfirmDialogOpen();
            };


            // NOW SETUP ALL CARD DRAGGING HANDLERS AS THE USER MAY WISH TO CHANGE
            // THE ORDER OF SONGS IN THE PLAYLIST

            // MAKE EACH CARD DRAGGABLE
            card.setAttribute('draggable', 'true')

            // WHEN DRAGGING STARTS RECORD THE INDEX
            card.ondragstart = (event) => {
                card.classList.add("is-dragging");
                event.dataTransfer.setData("from-id", i);
            }

            // WE ONLY WANT OUR CODE, NO DEFAULT BEHAVIOR FOR DRAGGING
            card.ondragover = (event) => {
                event.preventDefault();
            }

            // STOP THE DRAGGING LOOK WHEN IT'S NOT DRAGGING
            card.ondragend = (event) => {
                card.classList.remove("is-dragging");
            }

            // WHEN AN ITEM IS RELEASED WE NEED TO MOVE THE CARD
            card.ondrop = (event) => {
                event.preventDefault();
                // GET THE INDICES OF WHERE THE CARD IS BRING DRAGGED FROM AND TO
                let fromIndex = Number.parseInt(event.dataTransfer.getData("from-id"));
                let toIndex = Number.parseInt(event.target.id.split("-")[2]) - 1;

                // ONLY ADD A TRANSACTION IF THEY ARE NOT THE SAME
                // AND BOTH INDICES ARE VALID
                if ((fromIndex !== toIndex)
                    && !isNaN(fromIndex)
                    && !isNaN(toIndex)) {
                    this.model.addTransactionToMoveSong(fromIndex, toIndex);
                }
            }
        }
    }

    /**
     * We are using an MVC-type approach, so this controller class will respond by 
     * updating the application data, which is managed by the model class. So, this 
     * function registers the model object with this controller.
     */
    setModel(initModel) {
        this.model = initModel;
        this.registerStaticHandlers();
    }

    processAddPlaylist() {
        this.model.addNewPlaylist("Untitled");
    }

}