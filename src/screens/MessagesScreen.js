import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  I18nManager,
  Platform
} from 'react-native';

import Header from '../components/Header'
import Colors from '../styles/Colors';
import Fonts from '../styles/Fonts'
import { SAMPLE_LIST } from '../constants/data'
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-navigation';
import { firebaseListener } from '../services/firebase-chat';
import * as firebase from 'firebase';
import { useStoreState } from 'easy-peasy';
import { useLazyQuery } from '@apollo/react-hooks';
import { VIEW_USER_DETAILS } from '../services/graphql/queries';
import { IMAGE_URL } from '../services/api/url';

const isAndroid = Platform.OS === 'android' && I18nManager?.isRTL;

export default function MessagesScreen(props) {
  const { navigate, goBack } = props.navigation
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [otherUsers, setOtherUsers] = useState([])
  const userData = useStoreState(state => state.auth.user)
  const [viewUser, { data, error }] = useLazyQuery(VIEW_USER_DETAILS, {
    onCompleted: e => {
      console.log('@FETCHDONE')
    }
  })

  useEffect(() => {
    awaitMessages()
  }, [])

  useEffect(() => {
    console.log('@DATAVIEW', data, error)
    if (data) {
      var arr = [...otherUsers]
      arr.push(data.viewUser)
      setOtherUsers(arr)
    }
  }, [data, error])

  useEffect(() => {
    if (items) {
      console.log(items)
      // const newItems = [...items]
      // newItems.forEach(async i => {
      //   let id = i.participants.creator.id
      //   if (i.isOwner) {
      //     id = i.participants.receiver.id
      //   }
      //   if (id) {
      //     await viewUser({
      //       variables: {
      //         id,
      //       }
      //     })
      //   }
      // })
    }
  }, [items])

  const awaitMessages = async () => {
    await firebase.database().ref('conversations').on('value', (snapshot) => {
      if (snapshot) {
        var arrmsgs = []
        Object.keys(snapshot.val()).forEach(e => {
          var item = snapshot.val()[e]
          item.key = e
          item.isOwner = false
          if (item.participants.receiver.id == userData.id || item.participants.creator.id == userData.id) {
            if (item.participants.creator.id == userData.id) {
              item.isOwner = true
            }
            arrmsgs.push(item)
          }
        })
        setItems(arrmsgs)
      }
    })
    setLoading(false)
  }



  const fetchNext = () => { }

  renderItem = (item, index) => {
    if (!item) return
    return (
      <TouchableOpacity
        key={item.key}
        onPress={() => {
          console.log('@before', item)
          navigate('Chat', { item })
        }
        }
        style={{
          height: 60,
          marginVertical: 8,
          width: '100%',
          borderRadius: 11,
          paddingHorizontal: 12,
          borderBottomWidth: 1,
          borderColor: Colors.gray,
        }}>
        <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', justifyContent: 'space-between', height: '100%' }}>
          <View style={{ height: '100%', justifyContent: 'space-between' }}>
            <View style={{
              height: 24,
              width: 24,
              paddingTop: 8,
              borderRadius: 58,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent' //Colors.primaryYellow
            }}>
              {/* <Text style={{ ...Fonts.fontRegular, height: '100%', width: '100%', textAlign: 'center' }}>{item.count || `1`}</Text> */}
            </View>
            <Text style={{ ...Fonts.fontRegular, color: '#979797' }}>{item.created_at || `الأن`}</Text>
          </View>
          <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', alignItems: 'center' }}>
            <View>
              <Text style={{ ...Fonts.fontRegular, }}>{!item.isOwner ? item.participants.creator.name : item.participants.receiver.name}</Text>
              <Text style={{ ...Fonts.fontLight, maxWidth: 150 }} numberOfLines={1}>{item.messages && item.messages.length > 0 ? item.messages[item.messages.length - 1].text : ` ﻣﺤﺎدﺛﺔ ﻣﺤﺎدﺛﺔ ﻣﺤﺎدﺛﺔ ﻣﺤﺎدﺛﺔ ﻣﺤﺎدﺛﺔ ﻣﺤﺎدﺛﺔ `}</Text>
            </View>
            {/* <MaterialCommunityIcons style={{ paddingHorizontal: 8 }} color={Colors.primaryBlue} size={25} name={'bell-outline'} /> */}
            {renderAvatar(!item.isOwner ? item.participants.creator : item.participants.receiver)}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderAvatar = (item) => {
    if (!item || !item.name) return
    // const item = e.receiver
    if (!item.avatar || item.avatar.includes('profile'))
      return (
        <View style={{
          height: 46,
          width: 46,
          borderRadius: 100,
          backgroundColor: Colors.primaryBlue,
          marginLeft: global.isAndroid ? 0 : 8,
          marginRight: global.isAndroid ? 8 : 0,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Text style={{ fontWeight: '500', color: Colors.primaryYellow, fontSize: 20 }}>{(item.name.charAt(0)).toUpperCase()}</Text>
        </View>
      )

    return <Image source={{ uri: IMAGE_URL + item.avatar }} style={{
      height: 46,
      width: 46,
      borderRadius: 100,
      marginLeft: global.isAndroid ? 0 : 8,
      marginRight: global.isAndroid ? 8 : 0,
      backgroundColor: Colors.primaryBlue,
    }} />
  }

  renderEmpty = () => {
    if (loading) {
      return (
        <View style={{ marginTop: 40 }}>
          <ActivityIndicator color={Colors.primaryBlue} />
        </View>
      )
    }

    return (
      <TouchableOpacity style={{ ...styles.container, justifyContent: "center", marginTop: 50, }}>
        <Image style={{ height: 34, width: 34 }} source={require('../../assets/additem.png')} />
        <Text style={styles.text}>{'لا یوجد لدیك أي رسائل حتى الان'}</Text>
        {/* <Text style={styles.text}>{`نألا كلزنﺇفضأ`}</Text> */}
      </TouchableOpacity>
    )
  }

  const renderList = () => <FlatList
    data={items}
    extraData={items}
    contentContainerStyle={{ padding: 12, justifyContent: 'center', paddingBottom: 100 }}
    style={{ width: '100%', alignContent: 'center', alignSelf: 'center' }}
    keyExtractor={item => item.key}
    renderItem={({ item }) => renderItem(item)}
    ListEmptyComponent={() => renderEmpty()}
    onEndReached={() => fetchNext()}
    onEndReachedThreshold={0.5}
    initialNumToRender={20}
    refreshControl={
      <RefreshControl
        refreshing={loading}
        onRefresh={() => {
        }}
        tintColor={Colors.primarBlue}
      />
    }
  />

  return (
    <SafeAreaView style={{ flex: 1, }}>
      <Header />
      <View style={styles.container}>
        {items ? renderList() : renderEmpty()}
      </View>
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
});
