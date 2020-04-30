import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Platform,
  Text,
  View
} from 'react-native';

import Header from '../components/Header'
import Colors from '../styles/Colors';
import Fonts from '../styles/Fonts'
import { SAMPLE_LIST } from '../constants/data'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

export default function HomeScreen(props) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
  }, [])

  fetchNext = () => {
  }

  renderItem = (item, index) => {
    return (
      <TouchableOpacity style={{
        height: 125,
        marginVertical: 8,
        width: '98%',
        borderRadius: 11,
        alignSelf: 'center',
        backgroundColor: 'white',
        shadowOffset: { height: 3, width: -2, },
        shadowColor: 'black',
        shadowOpacity: 0.1,
        flexDirection: 'row',
        elevation: 3,
      }}>
        <View style={{ flex: 1, padding: 12, }}>
          <Text style={{ ...Fonts.fontBold, fontSize: 18, width: '100%', textAlign: 'right' }}>{`فيلا`}<Text style={{ ...Fonts.fontRegular, color: "#979797", fontSize: 14 }}>{`  ﺮﻘﻣ ﺎﻟﺈﻌﻟﺎﻧ`}</Text></Text>
          <View style={{ height: 1, width: '100%', backgroundColor: Colors.gray }} />
          <View style={{ flexDirection: 'row', padding: 12, width: '100%', justifyContent: "space-between" }}>
            <Text style={{ ...Fonts.fontRegular }}>{`Date `}<FontAwesome name={'calendar'} /></Text>
            <Text style={{ ...Fonts.fontRegular }}>{`${item.price} `}<FontAwesome name={'money'} /></Text>
          </View>
        </View>
        <Image
          style={{ alignSelf: 'flex-end', height: '100%', width: '30%' }}
          source={require('../../assets/itemimage.png')}
        />
      </TouchableOpacity>
    )
  }

  renderEmpty = () => {
    return (
      <TouchableOpacity onPress={() => setItems(SAMPLE_LIST)} style={{ ...styles.container, justifyContent: "center", marginTop: 50, }}>
        <Image style={{ height: 34, width: 34 }} source={require('../../assets/additem.png')} />
        <Text style={styles.text}>{`دعب لزن ﻚﻳﺪﻟﺩدجﻮﻳ ﻻ`}</Text>
        <Text style={styles.text}>{`نألا كلزنﺇفضأ`}</Text>
      </TouchableOpacity>
    )
  }

  renderList = () => <FlatList
    data={items}
    contentContainerStyle={{ padding: 12, justifyContent: 'center', paddingVertical: Platform.OS === 'ios' ? '20%' : '30%'}}
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
    <View style={styles.container}>
      <Header style={{ paddingTop: 20 }} openDrawer={() => props.navigation.openDrawer()} search />
      <View style={{ width: '100%', alignItems: 'center', height: '80%' }}>
        {renderList()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  text: {
    ...Fonts.fontRegular,
    fontSize: 20,
  }
});
