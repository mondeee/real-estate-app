import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  StatusBar,
  Dimensions,
  StyleSheet,
  Text,
  // Input,
  Modal,
  TouchableOpacity,
  View,
  AsyncStorage,
  KeyboardAvoidingView,
} from 'react-native';
import Colors from '../styles/Colors';
import Fonts from '../styles/Fonts';
import Button from './Button';
import Input from "./Input";
import { CONFIG } from '../services/config';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useStoreActions, useStoreState } from 'easy-peasy';
import { ADD_FFEDBACK, onError } from '../services/graphql/queries';
import { useMutation } from '@apollo/react-hooks';

const navList = [
  { label: 'تسجيل الدخول', key: 0, route: 'Register' },
  { label: ' ﻣﻦ نحن ', key: 1, route: 'Terms' },
  // { label: 'Booking', key: 2, route: 'BookingList' },
  { label: 'الشروط والأحكام \n وسياسة الخصوصية', key: 3, route: 'Terms' },
  { label: 'الأسئلة الشائعة', key: 4, route: 'FAQ' },
  { label: 'أعطنا رأيك عن التطبيق', key: 5, route: 'showmodalfeedback' },
  { label: 'تواصل معنا', key: 6, route: 'Contact' },
  // { label: CONFIG.BUILD_VERSION, key: 6, route: '' }
]

