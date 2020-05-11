import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import BottomTabBar from '../components/BottomTabBar'
import Header from '../components/Header';
import Colors from '../styles/Colors';
import Fonts from '../styles/Fonts';

const LIST = [
  {
    name: 'personal info', icon: 'user'
  },
  {
    name: 'subs', icon: 'subs'
  },
  {
    name: 'logout', icon: 'referral'
  },
]

export default function ProfileScreen(props) {
  const { navigate, goBack } = props.navigation

  useEffect(() => {
  }, [])

  renderLists = () => {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.itemContainer}>
          <Text style={styles.itemText}>{`ﺎﻠﻤﻠﻓ ﺎﻠﺸﺨﺼﻳ`}</Text>
          <Image style={{ height: 16, width: 16 }} source={require('../../assets/usericon.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigate('Subs')} style={styles.itemContainer}>
          <Text style={styles.itemText}>{`الاشتراكات`}</Text>
          <Image style={{ height: 16, width: 16 }} source={require('../../assets/subicon.png')} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer}>
          <Text style={styles.itemText}>{`ﺮﻔﻋ ﺎﻠﺣوﺎﻟة`}</Text>
          <Image style={{ height: 16, width: 16 }} source={require('../../assets/uparrowicon.png')} />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <Header />
      {renderLists()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '100%',
    padding: 24,
    // justifyContent: 'center',
  },
  itemContainer: {
    borderBottomColor: Colors.gray,
    width: '100%',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    margin: 8,
    padding: 8,
  },
  itemText: {
    ...Fonts.FontMed,
    height: '100%',
    marginRight: 12,
    textAlignVertical: 'center',
    fontSize: 17
  }
});
