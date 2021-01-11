import React, { useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  ScrollView,
  View
} from 'react-native';

import Colors from '../styles/Colors';
import { SafeAreaView } from 'react-navigation';
import Fonts from '../styles/Fonts';
import Button from '../components/Button'
import Styles from '../styles/Styles';
import Header from '../components/Header';
import { useStoreState } from 'easy-peasy';

export default function TermsAndAgreementScreen(props) {
  const { navigate, goBack, state: { params } } = props.navigation
  const settings = useStoreState(state => state.auth.settings)

  useEffect(() => {
    console.log('@SETTINGS', settings)
  }, [])

  if (params?.aboutus) {
    return (
      <SafeAreaView style={styles.container}>
        <Header onPressBack={() => goBack()} />
        <View style={{ flex: 1 }}>
          <Text style={{ ...Fonts.FontMed, marginVertical: 20, textAlign: 'center' }}>{`ﻣﻦ نحن`}</Text>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 22, }}>
            <Text style={{ ...Fonts.fontLight, color: Colors.primaryBlue }}>{settings.about_us}</Text>
            <View style={{ height: 300 }} />
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header onPressBack={() => params?.login ? navigate('Login') : goBack()} />
      <View style={{ flex: 1 }}>
        {/* <Text style={{ ...Fonts.FontMed, marginTop: 20, textAlign: 'center' }}>{`الشروط والأحكام و سياسة الخصوصية`}</Text> */}
        <Text style={{ ...Fonts.FontMed, marginVertical: 20, textAlign: 'center' }}>{`الشروط والأحكام و سياسة الخصوصية`}</Text>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 22, }}>
          <Text style={{ ...Fonts.fontLight, color: Colors.primaryBlue, }}>{settings.owner_terms_and_conditions}</Text>
          <View style={{ height: 300 }} />
        </ScrollView>
        {params?.show && <View style={{ height: '10%', flexDirection: global.isAndroid ? 'row-reverse' : 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: '15%' }}>
          {/* <Button onPress={() => navigate('Login')} style={{ minWidth: 100 }} text={`لا أوﺎﻔﻗ`} /> */}
          <Button onPress={() => navigate('Register')} style={{ minWidth: 100 }} text={`أوافق`} />
        </View>}
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
