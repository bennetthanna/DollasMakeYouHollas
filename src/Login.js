import React, { Component } from 'react';
import firebase from './firebase';
import ReactDOM from 'react-dom';
import LoggedIn from './LoggedIn';
import { Redirect } from 'react-router-dom'
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.signInWithEmailAndPassword = this.signInWithEmailAndPassword.bind(this);
    this.signInWithGoogle = this.signInWithGoogle.bind(this);
    this.signUp = this.signUp.bind(this);
    this.logIn = this.props.logIn;
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  signInWithEmailAndPassword(e) {
    const logIn = this.logIn;
    e.preventDefault();
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        console.log("You're logged in: %j", user);
        logIn();
      })
      .catch(function(error) {
        console.log(`ERROR: ${error}`);
        if (error.code === 'auth/wrong-password') {
          alert('Wrong password');
        }
      });
  }

  signInWithGoogle(e) {
    const logIn = this.logIn;
    e.preventDefault();
    console.log('SIGN IN WITH GOOGLE');
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(googleProvider)
      .then(function(result) {
        console.log(result);
        logIn();
      }).catch(function (error) {
        console.log(error);
      });
  }

  signUp(e) {
    const logIn = this.logIn;
    e.preventDefault();
    console.log('SIGN UP');
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(res => {
        console.log(res);
        logIn();
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className="container">
      <div className="jumbotron">
        <div className="text-center">
          <p>Log In</p>
        </div>
        <form>
          <div>
            <input placeholder="Email" type="email" name="email" id="email" onChange={this.handleChange} value={this.state.email}></input>
          </div>
          <div>
            <input placeholder="Password" type="password" name="password" id="password" onChange={this.handleChange} value={this.state.password}></input>
          </div>
          <button id="signIn" onClick={this.signInWithEmailAndPassword}>Sign In</button>
          <button id="signUp" onClick={this.signUp}>Sign Up</button>
          <button id="signInWithGoogle" onClick={this.signInWithGoogle}><FontAwesomeIcon icon="fab fa-google"/>Sign In With Google</button>
        </form>
      </div>
    </div>
    );
  }
}

export default Login;
