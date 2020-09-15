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
import Fonts from '../styles/Fonts';
import { SafeAreaView } from 'react-navigation';

export default function Header(props) {
  const {
    Add,
    Section,
    onPressBack,
    search,
    profile,
    leftButton,
    style,
    section,
    name,
    openDrawer,
    MapHeader,
  } = props

  renderMainHeader = () => {
    return (
      <SafeAreaView elevation={5} style={{ ...styles.headerContainer }}>
        <Image style={{ height: 99, width: 68, alignSelf: 'center', }} source={require(`../../assets/headericon.png`)} />
        {onPressBack && <TouchableOpacity onPress={() => onPressBack()} style={styles.backButton}>
          <MaterialIcons size={40} color={Colors.primaryBlue} name={'chevron-right'} />
        </TouchableOpacity>}
        <Text style={{ textAlign: 'center', alignSelf: 'center', marginTop: 12 }}>{name || ''}</Text>
      </SafeAreaView>
    )
  }

  renderHeaderSearch = () => {
    if (section) {
      return (
        <SafeAreaView elevation={5} style={{ ...styles.headerContainer, backgroundColor: 'white' }}>
          {/* <Image style={{ height: 23, width: 23, alignSelf: 'center', tintColor: Colors.primaryBlue }} source={require(`../../assets/usericon.png`)} /> */}
          <Text style={{ ...Fonts.FontMed, color: Colors.primaryBlue, textAlign: 'center', marginTop: 12, fontSize: 19 }}>{`الغرف`}</Text>
          {onPressBack && <TouchableOpacity onPress={() => onPressBack()} style={styles.backButton}>
            <MaterialIcons size={40} color={Colors.primaryBlue} name={'chevron-right'} />
          </TouchableOpacity>}
          <Text style={{ ...Fonts.FontMed, color: Colors.primaryBlue, textAlign: 'center', marginTop: 12, fontSize: 19 }}>{section.name}</Text>
        </SafeAreaView>
      )
    }

    return (
      <SafeAreaView elevation={5} style={{ ...styles.headerContainer, justifyContent: "space-between", paddingVertical: 20, ...style }}>
        <Image style={{ height: 59, width: 41, alignSelf: 'center', marginTop: 8 }} source={require(`../../assets/headericon.png`)} />
        <View style={{ flexDirection: 'row', width: '90%', margin: 12, marginBottom: 8, padding: 6, borderRadius: 30, backgroundColor: "#F7F7F7", alignSelf: 'center' }}>
          <TextInput style={{ flex: 1, textAlign: 'right', paddingLeft: 12, }} placeholder={'Search'} />
          <TouchableOpacity style={{ paddingLeft: 12, }}>
            <MaterialIcons size={30} color={Colors.gray} name={'search'} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => openDrawer()} style={styles.backButton}>
          <Image style={{ height: 36, width: 49, alignSelf: 'center', }} source={require(`../../assets/options.png`)} />
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  renderProfileHeader = () => {
    return (
      <SafeAreaView elevation={5} style={{ ...styles.headerContainer, backgroundColor: Colors.primaryBlue }}>
        <Image style={{ height: 23, width: 23, alignSelf: 'center', tintColor: Colors.primaryYellow }} source={require(`../../assets/usericon.png`)} />
        {onPressBack && <TouchableOpacity onPress={() => onPressBack()} style={styles.backButton}>
          <MaterialIcons size={40} color={'white'} name={'chevron-right'} />
        </TouchableOpacity>}
        <Text style={{ ...Fonts.FontMed, color: 'white', textAlign: 'center', marginTop: 12, fontSize: 19 }}>{`ﺎﻠﻤﻠﻓ ﺎﻠﺸﺨﺼﻳ`}</Text>
      </SafeAreaView>
    )
  }

  renderAddPropertyHeader = () => {
    return (
      <SafeAreaView elevation={5} style={{ ...styles.headerContainer, backgroundColor: Colors.primaryBlue }}>
        <Image style={{ height: 23, width: 23, alignSelf: 'center', tintColor: Colors.primaryYellow }} source={require(`../../assets/subicon.png`)} />
        {onPressBack && <TouchableOpacity onPress={() => onPressBack()} style={styles.backButton}>
          <MaterialIcons size={40} color={'white'} name={'chevron-right'} />
        </TouchableOpacity>}
        <Text style={{ ...Fonts.FontMed, color: 'white', textAlign: 'center', marginTop: 12, fontSize: 19 }}>{`إضافة إعلان`}</Text>
        {Section && <Text style={{ ...Fonts.fontRegular, color: 'white', textAlign: 'center', marginTop: 12, fontSize: 19 }}>{`إضافة قسم للنزل`}</Text>}
      </SafeAreaView>
    )
  }

  const renderMap = () => {
    return (
      <SafeAreaView elevation={5} style={{ ...styles.headerContainer, height: '13%' }}>
        <TouchableOpacity onPress={() => leftButton()} style={styles.leftButton}>
          <MaterialIcons size={30} color={Colors.primaryBlue} name={'search'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressBack()} style={styles.backButton}>
          <MaterialIcons size={30} color={Colors.primaryBlue} name={'close'} />
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  if (MapHeader) return renderMap()

  if (Add) return renderAddPropertyHeader()

  if (profile) return renderProfileHeader()

  if (search) return renderHeaderSearch()

  return (
    renderMainHeader()
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    height: '21%',
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
    top: 50,
    right: 15,
  },
  leftButton: {
    position: 'absolute',
    top: 50,
    left: 15,
  }
})
