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

import BottomTabBar from '../components/BottomTabBar'
import Header from '../components/Header';
import Colors from '../styles/Colors';
import Fonts from '../styles/Fonts'
import { SAMPLE_LIST } from '../constants/data'
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

export default function NotificationScreen() {
  const [items, setItems] = useState(SAMPLE_LIST)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
  }, [])

  renderItem = (item, index) => {
    console.log('item', item)
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
              paddingTop: 6,
              borderRadius: 58,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Colors.primaryYellow
            }}>
              <Text style={{ ...Fonts.fontRegular, height: '100%', width: '100%', textAlign: 'center' }}>{item.count || `1`}</Text>
            </View>
            <Text style={{ ...Fonts.fontRegular, color: '#979797' }}>{item.time || `الأن`}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <Text style={{ ...Fonts.fontRegular, }}>{item.sublabel || `ﻗﺎﺮﺑﺏاﺷﺘﺮﺎﻜﻛﻙﻋﻠﻰ اﻻﻧﺘﻬﺎء`}</Text>
              <Text style={{ ...Fonts.fontLight, }}>{item.sublabel || ` تﻮﻀﻴﺣ `}</Text>
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
    keyExtractor={item => item.name}
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
    <View style={{ flex: 1 }}>
      <Header />
      <View style={styles.container}>
        {renderList()}
      </View>
    </View>
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
