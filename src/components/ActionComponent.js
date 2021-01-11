//ﺄﻨﺗ ﻎﻳر ﻢﺴﺠﻟ 


import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  Image,
  Modal,
  View,
  TouchableOpacity
} from 'react-native';
import Colors from '../styles/Colors';
// import Modal from 'react-native-modal';
import Button from './Button';
import Fonts from '../styles/Fonts';


export default function ActionComponent(props) {
  const {
    style,
    textStyle,
    onPress,
    child,
    msg,
    success,
    isVisible,
    onClose,
    profile,
  } = props

  if (!isVisible) return false

  renderContent = () => {
    if (success) {
      return (
        <View style={{ ...styles.container }}>
          <Image source={require('../../assets/inverted_curve_bg.png')} style={styles.imageBg} />
          <Image style={{ position: 'absolute', left: '20%', top: '20%', height: '60%', width: '60%', resizeMode: 'contain', }} source={require('../../assets/success.png')} />
          <View style={{ marginTop: 150, alignItems: 'center' }} >
            <Text style={styles.text}>{msg || `تم تسجيلك بنجاح`}</Text>
            <Button style={{ minWidth: 100 }} onPress={() => onClose()} text={`حسنا`} />
          </View>
        </View>
      )
    }
    return (
      <View style={{ ...styles.container }}>
        <Image source={require('../../assets/inverted_curve_bg.png')} style={styles.imageBg} />
        <Image style={{ position: 'absolute', left: '20%', top: '20%', height: '60%', width: '60%', resizeMode: 'contain', }} source={require('../../assets/failed.png')} />
        <View style={{ marginTop: 150, alignItems: 'center' }} >
          <Text style={styles.text}>{msg || `نعتذر حدث خطأ  \n نرجوا المحاولة مرة أخرى `}</Text>
          <Button style={{ minWidth: 100 }} onPress={() => onClose()} text={`حسنا`} />
        </View>
      </View>
    )
  }

  return (
    <Modal style={{ flex: 1 }} isVisible={isVisible}>
      {renderContent()}
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white',
    alignItems: 'center',
  },
  text: {
    color: Colors.primaryBlue,
    fontSize: 23,
    marginVertical: 20,
    textAlign: 'center',
    ...Fonts.FontMed,
  },
  imageBg: {
    marginTop: -20,
    height: '55%',
    width: Dimensions.get('window').width + 25
  }

})
