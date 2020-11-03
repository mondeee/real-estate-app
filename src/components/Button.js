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
    disabled
  } = props
  const [onPressStatus, setOnPressStatus] = useState(false)
  const [disable, setDisable] = useState(disabled)

  useEffect(() => {
    if (onPressStatus) {
      setDisable(true)
    } else {
      setDisable(false)
    }
  }, [onPressStatus])

  return (
    <TouchableOpacity
      disabled={disable}
      onPress={() => {
        setOnPressStatus(true)
        onPress()
        setTimeout(() => {
          setOnPressStatus(false)
        }, 800)
      }} style={{ ...styles.button, ...style, backgroundColor: disabled ? Colors.darkGray : onPressStatus ? Colors.gray : Colors.primaryYellow, }}>
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
