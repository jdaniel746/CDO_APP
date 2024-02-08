module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', 'module:metro-react-native-babel-preset'],
    plugins: [
      'react-native-reanimated/plugin',
      "module:react-native-dotenv",
      [
        'module-resolver',
        {
          envName: "APP_ENV",
          moduleName: "@env",
          path: ".env",
          alias: {
            app: './app',
            '@actions': './app/actions',
            '@api': './app/api',
            '@assets': './app/assets',
            '@components': './app/components',
            '@config': './app/config',
            '@models': './app/models',
            '@navigation': './app/navigation',
            '@reducers': './app/reducers',
            '@sagas': './app/sagas',
            '@screens': './app/screens',
            '@selectors': './app/selectors',
            '@services': './app/services',
            '@store': './app/store',
            '@utils': './app/utils',
            '@data': './app/data'
          }
        }
      ]
    ]
  };
};
