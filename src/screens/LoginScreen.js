import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Header from '../components/Header';
import { SafeAreaView } from 'react-navigation';
import Input from '../components/Input';
import Fonts from '../styles/Fonts';
import Colors from '../styles/Colors';
import Button from '../components/Button'

export default function LoginScreen(props) {
  const { navigate, goBack } = props.navigation
  const [agree, setAgree] = useState(false)

  useEffect(() => {
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text>Login</Text> */}
      <Header onPressBack={() => navigate('register')} />
      <View elevation={3} style={styles.loginBox}>
        <Input placeholder={`ﺮﻘﻣ ﺎﻠﺟوﺎﻟ`} style={{ marginBottom: 25, marginTop: 40 }} rightIcon='phone' />
        <Input placeholder={`ﻚﻠﻣة ﺎﻠﻣرور`} style={{ marginBottom: 25 }} password rightIcon='lock' />
        <TouchableOpacity style={{ width: '75%', marginBottom: 10 }}>
          <Text style={{ ...Fonts.fontRegular, width: '100%', textAlign: 'right', textDecorationLine: 'underline' }}>{`؟رورملا ةملك تيسن`}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setAgree(!agree)} style={{ width: '65%', marginBottom: 10, flexDirection: 'row' }}>
          <Text style={{ ...Fonts.fontRegular, width: '100%', textAlign: 'right' }}>{`أوﺎﻔﻗ ﻊﻟى ﺎﻠﺷرﻮﻃ و ﺎﻟﺄﺤﻛﺎﻣ`}</Text>
          <View style={{
            borderRadius: 30,
            height: 14,
            width: 14,
            borderWidth: 1,
            borderColor: Colors.primaryBlue,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 8
          }}>
            {agree && <View style={{ borderRadius: 30, height: 10, width: 10, backgroundColor: Colors.primaryBlue }} />}
          </View>
        </TouchableOpacity>
        <Button onPress={() => navigate('Home')} text={`ﺖﺴﺠﻴﻟ ﺎﻟﺪﺧﻮﻟ`} style={{ marginTop: 24 }} />
        <Text onPress={() => navigate('Register')} style={{ color: Colors.primaryBlue, ...Fonts.fontRegular, marginTop: 12 }}>
          {` لﺪﻴﻛ ﺢﺳﺎﺑ ﻢﺴﺒﻗا؟ `}
          <Text style={{ fontWeight: '500' }}>{`ﺲﺠﻟ ﻪﻧا`}</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  loginBox: {
    marginTop: 40,
    padding: 20,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 21,
    height: '50%',
    width: '90%',
    shadowOffset: { height: 2, },
    shadowColor: 'black',
    shadowOpacity: 0.3,
  }
});
