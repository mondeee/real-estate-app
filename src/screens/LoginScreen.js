import React, { useEffect, useState, useRef } from 'react';
import {
  Alert,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage,
} from 'react-native';
import Header from '../components/Header';
import { SafeAreaView } from 'react-navigation';
import Input from '../components/Input';
import Fonts from '../styles/Fonts';
import Colors from '../styles/Colors';
import Button from '../components/Button'
import { LOGIN, onError } from '../services/graphql/queries'
import { useMutation } from '@apollo/react-hooks';

import {
  useStoreState,
  useStoreActions,
} from 'easy-peasy'

export default function LoginScreen(props) {
  const { navigate, goBack } = props.navigation
  const storeToken = useStoreActions(actions => actions.auth.setToken)

  const [agree, setAgree] = useState(false)
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loginViaPhone, { data, loading, error }] = useMutation(LOGIN)



  // if (data) {
  //   AsyncStorage.setItem('token', data.loginViaPhone.token)
  //   navigate('Home')
  // }


  useEffect(() => {
    console.log('@DATA', data, error)
    if (data) {
      saveToken()
    }
  }, [data, error])

  const saveToken = async () => {
    const save = await AsyncStorage.setItem('token', data.loginViaPhone.token)
    navigate('Home', { refresh: false })
  }

  loginButton = () => {
    // const [loginViaPhone, { data, loading, error }] = useMutation(LOGIN)

    // if (loading) return <ActivityIndicator />

    // if (error) error.graphQLErrors.map(({ message }, i) => console.log(message))

    // if (data) {
    //   storeToken(data.loginViaEmail.token)
    // }

    // return <Button onPress={() => {
    //   if (!phone || !password) return
    //   loginViaPhone({
    //     variables: {
    //       "input": {
    //         "phone": phone,
    //         "password": password
    //       }
    //     }
    //   }).catch(e => {
    //     onError(e)
    //   })
    // }} text={`ﺖﺴﺠﻴﻟ ﺎﻟﺪﺧﻮﻟ`} style={{ marginTop: 24 }} />
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text>Login</Text> */}
      <Header onPressBack={() => navigate('register')} />
      <View elevation={3} style={styles.loginBox}>
        <Input maxLength={10} onChangeText={setPhone} placeholder={`رقم الجوال`} style={{ marginBottom: 25, marginTop: 40 }} rightIcon='phone' />
        <Input onChangeText={setPassword} placeholder={`كلمة المرور`} style={{ marginBottom: 25 }} password rightIcon='lock' />
        <TouchableOpacity style={{ width: '75%', marginBottom: 10 }}>
          <Text style={{ ...Fonts.fontRegular, width: '100%', textAlign: 'right', textDecorationLine: 'underline' }}>{`نسيت كلمة المرور؟`}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setAgree(!agree)} style={{ width: '65%', marginBottom: 10, flexDirection: 'row' }}>
          <Text style={{ ...Fonts.fontRegular, width: '100%', textAlign: 'right' }}>{`أوافق على الشروط و الأحكام`}</Text>
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
        {/* {loginButton()} */}
        <Button onPress={() => {
          if (!phone || !password) return
          loginViaPhone({
            variables: {
              "input": {
                "phone": phone,
                "password": password,
                "role_id": 2,
              }
            }
          }).catch(e => {
            onError(e)
          })
        }} text={`تسجيل الدخول`} style={{ marginTop: 24 }} />
        {/* <Button onPress={() => navigate('Home')} text={`ﺖﺴﺠﻴﻟ ﺎﻟﺪﺧﻮﻟ`} style={{ marginTop: 24 }} /> */}
        <Text onPress={() => navigate('Register')} style={{ color: Colors.primaryBlue, ...Fonts.fontRegular, marginTop: 12 }}>
          {` تسجيل جديد `}
          <Text style={{ fontWeight: '500' }}>{`ليس لديك حساب؟ `}</Text>
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
