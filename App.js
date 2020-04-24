import React, { useEffect, useState } from 'react';
import {
  I18nManager,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Platform
} from 'react-native';
import { AppLoading } from "expo";
import * as Font from 'expo-font';
import { Root } from 'native-base'
import AppNavigator from './src/navigation';
import { store, persistor } from './src/services/easy-peasy/'
import { PersistGate } from "redux-persist/integration/react"
import { StoreProvider, createStore, action } from 'easy-peasy'
import { AntDesign, FontAwesome5, Entypo, FontAwesome, MaterialCommunityIcons, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';

export default function App() {
  const [loading, setLoading] = useState(true)
  // const theme = {
  //   ...DefaultTheme,
  //   colors: {
  //     ...DefaultTheme.colors,
  //     primary: 'tomato',
  //     accent: 'yellow',
  //   },
  // };

  useEffect(() => {
    I18nManager.allowRTL(false)
    I18nManager.forceRTL(false)
    // StatusBar.setHidden(Platform.OS !== 'ios')
  }, [])

  _loadResourcesAsync = async () => {
    // _setupNotif()
    return await Promise.all([
      // Asset.loadAsync([
      // ]),
      Font.loadAsync({
        tajawal: require('./assets/fonts/tajawal_regular.ttf'),
        tajawal_med: require("./assets/fonts/Tajawal-Medium.ttf"),
        tajawal_light: require("./assets/fonts/tajawal_light.ttf"),
        tajawal_bold: require("./assets/fonts/tajawal_bold.ttf"),
        ...AntDesign.font,
        ...FontAwesome5.font,
        ...Entypo.font,
        ...Feather.font,
        ...FontAwesome.font,
        ...Ionicons.font,
        ...MaterialCommunityIcons.font,
        ...MaterialIcons.font,
      }),
    ]);
  }

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.log('@ONLOAD', error);
  };

  renderLoading = () => (
    <AppLoading
      startAsync={_loadResourcesAsync}
      onError={_handleLoadingError}
      onFinish={() => setLoading(false)}
    />
  )

  if (loading) {
    return renderLoading()
  }

  return (
    <StoreProvider store={store}>
      <PersistGate persistor={persistor}>
        <Root>
          <AppNavigator />
        </Root>
      </PersistGate>
    </StoreProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