export default function SideBar(props) {
  // const { navigate } = props.navigation
  const [isLogin, setLogin] = useState(false)
  const userData = useStoreState(state => state.auth.user)
  const storeUser = useStoreActions(actions => actions.auth.setUser)

  const [payload, setPayload] = useState(null)
  const [modalVisible, setModalVisible] = useState(false);
  const [feedBackModal, setFeedBackModal] = useState(false)

  const fetchToken = async () => {
    const token = await AsyncStorage.getItem('token')
    if (token && token.length > 0) {
      console.log(token)
      setLogin(true)
    }
  }

  const deleteToken = async () => {
    await AsyncStorage.removeItem('token')
    await storeUser(null)
    setLogin(false)
    props.navigate('Login')
  }

  const [addFeedBack, { data: resp, loading, error }] = useMutation(ADD_FFEDBACK, {
    onCompleted: e => {
      // setFeedBackModal(false)
      // Toast.show({
      //   type: 'success',
      //   text: 'تم الارسال بنجاح '
      // })
      Alert.alert('', 'تم الارسال بنجاح', [
        {
          text: 'OK', onPress: async () => {
            setFeedBackModal(false)
          }
        }
      ])
    },
    // onError: e => {
    //   console.log(JSON.stringify(e))
    //   onHandleError(e)
    // }
  })

  useEffect(() => {
    console.log(JSON.stringify(error))
    if (resp) {
      console.log(resp)
    }

    if (error) {
      onError(error)
    }
  }, [resp, error])

  const _onAddFeedBack = () => {
    console.log(payload)
    if (payload && payload?.comment) {
      addFeedBack({
        variables: {
          input: payload
        }
      })
    }
    // setFeedBackModal(false)
  }

  useEffect(() => {
    if (!userData) {
      setLogin(false)

    } else {
      const data = {
        name: userData.name,
        phone: userData.phone,
        email: userData.email
      }
      setPayload(data)
    }
  }, [userData])

  useEffect(() => {
    fetchToken()
  }, [])


  renderFooter = () => {
    return (
      <View style={{ alignSelf: 'flex-end', alignItems: 'center', width: '100%', flex: .5 }}>
        {/* <Text style={{ ...Fonts.FontMed, fontSize: 14, color: Colors.primaryBlue }}>{`ﻧﻔﺬ ﺑﻮاﺳﻄﺔ`}</Text>
        <Image style={{ height: 33, width: 83 }} resizeMode={'contain'} source={require('../../assets/sidebar_footer.png')} /> */}
      </View>
    )
  }

  renderNavList = () => {
    return (
      <View style={{ width: '100%', paddingHorizontal: 20, paddingTop: 20 }}>
        {navList && navList.map((i, index) => {
          if (isLogin && index == 0) return null
          return (
            <TouchableOpacity
              key={i.key}
              onPress={() => {
                if (i.key == 1) {
                  props.navigate(i.route, { aboutus: true })
                  return
                }

                if (i.key == 5) {
                  setFeedBackModal(true);
                  return
                }

                props.navigate(i.route)
              }}
            >
              <Text
                style={{
                  paddingVertical: 13,
                  alignSelf: global.isAndroid ? 'flex-start' : 'flex-end',
                  color: Colors.primaryBlue,
                  fontSize: 16,
                  textAlign: global.isAndroid ? 'left' : 'right',
                  ...Fonts.fontRegular
                }} key={i.key}>{i.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  const renderFeedBackModal = () => {
    return (
      <View style={{ position: 'absolute', top: 0, left: 0 }}>
        <Modal animationType="slide" transparent={true} visible={feedBackModal}>
          <KeyboardAvoidingView style={styles.centeredView} contentContainerStyle={{ width: '100%' }} enabled behavior='position' keyboardVerticalOffset={-100} >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={{ ...Fonts.FontMed, marginBottom: 8 }}>{'رأيك عن التطبيق'}</Text>
                {!isLogin && <Input style={{ marginBottom: 8 }} onChangeText={e => {
                  const item = { ...payload }
                  item.name = e
                  setPayload(item)
                }} placeholder={"اسم المستخدم"} />}
                {!isLogin && <Input style={{ marginBottom: 8 }} onChangeText={e => {
                  const item = { ...payload }
                  item.email = e
                  setPayload(item)
                }} placeholder={"الإيميل الإلكتروني"} />}
                {!isLogin && <Input style={{ marginBottom: 8 }} onChangeText={e => {
                  const item = { ...payload }
                  item.phone = e
                  setPayload(item)
                }} placeholder={"رقم الجوال"} />}
                <Input maxLength={300} style={{ height: 120, marginBottom: 8 }} onChangeText={e => {
                  const item = { ...payload }
                  item.comment = e
                  setPayload(item)
                }} placeholder={"الوصف"} multiline />
                <Button
                  text={'التالي'}
                  textStyle={{ fontSize: 16, fontWeight: "bold" }}
                  style={styles.downloadButton}
                  onPress={() => {
                    _onAddFeedBack();
                  }}
                />
                <TouchableOpacity onPress={() => setFeedBackModal(false)} style={{
                  position: 'absolute', top: 10,
                  right: 10, height: 20, width: 30,
                  alignItems: 'flex-end',
                  // backgroundColor: 'green'
                }}>
                  <MaterialCommunityIcons size={20} name={"close"} />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    );
  };

  return (
    <View style={{ ...styles.container, paddingBottom: 40 }}>
      {feedBackModal && renderFeedBackModal()}
      <View style={{ backgroundColor: Colors.primaryBlue, flex: 1.1 }} />
      <View style={{ ...styles.container, flex: 2.4, alignItems: 'center', paddingHorizontal: 12, }}>
        <View style={{ height: '15%' }} />
        <Text style={{
          color: Colors.primaryBlue,
          fontSize: 21,
          ...Fonts.fontBold,
        }}>{`تطبيق نزل`}</Text>
        {renderNavList()}
        {isLogin && <Button onPress={() => deleteToken()} text={`تسجيل خروج`} />}
      </View>
      <Image style={styles.logoContainer} source={require('../../assets/sidebar_logo.png')} />
      {renderFooter()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  logoContainer: {
    height: 118,
    width: 118,
    borderRadius: 30,
    // backgroundColor: 'white',
    position: "absolute",
    top: "13%",
    left: "29%",
  },
  logoReverseContainer: {
    height: 118,
    width: 118,
    borderRadius: 30,
    // backgroundColor: 'white',
    position: "absolute",
    top: "13%",
    right: "29%",
  },
  clientButton: {
    marginLeft: 10,
    marginTop: 5,
    width: 90,
    height: 35,
    paddingTop: 0,
  },
  ownerButton: {
    marginLeft: 10,
    marginTop: 5,
    width: 130,
    height: 35,
    paddingTop: 0,
  },
  downloadButton: {
    marginTop: 5,
    width: 180,
    height: 40,
    paddingTop: 0,
  },
  centeredView: {
    position: "absolute",
    // width: Dimensions.get("window").width,
    // height: Dimensions.get("window").height,
    height: Dimensions.get("window").height,
    width: '100%',
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "#33333355",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    alignSelf: 'center',
    marginTop: '70%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    fontSize: 16,
    textAlign: "center",
  },

});
