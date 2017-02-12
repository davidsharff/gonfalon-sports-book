'use strict';
const {createStore} = require('redux');
const reducer = require('./reducer');
const {propGroupOperators} = require('../shared/constants');

const initialAppState = {
  app: {
    // TODO: use to id individual props within groups. Makes it easier to refer to specific prop outside of app.
    // TODO: the id can be assigned in the reducer and this count incremented as part of the same action.
    //latestPropCount: 0,
    propGroups: [
      {
        id: 1234,
        operator: propGroupOperators.FIRST_TO_OCCUR,
        interest: .05,
        includedProps: [
          {
            id: 6,
            description: 'Colonel Sanders is promoted to Brigadier General',
            startingLine: 250
          },
          {
            id: 5,
            description: 'Nolan Ryan throws ceremonial first pitch of Astros game and exceeds 80mph',
            startingLine: -110
          }
        ]
      },
      {
        id: 190837,
        operator: propGroupOperators.FIRST_TO_OCCUR,
        interest: 0,
        includedProps: [
          {
            id: 4,
            description: 'Dennis Rodman becomes an official ambassador, for any UN member nation, to the DPRK',
            startingLine: 125
          },
          {
            id: 3,
            description: 'United States goverment confirms existence of intelligent alien species',
            startingLine: -140
          }
        ]
      },
      {
        id: 2309487,
        operator: propGroupOperators.GREATER,
        interest: .02,
        includedProps: [
          {
            id: 2,
            description: 'Total new companies founded by Elon Musk in 2017',
            startingLine: 105
          },
          {
            id: 1,
            description: 'Total NFL games ending in a tie during the entire 2017 regular season',
            startingLine: -120
          }
        ]
      }
    ]
  }
};

const store = createStore(reducer, initialAppState);

module.exports = store;