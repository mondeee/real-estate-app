import React, { useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
} from 'react-native';
import Header from '../components/Header';
import { SafeAreaView, StackActions, NavigationActions } from 'react-navigation';
import Input from '../components/Input';
import Button from '../components/Button';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Colors from '../styles/Colors';
import Fonts from '../styles/Fonts';
import AlertModal from '../components/AlertComponent';
import ActionComponent from '../components/ActionComponent';
import { REGISTER, onError, VERIFY_USER, SEND_VERIFICATION_CODE } from '../services/graphql/queries'
import { useMutation } from '@apollo/react-hooks';

import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import * as firebase from "firebase";
import { FIREBASE_CONFIG } from '../services/config'

import {
  useStoreState,
  useStoreActions,
} from 'easy-peasy'
import { Toast } from 'native-base';
import OTPInputView from '@twotalltotems/react-native-otp-input';


export default function RegisterScreen(props) {
  const { navigation: { navigate, goBack, state: { params } } } = props

  const storeToken = useStoreActions(actions => actions.auth.setToken)
  const userData = useStoreState(state => state.auth.user)
  const local_verification_code = useStoreActions(state => state.auth.verification_code)
  const storeVerCode = useStoreActions(actions => actions.auth.setVerificationCode)
  const storeLocalPhone = useStoreActions(actions => actions.auth.setPhone)
  const localPhone = useStoreState(state => state.auth.phone)

  const [alerVisible, setAlertVisible] = useState(false)
  const [verify, setVerify] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPass] = useState('')
  const [confirmPassword, setConfirmPass] = useState('')
  const [countdown, setCountDown] = useState(25)
  const [hideHeader, setHideHeader] = useState(false)

  const recaptchaVerifier = useRef(null)
  const [code, setCode] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [verificationid, setVerificationId] = useState(null)

  const [isError, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)
  const [registerUser, { data, loading, error }] = useMutation(REGISTER, {
    onCompleted: e => {
      setVerify(true)
      sendVerificationCode()
    }
  })

  const [verifyUser, { data: verData, error: verError }] = useMutation(VERIFY_USER, {
    onCompleted: e => {
      setAlertVisible(true)
    }
  })

  const [sendVerificationCode, { data: verCodeData, error: verCodeError }] = useMutation(SEND_VERIFICATION_CODE, {
    variables: {
      input: {
        phone: phone || localPhone,
      }
    }
  })

  useEffect(() => {
    if (verCodeData) {
      console.log("CODE RESP", verCodeData)
      setVerificationCode(verCodeData.sendVerification.code)
      storeVerCode(verCodeData.sendVerification.code)
    }

    if (verCodeError) {
      console.log('CODE ERROR', verCodeError)
      Alert.alert('', 'فشل في عملية إعادة الارسال ، يرجى المحاولة مرة اخرى.')
    }
  }, [verCodeData, verCodeError])


  useEffect(() => {
    let interval = null

    if (verify && countdown > 0) {
      interval = setInterval(() => {
        setCountDown(countdown => countdown - 1);
      }, 1000);
    } else if (!verify && countdown !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);

  }, [verify, countdown])

  useEffect(() => {
    if (params && params.varify_user) {
      setPhone(params.phone)
      setVerify(true)
      sendVerificationCode()
      // setVerificationCode(local_verification_code)
      // onSendVerification()
    }
    console.log('stored', local_verification_code)

    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };

  }, [])

  const _keyboardDidShow = () => {
    // alert('Keyboard Shown');
    if (Platform.OS === 'android') {
      setHideHeader(true)
    }
  };

  const _keyboardDidHide = () => {
    // alert('Keyboard Hidden');
    if (Platform.OS === 'android') {
      setHideHeader(false)
    }
  };


  useEffect(() => {
    if (verError) {
      deleteToken()
      console.log('@Err', verError)
    }

    if (error) {
      deleteToken()
    }

    if (verData) console.log('@Data', verData)

  }, [verData, verError, error])

  const deleteToken = async () => {
    await AsyncStorage.removeItem('token')
    // navigate('Home', { refresh: false })
  }

  if (data) {
    // console.log(data)
    AsyncStorage.setItem('token', data.registerUser.token)
    storeLocalPhone(phone)
    // AsyncStorage.setItem('phone', phone)
    // navigate('Home')
    // setAlertVisible(true)
  }

  const onSendVerification = async () => {
    const phoneNum = phone && phone.length > 0 ? `+966${phone.slice(1)}` : `+966${userData.phone.slice(1)}`
    // const phoneNum = '+639276160873'
    try {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNum,
        recaptchaVerifier.current
      );
      console.log('@CODE', phoneProvider, verificationId)
      setVerificationId(verificationId);
      Toast.show({
        text: 'Verification code has been sent to your phone',
        type: 'success'
      })
    } catch (err) {
      console.log('error on send verification code', err.message)
      Toast.show({
        text: `Error: ${err.message}`,
        type: 'danger'
      })
    }
  }

  const onVerifyCode = async () => {
    try {
      if (code == verificationCode) {
        verifyUser()
      } else {
        Alert.alert('', 'رمز التفعيل غير صحيح')
      }
    } catch (err) {
      // showMessage({ text: `Error: ${err.message}`, color: "red" });
      console.log('error in verify', err.message)
      Toast.show({
        text: `Error ${err.message}`,
        type: 'danger'
      })
    }
  }

  const onPressRegister = () => {
    if (!name || !password || !phone) return

    if (phone && phone.length != 10) {
      Toast.show({
        text: 'رقم الجوال يجب ان يكون 10 ارقام',
        type: 'danger'
      })
      return
    }

    if (password != confirmPassword) {
      Alert.alert('كلمة المرور غير متطابقة ')
      return
    }


    registerUser({
      variables: {
        "input": {
          "avatar": null,
          "name": name,
          "phone": phone,
          "email": null,
          "password": password,
          "password_confirmation": confirmPassword,
          "role_id": 2
        }
      }
    }).catch(e => {
      const relog = onError(e)
    });

  }

  renderVerify = () => {
    return (
      <View keyboardVerticalOffset={20} behavior={"padding"} style={{ ...styles.container, marginTop: '15%', paddingHorizontal: 24 }}>
        <FontAwesome size={50} color={Colors.primaryBlue} name={'lock'} />
        <Text style={{ ...Fonts.FontMed, color: Colors.primaryBlue, fontSize: 20, margin: 12, }}>{`رمز التفعيل`}</Text>
        <Text style={{ ...Fonts.fontRegular, color: Colors.primaryBlue, fontSize: 18 }} >{`تم إرسال رمز التفعيل لجوالك`}</Text>
        {/* <Input maxLength={5} onChangeText={setCode} textStyle={{ textAlign: 'center' }} style={{ margin: 15, marginTop: 24 }} /> */}
        <OTPInputView
            style={{ width: "80%", maxHeight: 100, }}
            pinCount={4}
            onCodeChanged={e => setCode(e)}
            autoFocusOnLoad
            codeInputFieldStyle={{
              borderColor: Colors.primaryBlue,
              fontSize: 18,
              color: Colors.primaryBlue,
            }}
            codeInputHighlightStyle={{
              color: Colors.primaryBlue,
            }}
            onCodeFilled={code => {
              console.log(`Code is ${code}, you are good to go!`);
              // setCountDown(25)
              // sendVerificationCode()
              // onVerifyCode()
            }}
          />
        {/* <Text style={{ ...Fonts.fontRegular, color: Colors.primaryBlue, fontSize: 13 }}>{`إعادة الإرسال`}</Text> */}
        <Button style={{ marginTop: 20, width: 177 }} onPress={() => onVerifyCode()} text={`التالي`} />
        <Button disabled={countdown > 0} style={{ marginTop: 12, width: 177, backGroundColor: countdown == 0 ? Colors.primaryYellow : Colors.gray }} onPress={() => {
          setCountDown(25)
          sendVerificationCode()
        }} text={`إعادة إرسال (${countdown})`} />
      </View>
    )
  }

  renderRegister = () => {
    return (
      <View keyboardVerticalOffset={10} behavior={"position"} style={{ ...styles.container, paddingHorizontal: 24, }}>
        <Input onChangeText={setName} placeholder={`الاسم`} style={{ marginBottom: 30, marginTop: 50 }} rightIcon={'user'} />
        <Input onChangeText={setPhone} placeholder={`رقم الجوال`} style={{ marginBottom: 30 }} rightIcon={'phone'} maxLength={10} keyboardType={'numeric'} />
        <Input onChangeText={setPass} password placeholder={`كلمة المرور`} style={{ marginBottom: 30 }} rightIcon={'lock'} />
        <Input onChangeText={setConfirmPass} password placeholder={`تأكيد كلمة المرور`} style={{ marginBottom: 25 }} rightIcon={'lock'} />
        <Button disabled={(!name || !password || !phone || !confirmPassword || loading)} onPress={() => {
          onPressRegister()
        }} text={`تسجيل`} style={{ width: 177 }} />
        {/* {onPressRegister()} */}
        <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', marginTop: 12 }}>
          <View style={{ width: 4 }} />
          <Text onPress={() => navigate('Login')} style={{ color: Colors.primaryBlue, ...Fonts.fontRegular }}>
            {`  لديك حساب مسبقا؟  `}
            <Text style={{ fontWeight: '500' }}>{`سجل هنا`}</Text>
          </Text>
        </View>
      </View>
    )
  }

  onSubmitRegister = () => {

  }

  onPressBack = () => {
    if (verify && params) {
      navigate('Login')
      return
    }
    if (verify) {
      setVerify(false)
      return
    }
    // navigate('Home', { refresh: false })
    navigate('Login')
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView keyboardVerticalOffset={60} style={{ flex: 1 }} behavior={"padding"}>
        {!hideHeader && <Header onPressBack={onPressBack} />}
        <ActionComponent success={true} isVisible={alerVisible} onClose={() => navigate('Home', { restart: true })} />
        {!verify && renderRegister()}
        {verify && renderVerify()}
      </KeyboardAvoidingView>
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
