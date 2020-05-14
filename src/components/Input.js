import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import Colors from '../styles/Colors';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import Fonts from '../styles/Fonts';

export default function Input(props) {
  const {
    style,
    textStyle,
    onPress,
    password,
    placeholder,
    keyboardType,
    onChangeText,
    maxLength,
    rightIcon,
    value,
  } = props

  const [pass, setPass] = useState(password)

  return (
    <View style={{ ...style, ...styles.buttonContainer }}>
      {password && <TouchableOpacity onPress={() => setPass(!pass)} style={styles.iconContainer}>
        <MaterialIcons color={Colors.darkGray} size={18} name={'remove-red-eye'} />
      </TouchableOpacity>}
      <TextInput placeholder={placeholder || ''} secureTextEntry={pass}
        onChangeText={e => onChangeText ? onChangeText(e) : console.log(e)}
        maxLength={maxLength ? maxLength : 24}
        autoCapitalize={false}
        keyboardType={keyboardType || 'default'}
        value={value}
        style={{
          flex: 4,
          textAlign: 'right',
          paddingTop: 4,
          paddingRight: 8,
          fontSize: 14,
          ...Fonts.fontRegular,
          ...textStyle,
        }}
      />
      {rightIcon && <TouchableOpacity style={styles.iconContainer}>
        <FontAwesome color={Colors.primaryBlue} size={18} name={rightIcon} />
      </TouchableOpacity>}
    </View>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    padding: 12,
    paddingHorizontal: 12,
    // maxWidth: 282,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 21,
    shadowOffset: { height: 2, width: 2 },
    shadowColor: 'black',
    shadowOpacity: 0.1,
    backgroundColor: 'white',
  },
  iconContainer: {
    flex: .5,
    // backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  }
})
