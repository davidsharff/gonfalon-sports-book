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
    const that = this;
    this.lock.getUserInfo(authResult.accessToken, function(error, profile) {
      if (error) {
        console.error(error);
        window.alert(
          'Could not complete login.\n' +
          'Please contact @davidsharff on Twitter if it continues to fail.\n' +
          'Sorry about the ugly popup.'
        );
        return;
      }
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('username', that._getUsernameForProfile(profile));
      that.sendServerAuthDetails(profile);
    });
    // TODO: this isn't serving it's purpose. We are still blowing up for unallowed login callback urls.
    store.dispatch(routeActions.replace({pathName: '/'}));
  }

  sendServerAuthDetails(profile) {
    socket.sendAction({
      type: NOTIFY_AUTHENTICATION,
      payload: {
        userId: profile.user_id,
        username: this._getUsernameForProfile(profile)
      }
    });
  }

  reauthenticate() {
    const that = this;
    this.lock.getUserInfo(localStorage.getItem('access_token'), function(error, profile) {
      if (error) {
        console.error(error);
        that.logout();
        that.login();
        return;
      }
      that.sendServerAuthDetails(profile);
    });
  }

  _getUsernameForProfile(profile) {
    const username = profile.user_id.startsWith('twitter')
      ? profile.screen_name
      : profile.email;

    if (!username) {
      // TODO: it would be nice to collect this info on server. Send a new action type for server logging.
      throw new Error(`Could not determine username. User_id: ${profile.user_id} Name: ${profile.name}`);
    }
    return username;
  }

  login() {
    this.lock.show();
  }

  loggedIn() {
    return !!this.getToken();
  }

  getToken() {
    return localStorage.getItem('id_token');
  }

  getUsername() {
    return localStorage.getItem('username');
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    store.dispatch(routeActions.replace({pathName: '/'}));
  }



}

module.exports = autobind(AuthService);