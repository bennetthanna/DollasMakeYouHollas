import React, { Component } from 'react';
import firebase from './firebase.js';
import uuid from 'uuid/v4';
import { animals, adjectives, verbs, nouns, exclamations } from './randomWords';

class LoggedIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      notes: { },
      currentNote: null
    }

    const user = firebase.auth().currentUser;

    this.currentUser = {};
    this.logOut = this.logOut.bind(this);
    this.createNote = this.createNote.bind(this);
    this.updateNote = this.updateNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.selectNote = this.selectNote.bind(this);

    if (user != null) {
      this.currentUser.name = user.displayName;
      this.currentUser.email = user.email;
      this.currentUser.photoUrl = user.photoURL;
      this.currentUser.emailVerified = user.emailVerified;
      this.currentUser.uid = user.uid; 
    }
  }

  componentDidMount() {
    firebase.database().ref('notes/').on('value', snapShot => {
      const first = Object.keys(snapShot.val())[0];
      const currentNote = this.state.currentNote || first;
      this.setState({ isLoaded: true, notes: snapShot.val(), currentNote });
    });
  }

  logOut(event) {
    const logOut = this.props.logOut;
    event.preventDefault();
    firebase.auth().signOut()
      .then(user => {
        logOut();
      })
      .catch(error => {
        alert(`ERROR: ${error}`);
      });
  }

  createNote(event) {
    const id = uuid();
    firebase.database().ref(`notes/${id}`).set(this.generateNote());
    this.setState({ currentNote: id });
  }

  generateNote() {
    const title = `The ${this.generateRandomWord(adjectives)} ${this.generateRandomWord(animals)}`;
    const body = `${title} ${this.generateRandomWord(verbs)} the ${this.generateRandomWord(nouns)} and exclaimed "${this.generateRandomWord(exclamations)}"!`;
    return { title, body };
  }

  generateRandomWord(words) {
    return words[Math.floor(Math.random() * Math.floor(words.length))];
  }

  updateNote(event, noteId) {
    event.preventDefault();
    firebase.database().ref(`notes/${noteId}`).update(this.generateNote());
  }

  deleteNote(event, noteId) {
    event.preventDefault();
    firebase.database().ref(`notes/${noteId}`).remove();
    const notes = this.state.notes;
    delete notes[noteId];
    const first = Object.keys(notes)[0];
    this.setState({ notes, currentNote: first });
  }

  selectNote(event, noteId) {
    event.preventDefault();
    this.setState({ currentNote: noteId });
  }

  renderList() {
    const { notes } = this.state;
    const selectNote = this.selectNote;
    const currentNoteId = this.state.currentNote;
    return (
      <ul className="list-group list-group-flush">
        {Object.keys(notes).map((noteId, index) => {
          return (
            <div key={index}>
              <button type="button" className={currentNoteId === noteId ? 'list-group-item list-group-item-action active' : 'list-group-item list-group-item-action'} onClick={(event) => selectNote(event, noteId)}>{notes[noteId].title}</button>
            </div>
          )
        })}
      </ul>
    );
  };

  render() {
    const currentNoteId = this.state.currentNote;
    const currentNote = this.state.notes[currentNoteId];

    return (
      <div className="row">
      <div className="card w-25">
        <div className="card-header">
          <button id="createNote" onClick={this.createNote}>Create Note</button>
        </div>
        { this.state.isLoaded ? this.renderList() : null }
      </div>
      <div className="card w-75">
        <div className="card-header">
          <div className="row justify-content-around">
            <div className="col">
              <button id="updateNote" onClick={(event) => this.updateNote(event, currentNoteId)}>Update Note</button>
            </div>
            <div className="col">
              <button id="deleteNote" onClick={(event) => this.deleteNote(event, currentNoteId)}>Delete Note</button>
            </div>
          </div>
        </div>
        <div className="card-body">
          <h5 className="card-title">{ this.state.isLoaded ? `${currentNote.title}` : null }</h5>
          <p className="card-text">{ this.state.isLoaded ? `${currentNote.body}` : null }</p>
        </div>
      </div>
      <div className="card w-100 logOutButtonContainer">
          <button className="logOutButton" id="logOut" onClick={this.logOut}>Log Out</button>
      </div>
    </div>
    );
  }
}

export default LoggedIn;
