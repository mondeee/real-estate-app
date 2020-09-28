import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image
} from 'react-native';
import Colors from '../styles/Colors';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import Fonts from '../styles/Fonts';

export default function Input(props) {
  const {
    clickable,
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
    multiline,
    upload,
  } = props

  const [pass, setPass] = useState(password)

  useEffect(() => {
    console.log('@VALUE', value)
  }, [])

  if (clickable) {
    // console.log('@value', value)
    if (upload) {
      return (
        <TouchableOpacity onPress={() => clickable()} style={{ ...style, ...styles.buttonContainer, paddingHorizontal: 15, }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image style={{ height: 20, width: 16, alignSelf: 'center' }} source={require('../../assets/uploadfileicon.png')} />
            {!value && <Text style={{ ...Fonts.fontRegular, color: Colors.darkGray, marginLeft: 24, }}>{`PDF ,JPG ,PNG`}</Text>}
          </View>
          <Text style={{
            paddingTop: 4,
            paddingRight: 8,
            fontSize: 14,
            flex: 1,
            ...Fonts.fontRegular,
            color: value ? Colors.primaryBlue : Colors.darkGray,
          }}>{value ? `${value.length} images` : placeholder}</Text>
        </TouchableOpacity>
      )
    }

    return (
      <TouchableOpacity onPress={() => clickable()} style={{ ...style, ...styles.buttonContainer, paddingHorizontal: 15, }}>
        <Image style={{ height: 16, width: 16 }} source={require('../../assets/addlocation.png')} />
        <Text style={{
          paddingTop: 4,
          paddingRight: 8,
          fontSize: 14,
          flex: 1,
          ...Fonts.fontRegular,
          color: value ? Colors.primaryBlue : Colors.darkGray,
        }}>{value ? `${value.location}` : placeholder}</Text>
      </TouchableOpacity>
    )

  }

  return (
    <View style={{ ...style, ...styles.buttonContainer }}>
      {password && <TouchableOpacity onPress={() => setPass(!pass)} style={styles.iconContainer}>
        <MaterialIcons color={Colors.darkGray} size={18} name={'remove-red-eye'} />
      </TouchableOpacity>}
      <TextInput placeholder={placeholder || ''} secureTextEntry={pass}
        onChangeText={e => onChangeText ? onChangeText(e) : console.log(e)}
        maxLength={maxLength ? maxLength : 24}
        autoCapitalize={false}
        multiline={multiline}
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
    // shadowOffset: { height: 2, width: 2 },
    // shadowColor: 'black',
    // shadowOpacity: 0.1,
    // backgroundColor: 'white',
  },
  iconContainer: {
    flex: .5,
    // backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  }
})
