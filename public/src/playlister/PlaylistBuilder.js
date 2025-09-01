import Playlist from "./Playlist.js";
import PlaylistSongPrototype from "./PlaylistSongPrototype.js";
/**
 * The PlaylistBuilder class employs the Buildler creational design pattern to manage
 * all instantiation of Playlists. It is the only place Playlist objects are to be
 * created. Note, this class is a singleton.
 * 
 * @author McKilla Gorilla
 */
export default class PlaylistBuilder {
    /**
     * Constructor will make sure this type is only instantiated once, for the singleton object.
     * 
     * @returns {PlaylistBuilder} The singelton object, which may need to be instantiated but
     * will only be instantiated once.
     */
    constructor() {
        if (PlaylistBuilder.singleton) {
            return PlaylistBuilder.singleton;
        }
        PlaylistBuilder.singleton = this;
        
        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST
        this.nextListId = 0;
    }

    /**
     * Accessor for getting the singleton object.
     * 
     * @returns {PlaylistBuilder} The singleton object of this class type.
     */
    static getSingleton() {
        if (!PlaylistBuilder.singleton) {
            PlaylistBuilder.singleton = new PlaylistBuilder();
        }
        return PlaylistBuilder.singleton;
    }

    /**
     * Builder function for creating a brand new Playlist with the provided name.
     * 
     * @param {string} initName Name for the brand new Playlist.
     * @returns {Playlist} The newly created Playlist.
     */
    buildNewPlaylist(initName) {
        let newPlaylist = this.buildPlaylistWithId(this.nextListId++, initName, []);
        return newPlaylist;
    }

    /**
     * Builder function for creating a brand new Playlist with the provided name and songs.
     * 
     * @param {string} initName Name for the brand new Playlist.
     * @param {PlaylistSongPrototype[]} initSongs Songs for the brand new Playlist.
     * @returns {Playlist} The newly created Playlist.
     */
    buildPlaylist(initName, initSongs) {
        let newPlaylist = this.buildPlaylistWithId(this.nextListId++, initName, initSongs);
        return newPlaylist;
    }

    /**
     * Builder function for creating a new Playlist with the provided name and songs.
     * 
     * @param {number} initId Unique identifier of the Playlist to create.
     * @param {string} initName Name of the Playlist to create.
     * @param {string} initSongs Songs for the Playlist to create.
     * 
     * @returns 
     */
    buildPlaylistWithId(initId, initName, initSongs) {
        let newPlaylist = new Playlist(initId);
        newPlaylist.name = initName;
        newPlaylist.songs = [];
        initSongs.forEach(song => {
            let newSong = new PlaylistSongPrototype(song.title, song.artist, song.youTubeId, song.year);
            newPlaylist.songs.push(newSong);
        });
        return newPlaylist;
    }
}