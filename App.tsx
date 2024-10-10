import messaging from '@react-native-firebase/messaging';
import React, {useEffect, useRef} from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  Text,
} from 'react-native';

const App = (isHeadless: boolean) => {
  const areaRef = useRef(null);
  useEffect(() => {
    const setupPromise = InitialSetup();
    return () => {
      setupPromise.then(unsubscribe => {
        if (unsubscribe) {
          unsubscribe();
        }
      });
    };
  }, []);

  if (isHeadless) {
    return <></>;
  }

  return (
    <SafeAreaView>
      <Text>New Page</Text>
      <Text ref={areaRef}>Empty Area</Text>
    </SafeAreaView>
  );
};

const InitialSetup = async () => {
  let notificationPermission = false;
  if (Platform.OS === 'ios') {
    notificationPermission = await requestIosUserPermission();
  } else if (Platform.OS === 'android') {
    notificationPermission = await requestAndroidUserPermission();
  }

  if (notificationPermission) {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    console.log(`App FCM Token: ${token}`);
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }
  return null;
};

async function requestAndroidUserPermission() {
  const authStatus =
    Platform.Version <= 32
      ? 'granted'
      : await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
  const enabled = authStatus === 'granted';

  console.log('Authorization status:', authStatus);
  return enabled;
}

async function requestIosUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  console.log('Authorization status:', authStatus);
  return enabled;
}

export default App;
