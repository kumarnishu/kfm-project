#start after reset 
npx react-native start --reset-cache
npx react-native build-android --mode=release
npm run android -- --mode="release"
./gradlew assembleRelease
./gradlew assembleDebug