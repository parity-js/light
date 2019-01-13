module.exports = {
  plugins: [
    'babel-plugin-styled-components',
    '@babel/plugin-proposal-class-properties'
  ],
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    ['@babel/preset-stage-0', { decoratorsLegacy: true }]
  ]
};
