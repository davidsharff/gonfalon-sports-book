'use strict';
const autobind = require('autobind-decorator');
const {routeActions} = require('react-router-redux');
const store = require('./store');

class AuthService {
  constructor(clientId, domain) {
    // eslint-disable-next-line no-undef
    this.lock = new Auth0Lock(clientId, domain, {
      redirectUrl: 'http://localhost:8080', // TODO: add prod support
      responseType: 'token'
    });

    this.lock.on('authenticated', this._doAuthentication.bind(this));
  }

  _doAuthentication(authResult) {
    // Saves the user token
    this.setToken(authResult.idToken);
    // navigate to index
    store.dispatch(routeActions.replace({pathName: '/'}));
  }

  login() {
    // Call the show method to display the widget.
    this.lock.show();
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    return !!this.getToken();
  }

  setToken(idToken) {
    // Saves user token to local storage
    localStorage.setItem('id_token', idToken);
  }

  getToken() {
    // Retrieves the user token from local storage
    return localStorage.getItem('id_token');
  }

  logout() {
    // Clear user token and profile data from local storage
    localStorage.removeItem('id_token');
    store.dispatch(routeActions.replace({pathName: '/'}));
  }

}

module.exports = autobind(AuthService);