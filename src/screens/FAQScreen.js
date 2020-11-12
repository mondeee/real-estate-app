import React, { useEffect, useState } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
  I18nManager
} from 'react-native';

import Colors from '../styles/Colors';
import { SafeAreaView } from 'react-navigation';
import Fonts from '../styles/Fonts';
import Styles from '../styles/Styles';
import Header from '../components/Header';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { GET_QUESTIONS } from '../services/graphql/queries';

const isAndroid = Platform.OS === 'android' && I18nManager?.isRTL;

const FAQ_ITEMS = [
  {
    isVisible: false,
  },
  {
    isVisible: false,
  },
  {
    isVisible: false,
  },
  {
    isVisible: false,
  },
]

export default function FAQScreen(props) {
  const { navigate, goBack } = props.navigation
  const { loading, error, data } = useQuery(GET_QUESTIONS)
  const [items, setItems] = useState(data || [])

  useEffect(() => {
    if (data && data.allQuestions) {
      data.allQuestions.forEach(i => i.isVisible = false)
      setItems(data.allQuestions)
      console.log(items)
    }
  }, [data])

  if (loading) console.log('LOADING')
  if (error) console.log(`Error! ${error.message}`);

  onPressItem = index => {
    console.log(items, items[index])
    const copy = [...items]
    copy[index].isVisible = !copy[index].isVisible
    setItems(copy)
  }

  renderfaqItem = (item, index) => {
    return (
      <View
        key={index}
        style={{
          paddingTop: 8,
          marginHorizontal: 24,
          borderBottomColor: Colors.gray,
          borderBottomWidth: 1,
        }}>
        <TouchableOpacity onPress={() => onPressItem(index)} style={{
          width: '100%',
          flexDirection: isAndroid ? 'row-reverse' : 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: 60,
        }}>
          <Image style={{ height: 8, width: 12, }} source={require('../../assets/chevrondown.png')} />
          <View style={{ flexDirection: isAndroid ? 'row-reverse' : 'row', }}>
            <Text style={{ ...Fonts.fontRegular, marginRight: 8 }}>{item.question}</Text>
            <Image style={{ height: 17, width: 17 }} source={require('../../assets/faqicon.png')} />
          </View>
        </TouchableOpacity>
        {item.isVisible && <View style={{ minHeight: 30, width: '100%' }}>
          <Text style={{ ...Fonts.fontLight, textAlign: 'right' }}>{item.answer}</Text>
        </View>}
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header onPressBack={() => goBack()} />
      {loading ? <ActivityIndicator /> : <View style={{ flex: 1, width: '100%' }}>
        {items.map((i, index) => renderfaqItem(i, index))}
      </View>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
});
