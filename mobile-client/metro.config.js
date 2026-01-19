const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for jsconfig.json path aliases
const jsConfig = require('./jsconfig.json');
if (jsConfig.compilerOptions.paths) {
  config.resolver.extraNodeModules = new Proxy(
    {},
    {
      get: (target, name) => {
        if (name === '@') {
          return path.resolve(__dirname);
        }
        return path.join(process.cwd(), `node_modules/${name}`);
      },
    }
  );
}

module.exports = config;
