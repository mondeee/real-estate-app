import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  I18nManager
} from 'react-native';
import Colors from '../styles/Colors';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Fonts from '../styles/Fonts';
import ModalSelector from 'react-native-modal-selector'

const isAndroid = Platform.OS === 'android' && I18nManager?.isRTL;

const sample_data = [
  {
    key: 0,
    label: 'Choose 1'
  },
  {
    key: 1,
    label: 'Choose 2'
  },
  {
    key: 2,
    label: 'Choose 3'
  },
]

export default function Dropdown(props) {
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
    // value,
    data,
  } = props

  // console.log('val', props.value)
  const [pass, setPass] = useState(password)
  const [value, setValue] = useState(props.value ? props.value : '')
  useEffect(() => {
    // console.log("value", value)
    if (!value) setValue(placeholder)
  }, [data])

  useEffect(() => {
    // const arr = data.filter(i => i.id == props.value)
    // console.log(props.key, arr[0], '\n', props.value)
    // if (arr) setValue(arr[0]?.label)
  }, [])

  return (
    <View style={{ ...style, ...styles.buttonContainer }}>
      <ModalSelector
        style={{ flex: 4, height: 20, borderWidth: 0, borderColor: 'white', justifyContent: 'center' }}
        data={data || sample_data}
        initValue={placeholder || value}
        cancelButtonAccessibilityLabel={'Cancel Button'}
        onChange={(option) => {
          onChangeText(option)
          setValue(option.label)
        }}
      >
        <View style={{ flexDirection: isAndroid ? 'row-reverse' : 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
          <Image style={{ height: 10, width: 15, alignSelf: 'center' }} source={require('../../assets/chevrondown.png')} />
          <TextInput placeholder={placeholder || ''} secureTextEntry={pass}
            // onChangeText={e => onChangeText ? onChangeText(e) : console.log(e)}
            editable={false}
            value={value}
            maxLength={maxLength ? maxLength : 24}
            keyboardType={keyboardType || 'default'}
            style={{
              textAlign: 'right',
              paddingTop: 4,
              paddingRight: 8,
              ...Fonts.fontRegular,
              ...textStyle,
            }}
          />
        </View>
      </ModalSelector>
      {rightIcon && <Image style={{ height: 15, width: 15, alignSelf: 'center', resizeMode: 'contain' }} source={rightIcon} />}
    </View>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: isAndroid ? 'row-reverse' : 'row',
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
