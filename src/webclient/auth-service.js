'use strict';
const autobind = require('autobind-decorator');
const {routeActions} = require('react-router-redux');
const store = require('./store');
const {NOTIFY_AUTHENTICATION} = require('../shared/action-types');
const socket = require('./socket');

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
    this.setToken(authResult.idToken);

    localStorage.setItem('access_token', authResult.accessToken);

    this._sendServerAuthDetails();

    store.dispatch(routeActions.replace({pathName: '/'}));
  }

  _sendServerAuthDetails() {
    this.lock.getUserInfo(localStorage.getItem('access_token'), function(error, profile) {
      if (error) {
        console.error(error);
        return;
      }
      socket.sendAction({
        type: NOTIFY_AUTHENTICATION,
        payload: {
          userId: profile.user_id,
          email: profile.email
        }
      });
    });
  }

  login() {
    this.lock.show();
  }

  loggedIn() {
    return !!this.getToken();
  }

  setToken(idToken) {
    localStorage.setItem('id_token', idToken);
  }

  getToken() {
    return localStorage.getItem('id_token');
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('access_token');

    store.dispatch(routeActions.replace({pathName: '/'}));
  }



}

module.exports = autobind(AuthService);