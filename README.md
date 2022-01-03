# Next.js Rules Overriding Modules

Make it easy to override the webpack rules in next.js.

## Installation

```
npm install --save next-rules-overriding-modules
```

or

```
yarn add next-rules-overriding-modules
```

## Usage

### withROM(rules [, options])

- `rules` rules array for overriding

```js
[
  {
    test: /\.module\.(scss|sass)$/,
    use: [
      {
        loader: /(\/|\\)css-loader/,
        options: {
          modules: {
            exportLocalsConvention: 'camelCase'
          }
        }
      }
    ]
  }
];
```

- `options` Object (optional)
  - `debug` Boolean: Display some informative logs in the console (can get noisy!)
    (default to `false`)

#### Examples

```js
// next.config.js
const withROM = require('next-rules-overriding-modules')([
  {
    test: /\.module\.(scss|sass)$/,
    use: [
      {
        loader: /(\/|\\)css-loader/,
        options: {
          modules: {
            exportLocalsConvention: 'camelCase'
          }
        }
      }
    ]
  }
]); // pass the rules you would like to override

module.exports = withROM({});
```
