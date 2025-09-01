import { jsTPS_Transaction } from '../../jstps/index.js';
import PlaylistSongPrototype from '../PlaylistSongPrototype.js';

export default class RemoveSong_Transaction extends jsTPS_Transaction {
  constructor(model, index, initSong) {
    super();
    this.model = model;
    this.index = Number.isInteger(index) ? index : -1;

    // Normalize the song we’ll need for undo
    if (initSong && typeof initSong.clone === 'function') {
      this.song = initSong.clone();
    } else if (initSong) {
      this.song = new PlaylistSongPrototype(
        initSong.title ?? "Untitled",
        initSong.artist ?? "???",
        initSong.youTubeId ?? "dQw4w9WgXcQ",
        initSong.year ?? null
      );
    } else {
      this.song = null;
    }
  }

  doTransaction() {
    if (this.index >= 0) this.model.removeSong(this.index);
  }

  undoTransaction() {
    if (this.index >= 0 && this.song) this.model.createSong(this.index, this.song);
  }
}
