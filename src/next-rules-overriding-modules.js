/**
 * disclaimer:
 *
 * THIS PLUGIN IS A BIG HACK.
 *
 */

const _ = require('lodash');

/**
 * Override webpack rule based on arguments - rules
 * @param {{test: RegExp, use: {loader: RegExp, [key:string]: any}[], [key:string]: any}[]} rules
 * @param {{debug?: boolean} options
 */
const withRomInitializer = (rules = [], options = {}) => {
  const withROM = (nextConfig = {}) => {
    if (rules.length === 0) return nextConfig;

    const debug = options.debug || false;

    const logger = message => {
      if (debug) console.info(`next-rules-overriding-modules - ${message}`);
    };

    return Object.assign({}, nextConfig, {
      webpack(config, options) {
        const interateLoaders = (webpackLoaders, loaders) => {
          webpackLoaders.forEach(webpackLoader => {
            const matchedLoader = loaders.find(l => l.loader.test(webpackLoader.loader));
            if (matchedLoader) {
              _.merge(webpackLoader, _.omit(matchedLoader, ['loader']));
            }
          });
        };

        const interateRules = webpackRules => {
          webpackRules.forEach(webpackRule => {
            if (typeof webpackRule === 'object' && webpackRule.test instanceof RegExp) {
              const matchedRule = rules.find(
                rule => String(webpackRule.test) === String(rule.test)
              );
              if (matchedRule) {
                logger(`Rule ${String(rule.test)} matched`);
                _.merge(webpackRule, _.omit(matchedRule, ['test', 'use']));
                if (webpackRule.use && matchedRule.use) {
                  interateLoaders(webpackRule.use, matchedRule.use);
                }
              }
            } else if (
              typeof webpackRule === 'object' &&
              typeof webpackRule.oneOf === 'object' &&
              Array.isArray(webpackRule.oneOf)
            ) {
              interateRules(webpackRule.oneOf);
            }
          });
        };

        // find matched rules and override it
        interateRules(config.module.rules);

        // Overload the Webpack config if it was already overloaded
        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options);
        }

        return config;
      }
    });
  };

  return withROM;
};

module.exports = withRomInitializer;
