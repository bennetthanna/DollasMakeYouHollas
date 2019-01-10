import React, { Component } from 'react';
import firebase from './firebase';
import ReactDOM from 'react-dom';
import LoggedIn from './LoggedIn';
import Login from './Login';
import {Router, Route, IndexRoute} from 'react-router';

class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Router>
        <IndexRoute component={Login}/>
        <Route path="/loggedIn" component={LoggedIn}/>
        // <Route path="/loggedIn" render={ props => <LoggedIn {...props} />}
      </Router>
    );
  }
}

export default App;
