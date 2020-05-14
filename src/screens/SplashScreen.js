import React, { useEffect, useState } from 'react';
import {
  I18nManager,
  StatusBar,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import Button from '../components/Button';
import Colors from '../styles/Colors';
import { SafeAreaView } from 'react-navigation';
import Fonts from '../styles/Fonts';
export default function SplashScreen(props) {
  const { navigation: { navigate } } = props
  const [page, setPage] = useState(0)

  useEffect(() => {
  }, [page])

  renderSkipButton = () => {
    return (
      <Button
        onPress={() => navigate('Home')}
        text={`ابدأ`}
        style={{ width: 177 }}
        textStyle={{ fontFamily: 'tajawal_med' }}
      />
    )
  }

  renderIndicator = () => {
    return (
      <View style={{ flexDirection: 'row', alignSelf: 'center', padding: 24, paddingTop: 0, alignContent: 'center', justifyContent: 'center' }}>
        <View style={{ ...styles.indicatorStyle, backgroundColor: page == 2 ? Colors.primaryYellow : Colors.gray }} />
        <View style={{ ...styles.indicatorStyle, marginHorizontal: 4, backgroundColor: page == 1 ? Colors.primaryYellow : Colors.gray }} />
        <View style={{ ...styles.indicatorStyle, backgroundColor: page == 0 ? Colors.primaryYellow : Colors.gray }} />
      </View>
    )
  }

  return (
    <ViewPager
      style={{ ...styles.container, marginTop: 200 }}
      onPageSelected={e => setPage(e.nativeEvent.position)}
    // showPageIndicator={true} initialPage={0}
    >
      <SafeAreaView style={{ ...styles.container }} key="1">
        <Text style={styles.titleText}>{`  مرحبًا بك في نزل  `}</Text>
        <Image source={require('../../assets/splashicon.png')} />
        <Text style={styles.textlabel}>{`تصفح النزل بمختلف أنواعها و ميزاتها   و اﺧﺘﺮ ﻣﺎ ﻳﻨﺎﺳﺒﻚ`}</Text>
        {renderIndicator()}
        {renderSkipButton()}
      </SafeAreaView>
      <SafeAreaView style={styles.container} key="2">
        <Text style={styles.titleText}>{`  مرحبًا بك في نزل  `}</Text>
        <Image source={require('../../assets/splashicon.png')} />
        <Text style={styles.textlabel}>{`أضف نزلك و ﺷﺎركه اﻷﺧﺮﻳﻦ `}</Text>
        {renderIndicator()}
        {renderSkipButton()}
      </SafeAreaView>
      <SafeAreaView style={styles.container} key="3">
        <Text style={styles.titleText}>{` مرحبًا بك في نزل  `}</Text>
        <Image source={require('../../assets/splashicon.png')} />
        <Text style={styles.textlabel}>{`وﻭاﺳﺘﻤﺘﻊ`}</Text>
        {renderIndicator()}
        {renderSkipButton()}
      </SafeAreaView>
    </ViewPager>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  titleText: {
    fontSize: 30,
    color: Colors.primaryBlue,
    marginBottom: 16,
    // fontWeight: 'bold'
    fontFamily: 'tajawal_bold'
  },
  textlabel: {
    ...Fonts.fontLight,
    marginVertical: 24,
    color: Colors.primaryBlue,
    paddingHorizontal: '10%',
    textAlign: 'center',
    fontSize: 16,
  },
  indicatorStyle: {
    width: 7,
    height: 7,
    borderRadius: 14,
    backgroundColor: Colors.gray,
  }
});
