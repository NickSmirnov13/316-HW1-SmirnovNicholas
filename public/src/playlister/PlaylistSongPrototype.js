/**
 * The PlaylistSongPrototype class is a simple data class that is used to represent
 * a song in a playlist. Note, Playlist HAS-A PlaylistSongPrototype, in fact
 * it has a whole playlist full of them (of course). Note that this class is implemented
 * using the prototype design pattern, which here means an object of this class knows
 * how to clone itself (i.e. make and return a deep copy), which provides a convenience
 * to programmers for when they wish to duplicate/copy a song during editing.
 * 
 * @author McKilla Gorilla
 */
export default class PlaylistSongPrototype {
    /**
     * Constructor for initializing all instance variables for a song object.
     * 
     * @param {string} initTitle The song title.
     * @param {string} initArtist The song artist.
     * @param {number} initYear The song release year.
     * @param {string} initYouTubeId The YouTube id for the song as it would appear in a link.
     */
    constructor(initTitle, initArtist, initYouTubeId, initYear) {
        this.title = initTitle;
        this.artist = initArtist;
        this.youTubeId = initYouTubeId;
        this.year = null;
    }

    /**
     * Clones and returns an instance of this object.
     * 
     * @returns A deep copy of this object.
     */
    clone() {
        let song = new PlaylistSongPrototype(this.title, this.artist, this.youTubeId, this.year);
        return song;
    }                    
}