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
import { TextInput } from 'react-native-gesture-handler';

export default function Header(props) {
  const {
    onPressBack,
    search,
    style,
    openDrawer,
  } = props

  renderMainHeader = () => {
    return (
      <View elevation={5} style={{ ...styles.headerContainer }}>
        <Image style={{ height: 99, width: 68, alignSelf: 'center', }} source={require(`../../assets/headericon.png`)} />
        {onPressBack && <TouchableOpacity onPress={() => onPressBack()} style={styles.backButton}>
          <MaterialIcons size={40} color={Colors.primaryBlue} name={'chevron-right'} />
        </TouchableOpacity>}
      </View>
    )
  }

  renderHeaderSearch = () => {
    return (
      <View elevation={5} style={{ ...styles.headerContainer, justifyContent: "space-between", paddingVertical: 20, ...style }}>
        <Image style={{ height: 59, width: 41, alignSelf: 'center', marginTop: 8 }} source={require(`../../assets/headericon.png`)} />
        <View style={{ flexDirection: 'row', width: '90%', margin: 12, marginBottom: 0, padding: 8, borderRadius: 5, backgroundColor: "#F7F7F7", alignSelf: 'center' }}>
          <TextInput style={{ flex: 1, textAlign: 'right', paddingLeft: 12, }} placeholder={'Search'} />
          <TouchableOpacity style={{ paddingLeft: 12 }}>
            <MaterialIcons size={30} color={Colors.gray} name={'search'} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => openDrawer()} style={styles.backButton}>
          {/* <MaterialIcons size={40} color={Colors.primaryBlue} name={'view-headline'} /> */}
          <Image style={{ height: 36, width: 49, alignSelf: 'center', }} source={require(`../../assets/options.png`)} />
        </TouchableOpacity>
      </View>
    )
  }

  if (search) return renderHeaderSearch()

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
    top: 30,
    right: 15,
  }
})
