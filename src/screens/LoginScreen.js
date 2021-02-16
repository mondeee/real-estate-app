import React, { useEffect, useState, useRef } from 'react';
import {
  Alert,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  I18nManager,
  AsyncStorage,
} from 'react-native';
import Header from '../components/Header';
import Modal from 'react-native-modal'
import { SafeAreaView } from 'react-navigation';
import Input from '../components/Input';
import Fonts from '../styles/Fonts';
import Colors from '../styles/Colors';
import Button from '../components/Button'
import { LOGIN, onError, FORGET_PASSWORD, CHANGE_PASS } from '../services/graphql/queries'
import { useMutation } from '@apollo/react-hooks';

import {
  useStoreState,
  useStoreActions,
} from 'easy-peasy'

const isAndroid = Platform.OS === 'android' && I18nManager?.isRTL;

export default function LoginScreen(props) {
  const { navigate, goBack, state: { params } } = props.navigation
  const storeToken = useStoreActions(actions => actions.auth.setToken)

  const [agree, setAgree] = useState(false)
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [code, setCode] = useState(null)
  const [isVisible, setVisible] = useState(false)
  const [fgphone, setFgPhone] = useState('')
  const [verify, setVerify] = useState(false)
  const [showCPModal, setShowCPModal] = useState(false)
  const [authToken, setAuthToken] = useState(null)
  const [cppassword, setcppassword] = useState(null)
  const [cpconfirmpassword, setcpconfirmpassword] = useState(null)


  const [loginViaPhone, { data, loading, error }] = useMutation(LOGIN)

  const [forgetPassword, { data: fdata, loading: floading, error: ferror }] = useMutation(FORGET_PASSWORD, {
    onCompleted: () => {
      Alert.alert('', 'تم إرسال الرمز بنجاح')
      setVerify(true)
    }
  })

  const [changePass, { data: cpdata, loading: cploading, error: cperror }] = useMutation(CHANGE_PASS, {
    onCompleted: () => {
      // AsyncStorage.removeItem('token')
      Alert.alert('', 'يمكنك الان تسجيل الدخول باستخدام كلمة المرور الجديدة', [
        {
          onPress: () => _onCloseModal(),
          text: 'OK'
        }
      ])
    }
  })

  // if (data) {
  //   AsyncStorage.setItem('token', data.loginViaPhone.token)
  //   navigate('Home')
  // }


  useEffect(() => {
    console.log('@DATA', data, error)
    if (data) {
      saveToken()
    }

    if (error) {
      deleteToken()
    }
  }, [data, error])

  useEffect(() => {

    // if (params?.isTokenValid) {
    //   navigate('Home')
    // }
  }, [])

  const saveToken = async () => {
    const save = await AsyncStorage.setItem('token', data.loginViaPhone.token)
    navigate('Home', { refresh: false })
  }

  const deleteToken = async () => {
    await AsyncStorage.removeItem('token')
    // navigate('Home', { refresh: false })
  }

  const _forgotPassword = () => {

    // setVisible(false)}
    if (!fgphone || fgphone?.length < 10) {
      Alert.alert('رقم الجوال يجب ان يكون 10 ارقام')
      return
    }
    // setVerify(true)

    const payload = {
      input: {
        phone: fgphone
      }
    }
    forgetPassword({
      variables: payload
    }).catch(e => onError(e))
  }

  const _verifyCode = async () => {

    if (fdata.forgotViaPhone.code) {
      if (code == fdata.forgotViaPhone.code) {
        setShowCPModal(true)
        await AsyncStorage.setItem('token', fdata.forgotViaPhone.token).then(() => {
          // Updates.reload()
        })
      } else {
        Alert.alert('', 'رمز التفعيل غير صحيح')
      }
    } else {
      Alert.alert('ERROR!', 'something went wrong!')
      _onCloseModal()
    }
  }

  const _changePass = () => {
    if (cppassword != cpconfirmpassword) {
      Alert.alert('كلمة المرور غير متطابقة ')
      return
    }

    const payload = {
      input: {
        password: cppassword,
        password_confirmation: cpconfirmpassword
      }
    }
    changePass({ variables: payload }).catch(e => onError(e))
  }

  const renderModal = () => {
    return (
      <Modal
        isVisible={isVisible}
      >
        {renderInputModal()}
      </Modal>
    )
  }

  const _onCloseModal = async () => {
    setVisible(false)
    setShowCPModal(false)
    setVerify(false)
    await AsyncStorage.removeItem('token')
  }

  useEffect(() => {
    console.log('@DATA\n', fdata)
    console.log('@ERROR\n', ferror)

    // if (data) {
    //   setCode(fdata.forgotViaPhone.code)
    // }
  }, [fdata, ferror])

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


  const renderInputModal = () => {

    if (showCPModal) {
      return (
        <View style={{
          backgroundColor: 'white',
          borderRadius: 10,
          padding: 12,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Text style={{ ...Fonts.FontMed, color: Colors.primaryBlue, fontSize: 20, margin: 12, }}>{`تغيير كلمة المرور`}</Text>
          <Input key={'cppassword'} onChangeText={setcppassword} placeholder={"كلمة المرور"} style={{ marginVertical: 8, marginTop: 24, }} password rightIcon='lock' />
          <Input key={'cppassword2'} onChangeText={setcpconfirmpassword} placeholder={"تأكيد كلمة المرور"} style={{ marginBottom: 25 }} password rightIcon='lock' />
          {/* التالي */}
          <View style={{ flexDirection: 'row', }}>
            <Button style={{ width: '40%' }} onPress={() => _onCloseModal(false)} text={'إلغاء'} />
            <View style={{ width: '5%' }} />
            <Button style={{ width: '40%', }} onPress={() => _changePass()} text={'التالي'} />
          </View>
        </View>
      )
    }

    if (verify) {
      return (
        <View style={{
          backgroundColor: 'white',
          borderRadius: 10,
          padding: 12,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Text style={{ ...Fonts.FontMed, color: Colors.primaryBlue, fontSize: 20, margin: 12, }}>{`رمز التفعيل`}</Text>
          <Text style={{ ...Fonts.fontRegular, color: Colors.primaryBlue, fontSize: 16 }} >{"تم إرسال رمز التفعيل لجوالك"}</Text>
          <Input onChangeText={setCode} textStyle={{ textAlign: 'center' }} style={{ margin: 15, marginTop: 24, height: 45 }} />
          {/* التالي */}
          <View style={{ flexDirection: 'row', marginTop: 20, }}>
            <Button style={{ width: '40%' }} onPress={() => _onCloseModal(false)} text={'إلغاء'} />
            <View style={{ width: '5%' }} />
            <Button style={{ width: '40%', }} onPress={() => _verifyCode()} text={'التالي'} />
          </View>
        </View>
      )
    }

    // MAIN
    return (
      <View style={{
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Text style={{
          ...Fonts.fontBold,
          width: '100%',
          textAlign: 'center',
          fontSize: 20,
        }}>{`نسيت كلمة المرور`}</Text>
        <Input style={{ marginVertical: 20 }} maxLength={10} onChangeText={setFgPhone} placeholder={`رقم الجوال`} rightIcon='phone' keyboardType={'numeric'} />
        {/* التالي */}
        <View style={{ flexDirection: 'row', }}>
          <Button style={{ width: '40%' }} onPress={() => _onCloseModal(false)} text={'إلغاء'} />
          <View style={{ width: '5%' }} />
          <Button loading={floading} style={{ width: '40%', }} onPress={() => _forgotPassword()} text={'التالي'} />
        </View>
      </View>
    )
  }


  return (
    <SafeAreaView style={styles.container}>
      {/* <Text>Login</Text> */}
      <Header />
      <View elevation={3} style={styles.loginBox}>
        <Input maxLength={10} onChangeText={setPhone} placeholder={`رقم الجوال`} style={{ marginBottom: 25, marginTop: 40 }} rightIcon='phone' />
        <Input onChangeText={setPassword} placeholder={`كلمة المرور`} style={{ marginBottom: 25 }} password rightIcon='lock' />
        <TouchableOpacity onPress={() => setVisible(true)} style={{ width: '75%', marginBottom: 10 }}>
          <Text style={{ ...Fonts.fontRegular, width: '100%', textAlign: global.isAndroid ? 'left' : 'right', textDecorationLine: 'underline' }}>{`نسيت كلمة المرور؟`}</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => setAgree(!agree)} style={{ width: '65%', marginBottom: 10, flexDirection: global.isAndroid ? 'row-reverse' : 'row' }}>
          <Text style={{ ...Fonts.fontRegular, width: '100%', textAlign: global.isAndroid ? 'left' : 'right' }}>{`أوافق على الشروط و الأحكام`}</Text>
          <View style={{
            borderRadius: 30,
            height: 14,
            width: 14,
            borderWidth: 1,
            borderColor: Colors.primaryBlue,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: global.isAndroid ? 0 : 8,
            marginRight: global.isAndroid ? 8 : 0,
          }}>
            {agree && <View style={{ borderRadius: 30, height: 10, width: 10, backgroundColor: Colors.primaryBlue }} />}
          </View>
        </TouchableOpacity> */}
        {loginButton()}
        {!loading ? <Button onPress={() => {
          if (!phone || !password) return
          if (phone && phone?.length <= 6) {
            Alert.alert('', 'كلمة المرور يجب ان تقول على الاقل ٦ احرف/ارقام')
          }
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
        }} text={`تسجيل الدخول`} style={{ marginTop: 24 }} /> : <ActivityIndicator />}
        {/* <Button onPress={() => navigate('Home')} text={`ﺖﺴﺠﻴﻟ ﺎﻟﺪﺧﻮﻟ`} style={{ marginTop: 24 }} /> */}
        <Text onPress={() => navigate('Terms_', { show: true, login: true })} style={{ color: Colors.primaryBlue, ...Fonts.fontRegular, marginTop: 12 }}>
          {` تسجيل جديد `}
          <Text style={{ fontWeight: '500' }}>{`ليس لديك حساب؟ `}</Text>
        </Text>
      </View>
      {renderModal()}
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
    height: Platform.OS == 'android' ? '60%' : '50%',
    width: '90%',
    shadowOffset: { height: 2, },
    shadowColor: 'black',
    shadowOpacity: 0.3,
  }
});
