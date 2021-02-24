import React, { useEffect, useState } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Platform
} from 'react-native';
import { AppLoading } from "expo";
import * as Updates from "expo-updates";
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import { Root } from 'native-base'
import AppNavigator from './src/navigation';
import { store, persistor } from './src/services/easy-peasy/'
import { PersistGate } from "redux-persist/integration/react"
import { StoreProvider, createStore, action } from 'easy-peasy'
import { AntDesign, FontAwesome5, Entypo, FontAwesome, MaterialCommunityIcons, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';

//GRAPHQL
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import { HttpLink } from 'apollo-link-http';
import { createUploadLink } from 'apollo-upload-client'

// I18nManager.forceRTL(false);
// I18nManager.allowRTL(false);

export default function App() {
  const [loading, setLoading] = useState(true)
  const cache = new InMemoryCache()
  const init = async () => {
    await persistCache({
      cache,
      storage: AsyncStorage,
    });
  }
  const client = new ApolloClient({
    cache,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      }
    },
    link: new createUploadLink(
      {
        uri: 'https://app.nozolsa.com/graphql',
        fetch: async (uri, options) => {
          const token = await AsyncStorage.getItem('token')
          if (token) {
            console.log('token from Appjs', token)
            options.headers.Authorization = `Bearer ${token}`
          }
          return fetch(uri, options)
        },
      }),

  });

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      StatusBar.setTranslucent(true)
      StatusBar.setBackgroundColor('black')
      StatusBar.setBarStyle('dark-content')
    }
    init()
  }, [])

  _loadResourcesAsync = async () => {
    // _setupNotif()
    return await Promise.all([
      Asset.loadAsync([
        require('./assets/additem.png'),
        require('./assets/bellicon.png'),
        require('./assets/bottombar.png'),
        require('./assets/failed.png'),
        require('./assets/footer.png'),
        require('./assets/footer2x.png'),
        require('./assets/footer4x.png'),
        require('./assets/headericon.png'),
        require('./assets/icon.png'),
        require('./assets/imagedetailx2.png'),
        require('./assets/inverted_curve_bg.png'),
        require('./assets/keyicon.png'),
        require('./assets/messageicon.png'),
        require('./assets/options.png'),
        require('./assets/sidebar_footer.png'),
        require('./assets/sidebar_logo.png'),
        require('./assets/splash.png'),
        require('./assets/splashicon.png'),
        require('./assets/subicon.png'),
        require('./assets/success.png'),
        require('./assets/uparrowicon.png'),
        require('./assets/uploadicon.png'),
        require('./assets/usericon.png'),
        require('./assets/bedroomicon.png'),
        require('./assets/faqicon.png'),
        require('./assets/chevrondown.png'),
        require('./assets/chevronup.png'),
        require('./assets/locationicon.png'),
        require('./assets/bankimage.png'),
        require('./assets/gendericon.png'),
        require('./assets/subiconlarge.png'),
        require('./assets/uploadfileicon.png'),
        require('./assets/bedicon.png'),
        require('./assets/uploadfileicon.png'),
        require('./assets/garage.png'),
        require('./assets/apartment.png'),
        require('./assets/house.png'),
        require('./assets/plant.png'),
        require('./assets/stairs.png'),
        require('./assets/yard.png'),
        require('./assets/swim.png'),
        require('./assets/queenbed.png'),
        require('./assets/room.png'),
        require('./assets/bathub.png'),
        require('./assets/sofa.png'),
        require('./assets/dining.png'),
        require('./assets/visa-icon.png'),
        require('./assets/mada-icon.png'),
      ]),
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
    <ApolloProvider client={client}>
      <StoreProvider store={store}>
        <PersistGate persistor={persistor}>
          <Root>
            <AppNavigator />
          </Root>
        </PersistGate>
      </StoreProvider>
    </ApolloProvider>
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
