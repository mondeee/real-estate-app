import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';

import BottomTabBar from '../components/BottomTabBar'
import Header from '../components/Header';

export default function FavoritesScreen() {

  useEffect(() => {
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <Header/>
      <View style={styles.container}>
        <Text>Favorites</Text>
      </View>
    </View>
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
