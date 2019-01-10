import React, { Component } from 'react';
import LoggedIn from './LoggedIn';
import Login from './Login';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false
    }
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  logIn() {
    this.setState({ isLoggedIn: true });
  }

  logOut() {
    this.setState({ isLoggedIn: false });
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    const logIn = this.logIn;
    const logOut = this.logOut;

    return (
      <div>{ isLoggedIn ? <LoggedIn logOut={logOut}/> : <Login logIn={logIn}/> }</div>
    );
  }
}

export default App;
