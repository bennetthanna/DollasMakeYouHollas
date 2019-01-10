import React, { Component } from 'react';
import firebase from './firebase.js';
import ReactDOM from 'react-dom';
import Login from './Login';

class LoggedIn extends Component {
  constructor(props) {
    super(props);

    const user = firebase.auth().currentUser;

    this.currentUser = {};
    this.logOut = this.logOut.bind(this);

    if (user != null) {
      this.currentUser.name = user.displayName;
      this.currentUser.email = user.email;
      this.currentUser.photoUrl = user.photoURL;
      this.currentUser.emailVerified = user.emailVerified;
      this.currentUser.uid = user.uid; 
    }
  }

  logOut(e) {
    const logOut = this.props.logOut;
    e.preventDefault();
    firebase.auth().signOut()
      .then(user => {
        console.log("Logging out");
        logOut();
      })
      .catch(function(error) {
        console.log(`ERROR: ${error}`);
      });
  }

  render() {
    const user = this.currentUser;
    const userDetails = Object.keys(this.currentUser).map(function(key) {
      return <div><p>{key}: {user[key]}</p></div>
    });

    return (
      <div className="container">
      <div className="jumbotron">
        <div className="text-center">
          <p>Welcome {this.currentUser.email}!</p>
        </div>
        {userDetails}
        <button id="logOut" onClick={this.logOut}>Log Out</button>
      </div>
    </div>
    );
  }
}

export default LoggedIn;
