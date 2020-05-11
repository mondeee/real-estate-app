import React, { useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Colors from '../styles/Colors';
import { SafeAreaView } from 'react-navigation';
import Fonts from '../styles/Fonts';
import Styles from '../styles/Styles';
import Header from '../components/Header';
import { REGISTER } from '../services/graphql/queries'
import { useMutation } from '@apollo/react-hooks';

export default function SubscriptionScreen(props) {
  const { navigate, goBack } = props.navigation

  useEffect(() => {
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <Header onPressBack={() => goBack()} />
      <View style={{ flex: 1 }}>
        <Text>{`طﺮﻴﻗة ﺎﻟإﺷﺘﺮﺎﻛ:`}</Text>
      </View>
    </SafeAreaView>
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
