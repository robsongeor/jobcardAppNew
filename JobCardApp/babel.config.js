console.log('🔍 Babel config loaded by Metro');

module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
  ],
  plugins: [
    // strip Flow types in every file, not just those with // @flow
    ['@babel/plugin-transform-flow-strip-types', { requireDirective: false }],
  ],
};
