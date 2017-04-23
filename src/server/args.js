'use strict';

const {ArgumentParser} = require('argparse');
const packageJson = require('../../package.json');

let parsedArgs;

function getArgs() {
  return parsedArgs = parsedArgs || parseArgs();
}

module.exports = {
  getArgs
};

function parseArgs() {
  const {NODE_ENV} = process.env;
  if (NODE_ENV && (NODE_ENV != 'development' && NODE_ENV != 'production')) {
    throw new Error(
      `Unrecognized value for environmental variable NODE_ENV: "${NODE_ENV}".\n` +
      'NODE_ENV must be "development" or "production"'
    );
  }

  const argParser = new ArgumentParser({
    version: packageJson.version,
    description: packageJson.description,
    addHelp: true
  });

  argParser.addArgument(
    ['-p', '--port' ],
    {
      help: 'Set Server Port',
      defaultValue: '8080'
    }
  );

  argParser.addArgument(
    ['-dev', '--development' ],
    {
      help: 'Run in development mode',
      action: 'storeTrue'
    }
  );

  argParser.addArgument(
    ['-prod', '--production'],
    {
      help: 'Run in production mode',
      action: 'storeTrue'
    }
  );

  argParser.addArgument(
    ['-us', '--updateSchema'],
    {
      help: 'Run in production mode',
      action: 'storeTrue'
    }
  );

  const args = argParser.parseArgs();

  process.env.NODE_ENV = args.production ? 'production' : 'development';

  return {
    port: parseInt(args.port),
    isDevEnv: args.development || args.production
      ? args.development
      : (NODE_ENV ? NODE_ENV === 'development' : true),
    updateSchema: args.updateSchema
  };
}