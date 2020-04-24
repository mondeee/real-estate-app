import React, { useEffect } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Colors from '../styles/Colors';
import Fonts from '../styles/Fonts';
import { TouchableOpacity } from 'react-native-gesture-handler';

const navList = [
  { label: 'باسح ءاشنإ', key: 0, route: 'Register' },
  { label: 'نحن ﻦﻣ ', key: 1, route: '' },
  { label: 'الشروط والأحكام \n وسياسة الخصوصية', key: 2, route: '' },
  { label: 'ةعئاشلا ةلئسألا', key: 3, route: '' },
  { label: 'ﻖﻴﺒﻄﺘﻟا ﻦﻋ ﻚﻳأر انطعأﺃ', key: 4, route: '' },
  { label: 'انعم لصاوت', key: 5, route: '' },
]

export default function SideBar(props) {
  // const { navigate } = props.navigation
  useEffect(() => {
  }, [])

  renderFooter = () => {
    return (
      <View style={{ alignSelf: 'flex-end', alignItems: 'center', width: '100%', flex: .5 }}>
        <Text style={{ ...Fonts.FontMed, fontSize: 14, color: Colors.primaryBlue }}>{`ﺔﻄﺳاﻮﺑ ﺬﻔﻧ`}</Text>
        <Image style={{ height: 33, width: 83 }} resizeMode={'contain'} source={require('../../assets/sidebar_footer.png')} />
      </View>
    )
  }

  renderNavList = () => {
    return (
      <View style={{ width: '100%', paddingHorizontal: 20, paddingTop: 20 }}>
        {navList && navList.map(i => <TouchableOpacity
          key={i.key}
          onPress={() => props.navigate(i.route)}
        >
          <Text
            style={{
              paddingVertical: 13,
              alignSelf: 'flex-end',
              color: Colors.primaryBlue,
              fontSize: 16,
              textAlign: 'right',
              ...Fonts.fontRegular
            }} key={i.key}>{i.label}
          </Text>
        </TouchableOpacity>)}
      </View>
    )
  }

  return (
    <View style={{ ...styles.container, paddingBottom: 40 }}>
      <View style={{ backgroundColor: Colors.primaryBlue, flex: 1.1 }} />
      <View style={{ ...styles.container, flex: 2.4, alignItems: 'center', paddingHorizontal: 12, }}>
        <View style={{ height: '10%' }} />
        <Text style={{
          color: Colors.primaryBlue,
          fontSize: 21,
          ...Fonts.fontBold,
        }}>{`لزن قيبطت`}</Text>
        {renderNavList()}
      </View>
      <Image style={styles.logoContainer} source={require('../../assets/sidebar_logo.png')} />
      {renderFooter()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  logoContainer: {
    height: 118,
    width: 118,
    borderRadius: 30,
    // backgroundColor: 'white',
    position: 'absolute',
    top: '20%',
    left: '29%',

  }
});
