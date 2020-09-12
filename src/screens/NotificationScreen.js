import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  RefreshControl,
  FlatList,
  Text,
  TouchableOpacity,
  View
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

export default function NotificationScreen() {
  const [items, setItems] = useState(SAMPLE_LIST)
  const [loading, setLoading] = useState(false)
  const userData = useStoreState(state => state.auth.user)

  const fetchNext = () => { }

  const fetchData = () => {

  }

  useEffect(() => {
    // console.log('@userData', userData)
    setItems(userData.notifications)
  }, [])

  renderItem = (item, index) => {
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: '100%' }}>
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
          <View style={{ flexDirection: 'row' }}>
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


  renderEmpty = () => {
    return (
      <TouchableOpacity style={{ ...styles.container, justifyContent: "center", marginTop: 50, }}>
        <Image style={{ height: 34, width: 34 }} source={require('../../assets/additem.png')} />
        <Text style={styles.text}>{`دعب لزن ﻚﻳﺪﻟﺩدجﻮﻳ ﻻ`}</Text>
        <Text style={styles.text}>{`نألا كلزنﺇفضأ`}</Text>
      </TouchableOpacity>
    )
  }

  renderList = () => <FlatList
    data={items}
    contentContainerStyle={{ padding: 12, justifyContent: 'center', paddingBottom: 100 }}
    style={{ width: '100%', alignContent: 'center', alignSelf: 'center' }}
    keyExtractor={item => item.id}
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
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <View style={styles.container}>
        {renderList()}
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
