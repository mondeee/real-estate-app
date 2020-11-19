import React, { useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  I18nManager
} from 'react-native';
import Header from '../components/Header';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Colors from '../styles/Colors';
import Fonts from '../styles/Fonts';

const isAndroid = Platform.OS === 'android' && I18nManager?.isRTL;

export default function ContactScreen(props) {
  const { navigate, goBack } = props.navigation

  useEffect(() => {
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <Header onPressBack={() => goBack()} />
      <View style={styles.container}>
        <FontAwesome color={Colors.primaryBlue} name={'phone'} size={57} />
        <Text style={{ ...Fonts.FontMed, fontSize: 30, margin: 12 }}>{`للتواصل`}</Text>
        <Text style={{ ...Fonts.fontRegular, fontSize: 30, marginBottom: 12, }}>{`011 4000000`}</Text>
        <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', padding: 24, justifyContent: 'space-between', width: '80%' }}>
          <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View style={styles.circleStyle}>
              <FontAwesome color={Colors.primaryBlue} size={25} name='linkedin' />
            </View>
            <Text style={{ ...Fonts.fontRegular, marginTop: 4 }}>{`@nozol`}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View style={styles.circleStyle}>
              <FontAwesome color={Colors.primaryBlue} size={25} name='instagram' />
            </View>
            <Text style={{ ...Fonts.fontRegular, marginTop: 4 }}>{`@nozol`}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View style={styles.circleStyle}>
              <FontAwesome color={Colors.primaryBlue} size={25} name='twitter' />
            </View>
            <Text style={{ ...Fonts.fontRegular, marginTop: 4 }}>{`@nozol`}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: '20%',
    // justifyContent: 'center',
  },
  circleStyle: {
    height: 49,
    width: 49,
    borderRadius: 100,
    backgroundColor: Colors.primaryYellow,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
