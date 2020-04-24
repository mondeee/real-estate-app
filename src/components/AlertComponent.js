//ﺄﻨﺗ ﻎﻳر ﻢﺴﺠﻟ 


import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import Colors from '../styles/Colors';
import Modal from 'react-native-modal';
import Button from './Button';
import Fonts from '../styles/Fonts';


export default function AlertModal(props) {
  const {
    style,
    textStyle,
    onPress,
    child,
    text,
    isVisible,
    onClose
  } = props

  return (
    <Modal isVisible={isVisible}>
      <View style={{ ...styles.container }}>
        <Text style={styles.text}>{text || 'ﺄﻨﺗ ﻎﻳر ﻢﺴﺠﻟ '}</Text>
        <Button style={{marginTop: 24,}} onPress={() => onClose()} text={`ﺲﺠﻟ ﺎﻟﺄﻧ`} />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '25%',
    borderRadius: 21,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  text: {
    color: Colors.primaryBlue,
    fontSize: 23,
    textAlign: 'center',
    ...Fonts.fontRegular,
  }
})
