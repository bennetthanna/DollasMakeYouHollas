import React, { Component } from 'react';
import firebase from './firebase.js';
import uuid from 'uuid/v4';
import { animals, adjectives, verbs, nouns, exclamations } from './randomWords';
import _ from 'lodash';

class LoggedIn extends Component {
  constructor(props) {
    super(props);

    const user = firebase.auth().currentUser;

    this.state = {
      isLoaded: false,
      notes: { },
      currentNote: null,
      selectedFile: null,
      displayedImage: 0,
      uploadProgress: 0,
      currentUser: user.uid
    }

    this.currentUser = {};
    this.logOut = this.logOut.bind(this);
    this.createNote = this.createNote.bind(this);
    this.updateNote = this.updateNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.selectNote = this.selectNote.bind(this);
    this.attachFile = this.attachFile.bind(this);
    this.nextImage = this.nextImage.bind(this);
    this.previousImage = this.previousImage.bind(this);
  }

  componentDidMount() {
    const currentUser = this.state.currentUser;
    firebase.database().ref(`${currentUser}/`).on('value', snapShot => {
      if (_.isNil(snapShot.val())) {
        return;
      }
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
    const currentUser = this.state.currentUser;
    const id = uuid();
    firebase.database().ref(`${currentUser}/${id}`).set(this.generateNote());
    this.setState({ currentNote: id });
  }

  generateNote() {
    const title = `The ${this.generateRandomWord(adjectives)} ${this.generateRandomWord(animals)}`;
    const body = `${title} ${this.generateRandomWord(verbs)} the ${this.generateRandomWord(nouns)} and exclaimed "${this.generateRandomWord(exclamations)}!"`;
    return { title, body };
  }

  generateRandomWord(words) {
    return words[Math.floor(Math.random() * Math.floor(words.length))];
  }

  updateNote(event, noteId, params) {
    event.preventDefault();
    const currentUser = this.state.currentUser;
    firebase.database().ref(`${currentUser}/${noteId}`).update(params || this.generateNote());
  }

  deleteNote(event, noteId) {
    event.preventDefault();
    const currentUser = this.state.currentUser;
    firebase.database().ref(`${currentUser}/${noteId}`).remove();
    const notes = this.state.notes;
    delete notes[noteId];
    if (_.isEmpty(notes)) {
      this.setState({ isLoaded: false, notes });
      return;
    }
    const first = Object.keys(notes)[0];
    this.setState({ notes, currentNote: first });
  }

  selectNote(event, noteId) {
    event.preventDefault();
    this.setState({ currentNote: noteId, displayedImage: 0 });
  }

  attachFile(event, noteId) {
    event.preventDefault();
    const currentUser = this.state.currentUser;
    const rootReference = firebase.storage().ref();
    const fileName = _.get(event.target, 'files[0].name');
    this.setState({ selectedFile: fileName });
    const fileReference = rootReference.child(`${currentUser}/${noteId}/${fileName}`);
    const uploadTask = fileReference.put(event.target.files[0]);
    uploadTask.on('state_changed', {
      'next': (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.setState({ uploadProgress: Math.round(progress) });
      },
      'error': (error) => {
        alert(`ERROR: ${error}`);
      },
      'complete': () => {
        this.setState({ selectedFile: null, uploadProgress: 0 });
        rootReference.child(`${currentUser}/${noteId}/${fileName}`).getDownloadURL()
          .then(fileUrl => {
            let attachedFiles = this.state.notes[noteId].files;
            attachedFiles = attachedFiles ? _.concat(attachedFiles, [fileUrl]) : [fileUrl];
            this.updateNote(event, noteId, { files: attachedFiles });
          })
          .catch(error => alert(`ERROR: ${error}`));
      }
    });
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

  nextImage(event, numImages) {
    const displayedImage = this.state.displayedImage;
    const nextImage = (displayedImage + 1) % numImages;
    this.setState({ displayedImage: nextImage });
  }

  previousImage(event, numImages) {
    const displayedImage = this.state.displayedImage;
    const previousImage = (((displayedImage - 1) % numImages) + numImages) % numImages;
    this.setState({ displayedImage: previousImage });
  }

  renderFileUpload() {
    const currentNoteId = this.state.currentNote;
    const uploadProgress = this.state.uploadProgress;
    const selectedFile = this.state.selectedFile;

    const progressBar = {
      width: `${uploadProgress}%`
    };

    return (
      <div className="custom-file">
        <input type="file" className="custom-file-input" id="attachFile" onChange={(event) => this.attachFile(event, currentNoteId)} required></input>
        <label className="custom-file-label" htmlFor="attachFile">{ selectedFile || 'Choose file...' }</label>
        <div className="progress">
          <div className="progress-bar progress-bar-striped bg-info" style={progressBar}></div>
        </div>
      </div>
    )
  }

  renderFiles() {
    const currentNoteId = this.state.currentNote;
    const attachedFiles = this.state.notes[currentNoteId].files;
    const displayedImage = this.state.displayedImage;
    const numImages = attachedFiles.length;

    return (
      <div id="attachedImages" className="carousel slide" data-ride="carousel">
        <div className="carousel-inner">
          {attachedFiles.map((file, index) => {
            return (
              <div key={index} className={displayedImage === index ? 'carousel-item active' : 'carousel-item'}>
                <img src={file} className="d-block w-100" alt="{index}"></img>
              </div>
            )
          })}
        </div>
        <button className="carousel-control-prev" onClick={(event) => this.previousImage(event, numImages)}>
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="sr-only">Previous</span>
        </button>
        <button className="carousel-control-next" data-slide="next" onClick={(event) => this.nextImage(event, numImages)}>
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="sr-only">Next</span>
        </button>
      </div>
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
          { this.state.isLoaded ? this.renderFileUpload() : null }
          { this.state.isLoaded && currentNote.files ? this.renderFiles() : null }
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
