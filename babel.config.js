module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'react-native-reanimated/plugin',
        {
          globals: ['__reanimatedWorkletInit', '__reanimatedWorkletRun'],
          relativeSourceLocation: true,
        },
      ],
      require.resolve('expo-router/babel'),
    ],
  };
}; 