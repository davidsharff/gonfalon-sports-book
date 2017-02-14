'use strict';
const {createStore} = require('redux');
const reducer = require('./reducer');
const {propGroupOperators} = require('../shared/constants');

const initialAppState = {
  app: {
    users: [],
    propGroups: [
      {
        id: 1234,
        operator: propGroupOperators.FIRST_TO_OCCUR,
        interest: .05,
        isActive: true,
        includedProps: [
          {
            id: 6,
            description: 'Colonel Sanders is promoted to Brigadier General',
            startingLine: 250,
            isActive: true
          },
          {
            id: 5,
            description: 'Nolan Ryan throws ceremonial first pitch of Astros game and exceeds 80 mph',
            startingLine: -110,
            isActive: true
          }
        ]
      },
      {
        id: 190837,
        operator: propGroupOperators.FIRST_TO_OCCUR,
        interest: 0,
        isActive: true,
        includedProps: [
          {
            id: 4,
            description: 'Dennis Rodman becomes an official ambassador, for any UN member state, to the DPRK',
            startingLine: 125,
            isActive: true
          },
          {
            id: 3,
            description: 'United States goverment confirms existence of intelligent alien species',
            startingLine: -140,
            isActive: true
          }
        ]
      },
      {
        id: 2309487,
        operator: propGroupOperators.GREATER,
        interest: .02,
        isActive: true,
        includedProps: [
          {
            id: 2,
            description: 'Total new companies founded by Elon Musk in 2017',
            startingLine: 105,
            isActive: true
          },
          {
            id: 1,
            description: 'Total NFL games ending in a tie during the entire 2017 regular season',
            startingLine: -120,
            isActive: true
          }
        ]
      }
    ]
  }
};

const store = createStore(reducer, initialAppState);

module.exports = store;