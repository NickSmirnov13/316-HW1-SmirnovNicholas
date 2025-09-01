import { jsTPS_Transaction } from '../../jstps/index.js';

export default class EditSong_Transaction extends jsTPS_Transaction {
  constructor(model, index, oldSong, newSong) {
    super();
    this.model = model;
    this.index = index;
    this.oldSong = { ...oldSong };
    this.newSong = { ...newSong };
  }
  doTransaction()  { this.model.updateSong(this.index, this.newSong); }
  undoTransaction() { this.model.updateSong(this.index, this.oldSong); }
}