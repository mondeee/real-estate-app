import React, { useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Alert,
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
import { REGISTER, onError, VERIFY_USER } from '../services/graphql/queries'
import { useMutation } from '@apollo/react-hooks';

import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import * as firebase from "firebase";
import { FIREBASE_CONFIG } from '../services/config'

import {
  useStoreState,
  useStoreActions,
} from 'easy-peasy'
import { Toast } from 'native-base';


export default function RegisterScreen(props) {
  const { navigation: { navigate, goBack, state: { params } } } = props

  const storeToken = useStoreActions(actions => actions.auth.setToken)
  const userData = useStoreState(state => state.auth.user)

  const [alerVisible, setAlertVisible] = useState(false)
  const [verify, setVerify] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPass] = useState('')
  const [confirmPassword, setConfirmPass] = useState('')

  const recaptchaVerifier = useRef(null)
  const [code, setCode] = useState('')
  const [verificationid, setVerificationId] = useState(null)

  const [isError, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)
  const [registerUser, { data, loading, error }] = useMutation(REGISTER, {
    onCompleted: e => {
      setVerify(true)
      onSendVerification()
    }
  })

  const [verifyUser, { data: verData, error: verError }] = useMutation(VERIFY_USER, {
    onCompleted: e => {
      setAlertVisible(true)
    }
  })

  useEffect(() => {
    if (params && params.varify_user) {
      setPhone(params.phone)
      setVerify(true)
      onSendVerification()
    }
  }, [])

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

  // onPressRegister = () => {

  //   let error_msg = ''

  //   if (loading) return <ActivityIndicator />

  //   // if (error) {
  //   //   error.graphQLErrors.map(({ message, extensions }, i) => {
  //   //     console.log('Login Error', message)
  //   //     if (extensions && extensions.validation) {
  //   //       for (var key in extensions.validation) {
  //   //         if (extensions.validation.hasOwnProperty(key)) {
  //   //           console.log(key + " -> " + extensions.validation[key]);
  //   //           error_msg = error_msg + extensions.validation[key] + '\n'
  //   //         }
  //   //       }
  //   //     }
  //   //   })
  //   //   Alert.alert('Error', error_msg, [
  //   //     {
  //   //       text: 'OK', onPress: () => {
  //   //         setPass('')
  //   //         setConfirmPass('')
  //   //       }
  //   //     }
  //   //   ])
  //   // }

  //   if (data) {
  //     console.log(data)
  //     AsyncStorage.setItem('token', data.registerUser.token)
  //     setVerify(true)
  //   }

  //   if (!data) {
  //     return
  //   }
  // }

  if (data) {
    console.log(data)
    AsyncStorage.setItem('token', data.registerUser.token)
    // navigate('Home')
    // setAlertVisible(true)
  }

  const onSendVerification = async () => {
    const phoneNum = phone && phone.length > 0 ? `+966${phone.slice(1)}` : `+966${userData.phone.slice(1)}`
    // const phoneNum = '+639276160873'
    console.log('@PHONE', phoneNum)
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
      console.log(verificationid, '\n', code)
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationid,
        code
      );
      await firebase.auth().signInWithCredential(credential);
      Toast.show({
        text: 'تم التحقق من كود التفعيل بنجاح  👍',
        type: 'success'
      })
      verifyUser()
      // onVerifyuserAPI()
      // onPressRegister()
      // setAlertVisible(true)
      // showMessage({ text: "Phone authentication successful 👍" });
    } catch (err) {
      // showMessage({ text: `Error: ${err.message}`, color: "red" });
      console.log('error in verify', err.message)
      Toast.show({
        text: `Error ${err.message}`,
        type: 'danger'
      })
    }
  }

  // const onVerifyuserAPI = () => {
  //   verifyUser()
  // }

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
      onError(e)
    });
  }

  renderVerify = () => {
    return (
      <View keyboardVerticalOffset={20} behavior={"padding"} style={{ ...styles.container, marginTop: '15%', paddingHorizontal: 24 }}>
        <FontAwesome size={50} color={Colors.primaryBlue} name={'lock'} />
        <Text style={{ ...Fonts.FontMed, color: Colors.primaryBlue, fontSize: 20, margin: 12, }}>{`رمز التفعيل`}</Text>
        <Text style={{ ...Fonts.fontRegular, color: Colors.primaryBlue, fontSize: 18 }} >{`تم إرسال رمز التفعيل لجوالك`}</Text>
        <Input onChangeText={setCode} textStyle={{ textAlign: 'center' }} style={{ margin: 15, marginTop: 24 }} />
        <Text style={{ ...Fonts.fontRegular, color: Colors.primaryBlue, fontSize: 13 }}>{`إعادة الإرسال`}</Text>
        <Button style={{ marginTop: 30, width: 177 }} onPress={() => onVerifyCode()} text={`التالي`} />
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
        <Button onPress={() => {
          onPressRegister()
        }} text={`تسجيل`} style={{ width: 177 }} />
        {/* {onPressRegister()} */}
        <View style={{ flexDirection: 'row', marginTop: 12 }}>
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
    navigate('Home', { refresh: false })
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView keyboardVerticalOffset={100} style={{ flex: 1 }} behavior={"padding"}>
        <Header onPressBack={onPressBack} />
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={FIREBASE_CONFIG}
        />
        <ActionComponent success={true} isVisible={alerVisible} onClose={() => navigate('Home')} />
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
