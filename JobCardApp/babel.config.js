// babel.config.js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  overrides: [
    {
      test: /\.(js|jsx|ts|tsx)$/,
      plugins: [
        ['@babel/plugin-transform-react-jsx-self', false],
        ['@babel/plugin-transform-react-jsx-source', false],
      ],
    },
  ],
};
