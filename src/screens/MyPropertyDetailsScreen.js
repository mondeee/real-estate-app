import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
  Platform,
  I18nManager
} from 'react-native';

import Colors from '../styles/Colors';
import { SafeAreaView } from 'react-navigation';
import Fonts from '../styles/Fonts';
import ViewPager from '@react-native-community/viewpager';
import { SAMPLE_LIST, COMMERCIAL_FACILITIES, PRIVATE_FACILITIES } from '../constants/data';
import { MaterialIcons, FontAwesome, EvilIcons, FontAwesome5 } from '@expo/vector-icons';
import Styles from '../styles/Styles';
import { GET_ALL_PROPERTIES, CREATE_ROOM } from '../services/graphql/queries'
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { IMAGE_URL } from '../services/api/url';
import Button from '../components/Button';
import * as firebase from 'firebase';
import { useStoreState } from 'easy-peasy';
import { Toast } from 'native-base';

const isAndroid = Platform.OS === 'android' && I18nManager?.isRTL;

const FEATURES = [
  {
    type: 'bed',
  },
  {
    type: 'toilet',
  },
  {
    type: 'master bedroom',
  },
  {
    type: 'kitchen',
  }
]

export default function MyPropertyDetailsScreen(props) {
  const { goBack, navigate, state: { params: { item } } } = props.navigation
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(item.images)
  const [isFavorite, setFavorite] = useState(false)
  const [rating, setRating] = useState(item.review_average)
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState(null)
  const userData = useStoreState(state => state.auth.user)

  useEffect(() => {
    setTotalPages(item.images)
    // _fetchToken()
    console.log('@ITEM', item.sections)
  }, [])

  const _fetchToken = async () => {
    // const ftoken = await AsyncStorage.getItem('token')
    // setToken(ftoken)
  }


  const renderIndicator = () => {
    return (
      <View style={{ flexDirection: isAndroid ? 'row' : 'row-reverse', alignSelf: 'center', padding: 8, paddingTop: 0, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 0 }}>
        {item.images && item.images.map((i, index) => <View key={index} style={{ ...styles.indicatorStyle, backgroundColor: page == index ? Colors.primaryYellow : Colors.gray }} />)}
      </View>
    )
  }

  const renderTopButtons = () => {
    return (
      <View style={{ position: 'absolute', top: 0, padding: 12, flexDirection: global.isAndroid ? 'row-reverse' : 'row', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', }}>
        <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', alignItems: 'center' }}>
          <TouchableOpacity>
            <Image style={{ height: 27, resizeMode: 'contain', marginRight: 20, marginBottom: 10 }} source={require('../../assets/uploadicon.png')} />
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => setFavorite(!isFavorite)}>
            <FontAwesome size={18} color={isFavorite ? 'red' : 'white'} name={isFavorite ? 'heart' : 'heart-o'} />
          </TouchableOpacity> */}
        </View>
        <TouchableOpacity style={{ alignSelf: 'center', marginBottom: 3 }} onPress={() => navigate('Home')}>
          <MaterialIcons size={30} color={'white'} name={'chevron-right'} />
        </TouchableOpacity>
      </View>
    )
  }

  const renderStars = () => {
    if (!rating) return null
    const ratings = []
    for (var i = 0; i < rating; i++) {
      ratings.push(<FontAwesome key={i} name='star' style={{ margin: 2 }} color={Colors.primaryYellow} />)
    }
    // console.log('@RATINGS', ratings)
    return (
      <View style={{ ...Styles.center, marginLeft: 8, marginBottom: 5, flexDirection: global.isAndroid ? 'row' : 'row-reverse', }}>
        {/* {rating.forEach(i => <FontAwesome name='star' color={Colors.primaryYellow} />)} */}
        {ratings}
      </View>
    )
  }

  const renderFeatureItem = (i) => {
    var arr = null
    arr = COMMERCIAL_FACILITIES.filter(f => f.id == i.facility.id)
    if (!arr || arr.length == 0) {
      arr = PRIVATE_FACILITIES.filter(f => f.id == i.facility.id)
    }
    const item = arr[0]
    if (!item) return null

    if (!item.image) {
      return (
        <View key={item.id} style={{ margin: 12, minWidth: '23%', maxWidth: '33%' }}>
          <View style={{ padding: 4, borderRadius: 5, backgroundColor: Colors.gray, minWidth: 80 }}>
            <Text style={{ ...Fonts.fontLight, fontSize: 10, textAlign: 'center' }} >{item.name}</Text>
          </View>
          <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', marginTop: 12, alignItems: 'flex-end', justifyContent: 'center' }}>
            {/* <Text style={{ ...Fonts.fontRegular, fontSize: 17 }}>{i.value}</Text> */}
            {/* <Image style={{ height: 20, width: 29, marginLeft: 8, }} source={item.image} /> */}
            <MaterialIcons name={'check'} color={Colors.primaryBlue} size={30} />
          </View>
        </View>
      )
    }

    return (
      <View key={item.id} style={{ margin: 12, minWidth: '23%', maxWidth: '33%' }}>
        <View style={{ padding: 4, borderRadius: 5, backgroundColor: Colors.gray, minWidth: 80 }}>
          <Text style={{ ...Fonts.fontLight, fontSize: 10, textAlign: 'center' }} >{item.name}</Text>
        </View>
        <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', marginTop: 12, alignItems: 'flex-end', justifyContent: 'center' }}>
          <Text style={{ ...Fonts.fontRegular, fontSize: 17 }}>{i.value}</Text>
          <Image style={{ height: 20, width: 29, marginLeft: 8, }} source={item.image} />
        </View>
      </View>
    )
  }

  const renderDetails = () => {
    return (
      <ScrollView style={{ flex: 1, }} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={{ justifyContent: "flex-end", }}>
          <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', paddingHorizontal: 24, paddingVertical: 24, alignItems: 'flex-start', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.gray }}>
            <TouchableOpacity onPress={() => {
              if (!userData) {
                Toast.show({
                  text: 'يرجى تسجيل الدخول',
                  type: 'danger'
                })
              } else {
                // console.log(item)
                navigate('UpdateProperty', { item })
              }
            }} style={{ ...Styles.center, height: 50, width: 50, borderRadius: 100, backgroundColor: Colors.primaryYellow, }}>
              <Text style={{ ...Fonts.fontRegular }}>{`تعديل`}</Text>
            </TouchableOpacity>
            <View style={{ alignItems: 'flex-end', }}>
              <View style={{ alignItems: 'center', flexDirection: global.isAndroid ? 'row-reverse' : 'row', marginVertical: 8, flexWrap: 'wrap', width: '90%' }}>
                {renderStars()}
                <Text style={{ ...Fonts.FontMed, fontSize: 23, flexWrap: 'wrap', paddingTop: 8 }}>{item.name}</Text>
              </View>
              {/* <Text style={{ ...Fonts.fontLight, fontSize: 12, }}>{`523م2`}</Text> */}
              <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', marginVertical: 8 }}>
                <Text style={{ ...Fonts.fontLight, fontSize: 12, color: Colors.darkestGray }}>{`${item.city.ar},${item.district.ar}`}</Text>
                <EvilIcons name='location' />
              </View>
            </View>
          </View>
          {/* <View style={{ flexDirection: 'row', margin: 24, justifyContent: 'space-between' }}>
            <View />
            <TouchableOpacity style={{ padding: 4, paddingHorizontal: 16, backgroundColor: Colors.primaryYellow, borderRadius: 5, }}>
              <Text style={{ ...Fonts.fontRegular }}>{`ﺎﻟﺄﻳﺎﻣ و ﺎﻟﺄﺴﻋار`}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', marginHorizontal: 24, justifyContent: 'space-between' }}>
            <Text style={{ ...Fonts.FontMed, fontSize: 18, color: Colors.primaryYellow }}>
              {`500,1 ر.س/ ﻞﻠﻴﻟة `}
            </Text>
            <TouchableOpacity style={{ flexDirection: 'row' }}>
              <Text style={{ ...Fonts.fontRegular, marginRight: 8 }}>
                {`21 ﺮﺠﺑ          24 ﺮﺠﺑ `}
              </Text>
              <FontAwesome name='calendar' color={Colors.primaryBlue} />
            </TouchableOpacity>
          </View> */}
          <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', marginHorizontal: 24, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            {item.facilities.map(i => renderFeatureItem(i))}
          </View>
          <View style={{ alignItems: 'flex-end', margin: 24 }}>
            <Text style={{ ...Fonts.FontMed, fontSize: 17, marginBottom: 12 }}>
              {`الوصف`}
            </Text>
            <Text style={{ ...Fonts.fontLight, fontSize: 14 }}>
              {`${item.description}`}
            </Text>
          </View>
          {/* {renderContact()} */}
          <View style={{ height: 300 }} />
        </View>
      </ScrollView>
    )
  }

  const renderContact = () => {
    const owner = item.owner
    return (
      <View style={{ padding: 12, paddingHorizontal: 20, flexDirection: global.isAndroid ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => {
          setLoading(true)
          onCreateChat(owner.id)
        }} style={{ alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name={'message'} size={40} color={Colors.primaryBlue} />
          <Text style={{ ...Fonts.FontMed, fontSize: 18, marginTop: 8 }}>{`المحادثة`}</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'flex-end' }}>
          <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ ...Fonts.fontLight, marginRight: 12, }}>{owner.name}</Text>
            <MaterialIcons name='person' size={25} color={Colors.primaryBlue} />
          </View>
          <TouchableOpacity style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', alignItems: 'center' }}>
            <Text style={{ ...Fonts.fontLight, marginRight: 12, }}>{owner.phone}</Text>
            <MaterialIcons name='phone' size={25} color={Colors.primaryBlue} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const [checkConversationID, { data: roomData, error: roomError }] = useLazyQuery(CREATE_ROOM, {
    onCompleted: e => {
      if (roomData) {
        const id = roomData.checkConversationID.conversation_id
        fetchChat(id)
      }
    }
  })

  const onCreateChat = id => {
    if (id == userData.id) {
      Alert.alert('Error', 'لايمكنك مراسلة نفسك')
      setLoading(false)
      return
    }
    checkConversationID({
      variables: {
        id: id
      }
    })
    return
  }

  const fetchChat = async id => {
    await firebase.database().ref(`conversations/${id}`).on('value', (snapshot) => {
      if (snapshot) {
        console.log('snapshot', snapshot)
        var item = snapshot.val()
        item.key = id
        if (item.participants.creator.id == userData.id) {
          item.isOwner = true
        } else {
          item.isOwner = false
        }
        navigate('Chat', { item })
      }
    })
    setLoading(false)
  }

  const renderLoading = () => {
    if (!loading) return null
    return (
      <View style={{
        height: '100%',
        width: '100%', backgroundColor: 'transparent',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      >
        <ActivityIndicator size={'large'} color={Colors.primaryBlue} />
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {renderLoading()}
      <ViewPager style={{ height: '30%', }}
        onPageSelected={e => setPage(e.nativeEvent.position)}
      >
        {item.images && item.images.length > 0 ? item.images.map(i =>
          <View key={i.avatar} style={{ backgroundColor: 'transparent', alignContent: 'flex-start', justifyContent: 'flex-start', }}>
            <Image style={{ width: '100%', height: '100%', resizeMode: 'cover', backgroundColor: Colors.primaryBlue }} source={{ uri: IMAGE_URL + i.avatar }} />
            {renderIndicator()}
            {renderTopButtons()}
          </View>)
          :
          <View key={'asdasd'} style={{ backgroundColor: 'transparent', alignContent: 'flex-start', justifyContent: 'flex-start', }}>
            <Image style={{ width: '100%', height: '100%', resizeMode: 'cover' }} source={{ uri: `https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1934&q=80` }} />
            {renderIndicator()}
            {renderTopButtons()}
          </View>
        }
      </ViewPager>
      {renderDetails()}
      {item.sections && item.sections.length > 0 && <Button onPress={() => navigate('SectionList', { items: item.sections, item })} style={{ alignSelf: 'center', width: '50%', position: 'absolute', bottom: 35 }} text={`الأقسام`} />}
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
  indicatorStyle: {
    width: 7,
    height: 7,
    borderRadius: 14,
    margin: 2,
    backgroundColor: Colors.gray,
  }
});
