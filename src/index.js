import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom'
import Login from './Login';
import LoggedIn from './LoggedIn';

ReactDOM.render((
     <BrowserRouter>
     <div>
          <Route path="/" component={Login}/>
          <Route path="/loggedIn" component={LoggedIn}/>
      </div>
     </BrowserRouter>
     ),
     document.getElementById('root')
);

serviceWorker.unregister();