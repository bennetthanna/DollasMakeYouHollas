import React, { Component } from 'react';
import firebase from './firebase.js';
import ReactDOM from 'react-dom';
import Login from './Login';

class LoggedIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.email,
    };
    const user = firebase.auth().currentUser;
    this.currentUser = {};
    if (user != null) {
      this.currentUser.name = user.displayName;
      this.currentUser.email = user.email;
      this.currentUser.photoUrl = user.photoURL;
      this.currentUser.emailVerified = user.emailVerified;
      this.currentUser.uid = user.uid; 
    }
  }

  logout(e) {
    e.preventDefault();
    firebase.auth().signOut()
      .then(user => {
        console.log("Logging out");
        ReactDOM.render(<Login />, document.getElementById('root'));
      })
      .catch(function(error) {
        console.log(`ERROR: ${error}`);
      });
  }

  render() {
    const u = this.currentUser;
    const userDetails = Object.keys(this.currentUser).map(function(key) {
      return <div><p>{key}: {u[key]}</p></div>
    });

    return (
      <div className="container">
      <div className="jumbotron">
        <div className="text-center">
          <p>Welcome {this.currentUser.email}!</p>
        </div>
        {userDetails}
        <button id="Logout" onClick={this.logout}>Logout</button>
      </div>
    </div>
    );
  }
}

export default LoggedIn;
