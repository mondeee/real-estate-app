import React, { useEffect, useState } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Colors from '../styles/Colors';
import { SafeAreaView } from 'react-navigation';
import Fonts from '../styles/Fonts';
import Styles from '../styles/Styles';
import Header from '../components/Header';
import { GET_SUBS } from '../services/graphql/queries'
import { useMutation, useQuery } from '@apollo/react-hooks';
import ViewPager from '@react-native-community/viewpager';
import Button from '../components/Button';

const SAMPLE_LIST = [
  {
    "id": "1",
    "name": "1 Month",
    "description": "1 Month Subscription; 10 Adding Property Limit",
    "duration": 1,
    "limit": 10,
    "price": 100,
    "unli": false
  },
  {
    "id": "2",
    "name": "1 Month Unli",
    "description": "1 Month Subscription; Unlimited Adding Property Limit",
    "duration": 1,
    "limit": -1,
    "price": 500,
    "unli": true
  }
]

export default function SubscriptionScreen(props) {
  const { navigate, goBack } = props.navigation
  const [page, setPage] = useState(0)
  const [subs, setSubs] = useState(SAMPLE_LIST)
  const { loading, error, data } = useQuery(GET_SUBS)


  useEffect(() => {
    if (data && data.allSubscriptions) {
      console.log('@SUBS', data)
      setSubs(data.allSubscriptions)
    }
  }, [data])

  useEffect(() => {
  }, [])


  renderIndicator = () => {
    return (
      <View style={{ flexDirection: 'row-reverse', alignSelf: 'center', padding: 8, paddingTop: 0, alignItems: 'center', justifyContent: 'center', }}>
        {subs && subs.map((i, index) => <View key={index} style={{ ...styles.indicatorStyle, backgroundColor: page == index ? Colors.primaryYellow : Colors.gray }} />)}
      </View>
    )
  }

  renderInitial = () => {
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
      </View>
    )
  }

  renderPage = (i, index) => {
    return (
      <View style={{ ...styles.viewPager }} key={index}>
        <Text style={styles.titleText}>{i.name}</Text>
        <View style={{ flexDirection: 'row', height: '40%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.mainText}>{i.duration}</Text>
          <Image style={{ height: 50, width: 50, }} source={require('../../assets/subiconlarge.png')} />
        </View>
        <Text style={styles.textlabel}>{`ًايونس /س.ر ${i.price}`}</Text>
        <Text style={{ ...styles.textlabel, fontSize: 19, marginVertical: 8, marginHorizontal: '10%', textAlign: 'center' }}>{i.description}</Text>
        {renderIndicator()}
        <Button style={{ marginVertical: 12 }} text={`ﺎﺸﺗﺮﻛ ﺎﻟﺄﻧ`} />
      </View>
    )
  }

  renderChoices = () => {
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
      <Header onPressBack={() => goBack()} />
      {renderChoices()}
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
    flex: 1,
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
