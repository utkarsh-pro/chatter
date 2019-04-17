import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import store from './store';
import Navbar from './components/Navbar/navbar';
import Footer from './components/Footer/footer';
import Login from './containers/Form/Login/login';
import SignUp from './containers/Form/SignUp/signup';
import PrivateRoute from "./hoc/auth/PrivateRoute";
import Chatter from './containers/chatter';
import './App.css';

// Check for token 
if (localStorage.getItem('jwt')) {
  // Set auth token header auth
  setAuthToken(localStorage.getItem('jwt'));

  // Decode token and get user info
  const decoded = jwt_decode(localStorage.getItem('jwt'));

  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (currentTime > decoded.exp) {
    // Logout the user
    store.dispatch(logoutUser());
    // TODO: Clear current Profile
    // Redirect to login
    window.location.href = '/';
  }
}
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="App">

            {/* Navbar renderin here */}
            <Route path='/' exact render={() => <Navbar name='Sign Up' link='/sign-up' />} />
            <Route path='/sign-up' exact render={() => <Navbar name='Login' link='/' />} />
            <Switch>
              <Route exact path='/chatter' render={() => <Navbar name='Signout' link='/' />} />
            </Switch>

            {/* Main Content here */}
            <main className='container'>
              <Route path='/' exact component={Login} />
              <Route path='/sign-up' exact component={SignUp} />
              <Route exact path='/chatter' component={PrivateRoute(Chatter)} />
            </main>

            {/* Footer here - A static component */}
            <Footer />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
