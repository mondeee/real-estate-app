import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';
import Header from '../components/Header';
import { SafeAreaView } from 'react-navigation';
import Input from '../components/Input';
import Button from '../components/Button';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Colors from '../styles/Colors';
import Fonts from '../styles/Fonts';
import AlertModal from '../components/AlertComponent';
import ActionComponent from '../components/ActionComponent';

export default function RegisterScreen(props) {
  const { navigation: { navigate, goBack, } } = props
  const [alerVisible, setAlertVisible] = useState(false)
  const [verify, setVerify] = useState(false)
  useEffect(() => {
  }, [])


  renderVerify = () => {
    return (
      <KeyboardAvoidingView keyboardVerticalOffset={20} behavior={"padding"} style={{ ...styles.container, marginTop: '15%' }}>
        <FontAwesome size={50} color={Colors.primaryBlue} name={'lock'} />
        <Text style={{ ...Fonts.FontMed, color: Colors.primaryBlue, fontSize: 20, margin: 12, }}>{`ﺮﻣز ﺎﻠﺘﻔﻌﻴﻟ`}</Text>
        <Text style={{ ...Fonts.fontRegular, color: Colors.primaryBlue, fontSize: 18 }} >{`ﺖﻣ إﺮﺳﺎﻟ ﺮﻣز ﺎﻠﺘﻔﻌﻴﻟ ﻞﺟوﺎﻠﻛ`}</Text>
        <Input textStyle={{ textAlign: 'center'}} style={{ margin: 15, marginTop: 24 }} />
        <Text style={{ ...Fonts.fontRegular, color: Colors.primaryBlue, fontSize: 13 }}>{`ﺈﻋادة ﺎﻟإﺮﺳﺎﻟ`}</Text>
        <Button style={{ marginTop: 30, }} onPress={() => setAlertVisible(true)} text={`التالي`} />
      </KeyboardAvoidingView>
    )
  }

  renderRegister = () => {
    return (
      <KeyboardAvoidingView keyboardVerticalOffset={20} behavior={"padding"} style={styles.container}>
        <Input placeholder={`مسالا`} style={{ marginVertical: 35, marginTop: 70 }} rightIcon={'user'} />
        <Input placeholder={`لاوجلا مقر`} style={{ marginBottom: 35 }} rightIcon={'phone'} />
        <Input password placeholder={`ﻚﻠﻣة ﺎﻠﻣرور`} style={{ marginBottom: 35 }} rightIcon={'lock'} />
        <Input password placeholder={`تﺄﻜﻳد ﻚﻠﻣة ﺎﻠﻣرور`} style={{ marginBottom: 35 }} rightIcon={'lock'} />
        <Button onPress={() => setVerify(true)} text={`تسجيل`} />
        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          <View style={{ width: 4 }} />
          <Text onPress={() => navigate('Login')} style={{ color: Colors.primaryBlue, ...Fonts.fontRegular }}>
            {` لﺪﻴﻛ ﺢﺳﺎﺑ ﻢﺴﺒﻗا؟ `}
            <Text style={{ fontWeight: '500' }}>{`ﺲﺠﻟ ﻪﻧا`}</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    )
  }

  onSubmitRegister = () => {

  }

  onPressBack = () => {
    if (verify) {
      setVerify(false)
      return
    }
    navigate('Home')
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header onPressBack={onPressBack} />
      <ActionComponent isVisible={alerVisible} onClose={() => setAlertVisible(false)} />
      {!verify && renderRegister()}
      {verify && renderVerify()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
});
