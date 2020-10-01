import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Colors from '../styles/Colors';
import { SafeAreaView } from 'react-navigation';
import Fonts from '../styles/Fonts';
import Styles from '../styles/Styles';
import Header from '../components/Header';
import { REGISTER } from '../services/graphql/queries'
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native';

const SAMPLE = [
  {
    "id": "1",
    "referrence_id": "5f744b7403f51",
    "detail": null
  },
  {
    "id": "2",
    "referrence_id": "5f744b7dccc83",
    "detail": {
      "property": {
        "id": "4",
        "name": "TEST PRIVATE 3",
        "images": [
          {
            "avatar": "471e549cf68ebeae49b0204f15580507.JPG"
          },
          {
            "avatar": "4494718562c2bbd1be095c8842d707bb.JPG"
          },
          {
            "avatar": "4c2f5abd067b2aa7dc945e4c1c4544df.JPG"
          }
        ]
      },
      "section": null
    }
  }
]

export default function BookingListScreen(props) {
  const { navigate, goBack } = props.navigation
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [bookingList, setBookingList] = useState(SAMPLE)

  useEffect(() => {

  }, [])

  const renderItem = ({ item }) => {
    console.log('@ITEM', item)
    return (
      <TouchableOpacity style={{
        minHeight: 125,
        marginVertical: 8,
        width: '98%',
        borderRadius: 11,
        alignSelf: 'center',
        backgroundColor: 'white',
        shadowOffset: { height: 3, width: 0, },
        shadowColor: 'black',
        shadowOpacity: 0.3,
        flexDirection: 'row',
        elevation: 3,
      }}>
        <View style={{ width: '65%', padding: 12, }}>
          <Text style={{ ...Fonts.fontLight, marginRight: 4, color: Colors.darkGray }}>
            {`${item?.detail?.property?.name}  `}
            <Text style={{ ...Fonts.fontBold, }}>
              {item?.detail?.property?.name || 'unknown'}
            </Text>
          </Text>
          <View style={{ ...Styles.lineDividerHorizontal, marginVertical: 5 }} />
          {/* FIRST PART */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ ...Fonts.fontLight, marginRight: 4, textAlign: 'center' }}>
              {`المبلغ \n`}
              <Text style={{ ...Fonts.fontBold, textAlign: 'center' }}>
                {`500 ريال`}
              </Text>
            </Text>
            <Text style={{ ...Fonts.fontLight, marginRight: 4, textAlign: 'center' }}>
              {`ﺗﺎرﻳﺦ اﻟﻮﺻﻮل\n`}
              <Text style={{ ...Fonts.fontBold, textAlign: 'center' }}>
                {`2020/9/1`}
              </Text>
            </Text>
          </View>
          <View style={{ height: 10 }} />
          {/* SECOND PARD */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
            <Text style={{ ...Fonts.fontLight, marginRight: 4, textAlign: 'center' }}>
              {`حالة الحجز\n`}
              <Text style={{ ...Fonts.fontBold, textAlign: 'center' }}>
                {`مؤكد`}
              </Text>
            </Text>
            <Text style={{ ...Fonts.fontLight, marginRight: 4, textAlign: 'center' }}>
              {`ﺗﺎرﻳﺦ اﻟﻤﻐﺎدرة\n`}
              <Text style={{ ...Fonts.fontBold, textAlign: 'center' }}>
                {`2020/9/12`}
              </Text>
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
            <TouchableOpacity style={{
              marginVertical: 8,
              borderRadius: 11,
              width: '45%',
              flexWrap: 'wrap',
              alignSelf: 'center',
              backgroundColor: 'white',
              shadowOffset: { height: 3, width: 0, },
              shadowColor: 'black',
              shadowOpacity: 0.3,
              flexDirection: 'row',
              elevation: 3,
              padding: 5,
              paddingHorizontal: 8,
              justifyContent: 'center'
            }}>
              <Text style={{ ...Fonts.fontRegular, textAlign: 'center', fontSize: 11, }}>{`ﻟﻢ ﻳﺘﻢ اﻟﺤﻀﻮر`}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              marginVertical: 8,
              width: '45%',
              flexWrap: 'wrap',
              borderRadius: 11,
              alignSelf: 'center',
              backgroundColor: Colors.gray,
              shadowOffset: { height: 3, width: 0, },
              shadowColor: 'black',
              shadowOpacity: 0.3,
              flexDirection: 'row',
              elevation: 3,
              padding: 5,
              paddingHorizontal: 8,
              justifyContent: 'center'
            }}>
              <Text style={{ ...Fonts.fontRegular, textAlign: 'center', fontSize: 11, }}>{`ﺗﻢ اﻟﺤﻀﻮر`}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Image style={{
          alignSelf: 'flex-end',
          width: '35%',
          borderTopRightRadius: 11,
          borderBottomRightRadius: 11
        }} source={require('../../assets/itemimage.png')} />
      </TouchableOpacity>
    )
  }

  const renderList = () => {
    return (
      <FlatList
        data={bookingList}
        extraData={bookingList}
        keyExtractor={(item, index) => String(index)}
        renderItem={(item, index) => renderItem(item)}
      />
    )
  }

  return (
    <View style={styles.container}>
      <Header name={`الحجوزات`} onPressBack={() => goBack()} />
      <View style={{ flex: 1, width: '100%', padding: 24 }}>
        {/* <Text>Booking List Screen</Text> */}
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
