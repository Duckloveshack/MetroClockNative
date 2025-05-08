const linkAssets = require('@react-native-community/cli-link-assets');

module.exports = {
  assets: ['./assets'],
  commands: [linkAssets.commands.linkAssets]
};