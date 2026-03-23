const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  tty: require.resolve('tty-browserify'),
  util: require.resolve('util'),
};

module.exports = config;