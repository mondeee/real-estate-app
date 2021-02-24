import React, { useEffect, useState } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Toast } from 'native-base'

import Colors from '../styles/Colors';
import { SafeAreaView } from 'react-navigation';
import Fonts from '../styles/Fonts';
import Styles from '../styles/Styles';
import Header from '../components/Header';
import { GET_SUBS, ADD_SUBSCRIPTION } from '../services/graphql/queries'
import { useMutation, useQuery } from '@apollo/react-hooks';
import ViewPager from '@react-native-community/viewpager';
import Button from '../components/Button';
import { onError } from 'apollo-link-error';
import ImageBrowser from '../components/ImageBrowserComponent'
import { HYPERPAY_CONFIG } from '../services/config';
import WebView from 'react-native-webview';
import Modal from 'react-native-modal'
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { checkoutPayment } from '../services/api/checkout_request';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { ScrollView } from 'react-native-gesture-handler';

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height
export default function SubscriptionScreen(props) {
  const { navigate, goBack } = props.navigation
  const [page, setPage] = useState(0)
  const [subs, setSubs] = useState([])
  const [upload, setUpload] = useState(false)
  const [checkoutId, setCheckoutId] = useState(null)
  const [callbackURL, setCallbackURL] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const { loading, error, data } = useQuery(GET_SUBS)
  const [receipt, setReceipt] = useState(null)
  const [isGalleryVisible, setGalleryVisible] = useState(false)
  const [paymentDone, setPaymentDone] = useState(false)
  const [isVisible, setVisible] = useState(false)
  const [item, setItem] = useState(null)

  const userData = useStoreState(state => state.auth.user)
  const storeUser = useStoreActions(actions => actions.auth.setUser)

  const [addSubscription, { data: subData, error: subError }] = useMutation(ADD_SUBSCRIPTION, {
    onCompleted: e => {
      console.log('@results', e)
      setCheckoutId(null)
      setCallbackURL(null)
      setSelectedItem(null)
      goBack()
      Toast.show({
        text: 'تم الاضافة بنجاح',
        type: 'success'
      })
    }
  })

  useState(() => {
    console.log(subError, '\n', subData)
    if (subData) {
      const usercopy = userData
      usercopy.is_subscription = true
      storeUser(usercopy)
    }
  }, [subError, subData])

  const onAddSubsciption = () => {

    const payload = {
      variables: {
        "input": {
          "checkout_id": checkoutId,
          "subscription_id": selectedItem.id
        }
      }
    }

    console.log('@PAYLOAD', payload)
    addSubscription(payload).catch(e => {
      const relog = onError(e)
      if (relog) {
        // navigate('Login')
      }
      // onError(subError)
    })
  }

  useEffect(() => {
    if (data && data.allSubscriptions) {
      console.log('@SUBS', data)
      if (global.isAndroid) {
        setSubs(data.allSubscriptions)
        return
      }
      setSubs(data.allSubscriptions.reverse())
    }
  }, [data])

  useEffect(() => {
    if (selectedItem) {
      // confirmAlert(selectedItem)
      setVisible(true)
    }
  }, [selectedItem])

  useEffect(() => {
    if (paymentDone) {
      onAddSubsciption()
    }
  }, [paymentDone])

  useEffect(() => {
    getInitialURL()
    Linking.addEventListener('url', handleOpenURL)
    // return () => Linking.removeEventListener('url', handleOpenURL)
  }, [])

  const getInitialURL = async () => {
    try {
      let initialURL = Linking.makeUrl('payment');
      console.log('@INITIAL URL', initialURL)
      setCallbackURL(initialURL)
    } catch (e) {
      Alert.alert('Error', JSON.stringify(e))
    }
  }

  const handleOpenURL = (event) => {
    if (Platform.OS === 'ios') {
      WebBrowser.dismissBrowser()
    }
    console.log('LINKING LISTENER', event)
    WebBrowser.dismissBrowser()
    const { path, queryParams } = Linking.parse(event.url)
    if (queryParams.status == 200) {
      console.log("@SUCCESS PAYMENT")
      setPaymentDone(true)
    } else {
      console.log("@FAILED PAYMENT")
      setSelectedItem(null)
      console.log('@PARSE', queryParams)
      Alert.alert("Error", `${queryParams.message}`)
    }
  }

  const confirmAlert = (item) => {
    Alert.alert('تأكيد', ` هل انت متأكد انك تريد الاشتراك في  ${item.name}':`,
      [
        {
          text: "الغاء",
          onPress: () => setSelectedItem(null),
          style: "cancel"
        },
        { text: "الدفع عن طريق فيزا او ماستر كارد", onPress: () => onCheckOutSub('visa', item) },
        { text: "الدفع عن طريق مدى", onPress: () => onCheckOutSub('mada', item) }
      ],
    )
  }

  const renderPaymentTypeModal = () => {
    return (
      <Modal isVisible={isVisible}>
        <View style={{
          backgroundColor: 'white',
          minHeight: '20%',
          padding: 12,
          paddingVertical: 42,
          borderRadius: 5,
        }}>
          <TouchableOpacity onPress={() => onCheckOutSub('mada', item)} style={{
            borderColor: Colors.primaryBlue,
            borderWidth: 1,
            borderRadius: 5,
            padding: 8,
            justifyContent: 'center',
            alignItems: 'center'
            // backgroundColor: 'green'
          }}>
            <Image
              style={{
                height: 80,
                width: '80%',
                resizeMode: 'contain',
                // backgroundColor: 'green'
              }}
              source={require('../../assets/mada-icon.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onCheckOutSub('visa', item)} style={{
            borderColor: Colors.primaryBlue,
            borderWidth: 1,
            borderRadius: 5,
            padding: 8,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 12,
            // backgroundColor: 'green'
          }}>
            <Image
              style={{
                height: 80,
                width: '80%',
                resizeMode: 'contain',
                // backgroundColor: 'green'
              }}
              source={require('../../assets/visa-icon.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setVisible(false)
            setSelectedItem(null)
          }} style={{
            position: 'absolute',
            top: 5,
            right: 5
          }}>
            <MaterialCommunityIcons size={25} color={Colors.primaryBlue} name={'close'} />
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }

  const onCheckOutSub = async (type = 'visa', item) => {
    console.log(selectedItem)
    if (!selectedItem) return
    setVisible(false)
    const { price } = selectedItem
    var payload = {
      entityId: HYPERPAY_CONFIG.PAYMENT_TYPE.VISA.entityId,
      amount: price,
      currency: 'SAR',
      paymentType: 'DB'
    }

    if (type == 'mada') {
      payload = {
        entityId: HYPERPAY_CONFIG.PAYMENT_TYPE.MADA.entityId,
        amount: price,
        currency: 'SAR',
        paymentType: 'DB'
      }
    }
    var qs = require('qs');
    const resp = await checkoutPayment(qs.stringify(payload))
    console.log('@resp', resp)
    if (resp.result.code == "000.200.100") {
      setCheckoutId(resp.id)
      _openWebBrowser(resp.id, type)
    } else {
      Alert.alert('', 'فشلت العملية يرجى المحاولة مرة اخرى')
    }
  }

  const _openWebBrowser = async (id, type = 'visa') => {
    const url = encodeURI(`https://app.nozolsa.com/payments/hyperpay2?checkout_id=${id}&brand=${type}&type=subscription&cburl=${callbackURL}`)
    try {
      if (Platform.OS === 'android') {
        await Linking.openURL(url)
      } else {
        await WebBrowser.openBrowserAsync(url)
      }
    } catch (e) {
      console.log('@ERROR', e)
    }
  }


  const renderIndicator = () => {
    return (
      <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', alignSelf: 'center', padding: 8, paddingTop: 0, alignItems: 'center', justifyContent: 'center', }}>
        {subs && subs.map((i, index) => <View key={index} style={{ ...styles.indicatorStyle, backgroundColor: page == index ? Colors.primaryYellow : Colors.gray }} />)}
      </View>
    )
  }

  const renderInitial = () => {
    const checkoutId = `B68467EE48879BE9269477EA23C6CF6A.uat01-vm-tx01`
    return (
      <View style={{ flex: 1, }}>
        <WebView
          style={{ height: 300, width: deviceWidth }}
          javaScriptEnabled={true}
          scrollEnabled={false}
          bounces={false}
          originWhitelist={['*']}
          scalesPageToFit={true}
          startInLoadingState={true}
          // source={{
          //   uri: 'https://www.yahoo.com',
          // }}
          source={{ uri: encodeURI(`https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutId}`) }}
        />
      </View>
    )

    return (
      <View style={{ flex: 1, paddingTop: 20, alignItems: 'center' }}>
        <Text style={{ ...Fonts.FontMed, fontSize: 20, marginBottom: 20, textAlign: 'center' }}>{`طﺮﻴﻗة ﺎﻟإﺷﺘﺮﺎﻛ:`}</Text>
        <Text style={{ ...Fonts.fontLight, textAlign: 'center' }}>{`-1 ﺖﺣوﻳﻞ ﻢﺒﻠﻏ ﺎﻟإﺷﺘﺮﺎﻛ ﻋﻠﻰ اﻟﺤﺴﺎبﺏاﻟﺘﺎﻟﻲ:`}</Text>
        <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', alignItems: 'center', width: '60%', marginVertical: 20 }}>
          <Image source={require('../../assets/bankimage.png')} style={{ height: 41, width: 141 }} />
          <Text style={{ ...Fonts.fontRegular }}>{`ﺎﺴﻣ ﺎﻠﺒﻨﻛ:`}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', alignItems: 'center', width: '60%', marginBottom: 20 }}>
          <Text style={{ ...Fonts.fontRegular }}>{`SA1230000000000000`}</Text>
          <Text style={{ ...Fonts.fontRegular }}>{`رﻗﻢ ﺎﻠﺤﺳﺎﺑ:ﻥ
)اﻷﻳﺒﺎن(`}</Text>
        </View>
        <Text style={{ ...Fonts.fontLight, fontSize: 16 }}>{`-2 رﻓﻊ ﺻﻮرة ﻢﻧ اﻟﺘﺤﻮﻳﻞ ﻢﻧ ﺦﻟﺎﻟ `}</Text>
        <Text style={{ ...Fonts.fontLight, fontSize: 16 }}>{`ﺖﺤﻤﻴﻟ ﺎﻠﺻورة( <--`}<Text>{`ﺮﻔﻋ حوﺎﻟة <-- `}</Text><Text>{`)ﺢﺳﺎﺒﻳ     <-- `}</Text></Text>
        <TouchableOpacity onPress={() => setGalleryVisible(true)} style={{ marginTop: 20 }}>
          <Text style={{ ...Fonts.fontLight, fontSize: 16 }}>Upload Here</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderPage = (i, index) => {
    return (
      <View style={{
        ...styles.viewPager,
        // backgroundColor: 'green',
      }} key={index}>
        <Text style={styles.titleText}>{i.name}</Text>
        <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', height: '40%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.mainText}>{i.duration}</Text>
          <Image style={{ height: 50, width: 50, }} source={require('../../assets/subiconlarge.png')} />
        </View>
        <Text style={styles.textlabel}>{`${i.price} ريال`}</Text>
        <Text style={{ ...styles.textlabel, fontSize: 19, marginVertical: 8, marginHorizontal: '10%', textAlign: 'center' }}>{i.description}</Text>
        {renderIndicator()}
        <Button onPress={() => {
          console.log('ONPRESS')
          setSelectedItem(i)
          // confirmAlert(i)
        }} style={{ marginVertical: 12 }} text={`اشترك الأن`} />
      </View>
    )
  }

  const renderChoices = () => {
    // if (global.isAndroid) {
    // return (
    //   <ViewPager
    //     initialPage={subs.length - 1}
    //     style={{ flex: 1, width: '100%' }}
    //     onPageSelected={e => setPage(e.nativeEvent.position)}>
    //     {subs && subs.map((i, index) => renderPage(i, index))}
    //   </ViewPager>
    // )
    // 

    return (
      // <View style={{ flex: 1, paddingTop: 20, alignItems: 'center', backgroundColor: 'cyan', width: '100%' }}>
      <ViewPager
        initialPage={subs.length - 1}
        style={{ flex: 1, width: '100%' }}
        onPageSelected={e => setPage(e.nativeEvent.position)}>
        {subs && subs.map((i, index) => renderPage(i, index))}
      </ViewPager>
      // </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header onPressBack={() => {
        setUpload(false)
        navigate('Profile')
        // goBack()
      }} />
      {!upload && renderChoices()}
      {upload && renderInitial()}
      {renderPaymentTypeModal()}
      <ImageBrowser onClose={() => setGalleryVisible(false)} photos={receipt} setPhotos={setReceipt} key={`Upload Receipt `} isVisible={isGalleryVisible} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewPager: {
    // flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: 80
    // justifyContent: 'center',
  },
  titleText: {
    ...Fonts.fontBold,
    fontSize: 23,
    marginTop: 20,
  },
  mainText: {
    ...Fonts.FontMed,
    color: Colors.primaryYellow,
    fontSize: 150,
    marginRight: 16,
  },
  textlabel: {
    ...Fonts.fontLight
  },
  indicatorStyle: {
    width: 7,
    height: 7,
    borderRadius: 14,
    margin: 2,
    backgroundColor: Colors.gray,
  }
});
