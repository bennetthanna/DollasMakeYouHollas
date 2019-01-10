import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom'
import Login from './Login';
import LoggedIn from './LoggedIn';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();