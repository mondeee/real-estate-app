import React, { useEffect, useState } from 'react';
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
    padding: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    maxWidth: 177,
    maxHeight: 40,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryYellow,
  },
  text: {
    color: Colors.primaryBlue,
    textAlign: 'center',
    fontSize: 22,
    ...Fonts.fontRegular
  }
})
