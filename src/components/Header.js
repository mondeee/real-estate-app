import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar
} from 'react-native';
import Colors from '../styles/Colors';
import { MaterialIcons } from '@expo/vector-icons';

export default function Header(props) {
  const {
    onPressBack,
  } = props

  renderMainHeader = () => {
    return (
      <View elevation={5} style={{ ...styles.headerContainer }}>
        <Image style={{ height: 99, width: 68, alignSelf: 'center', }} source={require(`../../assets/headericon.png`)} />
        <TouchableOpacity onPress={() => onPressBack()} style={styles.backButton}>
          <MaterialIcons size={40} color={Colors.primaryBlue} name={'chevron-right'} />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    renderMainHeader()
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    height: '20%',
    width: '100%',
    marginBottom: 5,
    justifyContent: 'center',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    backgroundColor: 'white',
    shadowOffset: { height: 5, },
    shadowColor: 'black',
    shadowOpacity: 0.05
  },
  backButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  }
})
