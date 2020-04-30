import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  View,
  TouchableOpacity
} from 'react-native';
import Colors from '../styles/Colors';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import Fonts from '../styles/Fonts';



export default function BottomTabBar(props) {
  const { navigate } = props.navigation
  const [selectedTab, setSelectedTab] = useState(0)
  const {
    style,
    textStyle,
    onPress,
    child,
    text,
  } = props

  useEffect(() => {
    switch (selectedTab) {
      case 0:
        navigate('Home')
        break;
      case 1:
        navigate('Favorites')
        break;
      case 2:
        navigate('Messages')
        break;
      case 3:
        navigate('Profile')
        break;
    }
  }, [selectedTab])

  const tabs = [
    {
      key: '0',
    },
    {
      key: '1',
    },
    {
      key: '2',
    },
    {
      key: '3',
    }
  ]

  tabColor = (index = 0) => selectedTab == index ? Colors.primaryYellow : Colors.primaryBlue

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/footer2x.png')} resizeMode={'cover'} style={styles.image} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => setSelectedTab(3)} style={styles.navButton}>
          {/* <FontAwesome color={tabColor(3)} size={25} name={'user'} /> */}
          <Image source={require('../../assets/usericon.png')} resizeMode={'cover'} style={{ height: 20, width: 20, marginTop: 8, tintColor: tabColor(3) }} />
          <Text style={{ ...Fonts.fontRegular, ...styles.navLabel, color: tabColor(3) }}>{`يباسح`}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab(2)} style={styles.navButton}>
          {/* <FontAwesome color={tabColor(2)} size={25} name={'list-alt'} /> */}
          <Image source={require('../../assets/messageicon.png')} resizeMode={'cover'} style={{ height: 20, width: 20, marginTop: 8, tintColor: tabColor(2) }} />
          <Text style={{ ...Fonts.fontRegular, ...styles.navLabel, color: tabColor(2) }}>{`ةثداحملا`}</Text>
        </TouchableOpacity>
        <FontAwesome style={{ width: '20%' }} color={'transparent'} size={25} name={'user'} />
        <TouchableOpacity onPress={() => setSelectedTab(1)} style={styles.navButton}>
          <MaterialCommunityIcons color={tabColor(1)} size={25} name={'bell-outline'} />
          <Text style={{ ...Fonts.fontRegular, ...styles.navLabel, color: tabColor(1) }}>{`تاهيبنتلا`}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab(0)} style={styles.navButton}>
          <MaterialIcons color={tabColor(0)} size={25} name={'vpn-key'} />
          <Text style={{ ...Fonts.fontRegular, ...styles.navLabel, color: tabColor(0) }}>{`يكالمأ`}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => console.log('onPress')} style={styles.middleButton}>
        <MaterialIcons color={"white"} name="add" size={25} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'absolute',
    bottom: -3,
  },
  navButton: {
    // backgroundColor: 'black',
    height: '100%',
    width: '20%',
    alignItems: 'center',
    paddingTop: 8,
    // justifyContent: 'center',
  },
  navLabel: {
    fontSize: 13,
    marginTop: 5,
  },
  buttonContainer: {
    // paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 80,
    position: 'absolute',
    bottom: 0,
  },
  image: {
    height: 112,
    width: '104%',
    position: 'absolute',
    bottom: -8,
    left: -8,
  },
  middleButton: {
    backgroundColor: Colors.primaryBlue,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    height: 68,
    width: 68,
    marginLeft: 2,
    borderRadius: 140,
  }
})
