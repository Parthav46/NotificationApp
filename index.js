/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {initializeApp} from '@react-native-firebase/app';

initializeApp();
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handle in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
