'use strict';

const {ArgumentParser} = require('argparse');

const {NODE_ENV} = process.env;

const argParser = new ArgumentParser({
  version: require('./package.json').version,
  description: 'Builds the Gonfalon Sportsbook public assets',
  addHelp: true
});

argParser.addArgument(
  ['-t', '--target'],
  {
    help: 'Build target (defaulted to "modern" in development and "compatible" in production)',
    choices: ['modern', 'compatible']
  }
);

argParser.addArgument(
  ['-dev', '--development'],
  {
    help: 'Run in development mode',
    action: 'storeTrue'
  }
);

// TODO: waiting on gzip fix on server.
// argParser.addArgument(
//   ['-prod', '--production'],
//   {
//     help: 'Run in production mode',
//     action: 'storeTrue'
//   }
// );

let args = argParser.parseArgs();

if (args.production && args.development) {
  console.error('Both production and development modes were specified');
  process.exit();
}

if (args.production && args.shouldCheckConstraints) {
  console.error('Constraint checker is forbidden in production');
  process.exit();
}

const isDevEnv = args.development || args.production
  ? args.development
  : (NODE_ENV ? NODE_ENV === 'development' : true);

module.exports = {
  target: args.target || isDevEnv ? 'modern' : 'compatible',
  isDevEnv
};