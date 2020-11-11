import React, { useEffect, useState } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions, Alert
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

import { checkoutPayment } from '../services/api/checkout_request';

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
      onError(e)
      // onError(subError)
    })
  }

  useEffect(() => {
    if (data && data.allSubscriptions) {
      console.log('@SUBS', data)
      setSubs(data.allSubscriptions)
    }
  }, [data])

  useEffect(() => {
    if (selectedItem) {
      confirmAlert(selectedItem)
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
    return () => Linking.removeEventListener('url', handleOpenURL)
  }, [])

  const getInitialURL = async () => {
    let initialURL = Linking.makeUrl('payment');
    console.log('@INITIAL URL', initialURL)
    setCallbackURL(initialURL)
  }

  const handleOpenURL = (event) => {
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

  const onCheckOutSub = async (type = 'visa', item) => {
    console.log(selectedItem)
    if (!selectedItem) return
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
      await WebBrowser.openBrowserAsync(url)
    } catch (e) {
      console.log('@ERROR', e)
    }
  }


  const renderIndicator = () => {
    return (
      <View style={{ flexDirection: 'row-reverse', alignSelf: 'center', padding: 8, paddingTop: 0, alignItems: 'center', justifyContent: 'center', }}>
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
      }} key={index}>
        <Text style={styles.titleText}>{i.name}</Text>
        <View style={{ flexDirection: 'row', height: '40%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.mainText}>{i.duration}</Text>
          <Image style={{ height: 50, width: 50, }} source={require('../../assets/subiconlarge.png')} />
        </View>
        <Text style={styles.textlabel}>{`ًايونس /س.ر ${i.price}`}</Text>
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
    return (
      // <View style={{ flex: 1, paddingTop: 20, alignItems: 'center', backgroundColor: 'cyan', width: '100%' }}>
      <ViewPager
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
        goBack()
      }} />
      {!upload && renderChoices()}
      {upload && renderInitial()}
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
