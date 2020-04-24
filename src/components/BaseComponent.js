import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import Colors from '../styles/Colors';


export default function Base(props) {
  const {
    style,
    textStyle,
    onPress,
    child,
    text,
  } = props

  return (
    <TouchableOpacity style={{ ...styles.button, ...style, }}>
      <Text style={{ ...styles.text, ...textStyle }}>{text || `Button`}</Text>
    </TouchableOpacity >
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    paddingHorizontal: 16,
    minWidth: 177,
    minHeight: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryYellow,
  },
  text: {
    color: Colors.primaryBlue,
    textAlign: 'center',
    fontSize: 22
  }
})
