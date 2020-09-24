import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import Colors from '../styles/Colors';
import Fonts from '../styles/Fonts';


export default function Button(props) {
  const {
    style,
    textStyle,
    onPress,
    child,
    text,
  } = props

  return (
    <TouchableOpacity onPress={() => onPress()} style={{ ...styles.button, ...style, }}>
      <Text style={{ ...styles.text, ...textStyle }}>{text || `Button`}</Text>
    </TouchableOpacity >
  )
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    maxWidth: 177,
    paddingTop: 8,
    maxHeight: 50,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryYellow,
  },
  text: {
    color: Colors.primaryBlue,
    textAlign: 'center',
    fontSize: 18,
    ...Fonts.fontRegular
  }
})
