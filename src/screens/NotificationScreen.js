import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Image,
  RefreshControl,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Platform
} from 'react-native';

import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

import BottomTabBar from '../components/BottomTabBar'
import Header from '../components/Header';
import Colors from '../styles/Colors';
import Fonts from '../styles/Fonts'
import { SAMPLE_LIST } from '../constants/data'
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-navigation';
import { useStoreActions, useStoreState } from 'easy-peasy';
import moment from 'moment';
const isAndroid = Platform.OS === 'android'
export default function NotificationScreen() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const userData = useStoreState(state => state.auth.user)

  const fetchNext = () => { }

  const fetchData = () => {

  }

  useEffect(() => {
    console.log('@userData', userData?.notifications?.length)
    setItems(userData.notifications)
  }, [])

  const renderItem = (item, index) => {
    return (
      <TouchableOpacity style={{
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
          <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row' }}>
            <View>
              <Text style={{ ...Fonts.fontRegular, }}>{item.message || `ﻗﺎربﺏاﺷﺘﺮاككﻙﻋﻠﻰ اﻻﻧﺘﻬﺎء`}</Text>
              <Text style={{ ...Fonts.fontLight, }}>{item.sublabel || ``}</Text>
            </View>
            <MaterialCommunityIcons style={{ paddingHorizontal: 8 }} color={Colors.primaryBlue} size={25} name={'bell-outline'} />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderEmpty = () => {
    return (
      <TouchableOpacity style={{ ...styles.container, justifyContent: "center", marginTop: 50, }}>
        <Image style={{ height: 34, width: 34 }} source={require('../../assets/additem.png')} />
        <Text style={styles.text}>{`لا یوجد لدیك أي إشعارات حتى الان`}</Text>
        {/* <Text style={styles.text}>{`نألا كلزنﺇفضأ`}</Text> */}
      </TouchableOpacity>
    )
  }

  const renderList = () => <FlatList
    data={items.slice(0, 20)}
    extraData={items}
    contentContainerStyle={{ padding: 12, justifyContent: 'center', paddingBottom: 100 }}
    style={{ width: '100%', alignContent: 'center', alignSelf: 'center' }}
    keyExtractor={item => String(item.id) + String(item.created_at)}
    renderItem={({ item, index }) => renderItem(item, index)}
    onEndReached={() => fetchNext()}
    onEndReachedThreshold={0.5}
    initialNumToRender={10}
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
    <SafeAreaView style={{ flex: 1 }}>
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
