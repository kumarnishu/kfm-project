module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'module:react-native-dotenv',  // Load environment variables
    'react-native-paper/babel',     // Optional for Paper UI components
  ]
};
