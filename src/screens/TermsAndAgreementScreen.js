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

  return (
    <SafeAreaView style={styles.container}>
      <Header onPressBack={() => navigate('Login')} />
      <View style={{ flex: 1 }}>
        {/* <Text style={{ ...Fonts.FontMed, marginTop: 20, textAlign: 'center' }}>{`الشروط والأحكام و سياسة الخصوصية`}</Text> */}
        <Text style={{ ...Fonts.FontMed, marginVertical: 20, textAlign: 'center' }}>{`الشروط والأحكام و سياسة الخصوصية`}</Text>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 22, }}>
          <Text style={{ ...Fonts.fontLight }}>{settings.terms_and_conditions}</Text>
          {/* <Text style={{ ...Fonts.fontLight }}>{`ﻥﺔﻴﻟوﺆﺴﻤﻟﺎﺑ ﻢﻠﻌﻟﺎﺑﺭراﺮﻗإ
ﺰﻳﺰﻌﻟا ﺎﻨﻠﻴﻤﻋ

 (“راﺮﻗإلا” ﺪﻌﺑ ﺎﻤﻴﻓ ﻪﻴﻟإ راشملاﺇ) اﺬﻫ ﺔﻴﻟؤوسملا ءﻼﺧإ ﺭراﺮﻗإ   ﺔﺻﺎﺨﻟا ﺔﺤﻔﺼﻟا
ماﺪﺨﺘﺳا و ﻖﻴﺒﻄﺘﻟا اﺬﻫ ىلإﯽلﻮﺧﺪﻟا ﻚﻟﻮﺨﻳ    ةكلمملا ﻲﻓ ﺎﻬﺑ لﻮﻤﻌﻤﻟا ﺔﻴﻧﻮﻧﺎﻘﻟا تﺎﻤﻴﻈﻨﺘﻟا ﻖﻓو ﻚﺑ
  ﻡمﺎﻣأ ﺎﻘﺣﻻ ﺔﻴﻟوﺆﺴﻤﻟا ﻞﻣﺎﻛ ﻚﻠﻤﺤﻳ و ﺔﻳدﻮﻌﺴﻟا ﺔﻴﺑﺮﻌﻟا
 ﺺﺨﺗﺕتﺎﻴﻟﺎﻜﺷإﺇيأ عﻮﻗو لﺎﺣ ﺔﺼﺘﺨﻤﻟاﺕتﺎﻬﺠﻟا ﻊﻴﻤﺟ
.ﻖﻴﺒﻄﺘﻟا اﺬﻫ ﻲﻓ ﻪﺿﺮﻌﺗ ﺎﻣ`}</Text>
          <Text style={{ ...Fonts.fontLight }}>{`ﻥﺔﻴﻟوﺆﺴﻤﻟﺎﺑ ﻢﻠﻌﻟﺎﺑﺭراﺮﻗإ
ﺰﻳﺰﻌﻟا ﺎﻨﻠﻴﻤﻋ

 (“راﺮﻗإلا” ﺪﻌﺑ ﺎﻤﻴﻓ ﻪﻴﻟإ راشملاﺇ) اﺬﻫ ﺔﻴﻟؤوسملا ءﻼﺧإ ﺭراﺮﻗإ   ﺔﺻﺎﺨﻟا ﺔﺤﻔﺼﻟا
ماﺪﺨﺘﺳا و ﻖﻴﺒﻄﺘﻟا اﺬﻫ ىلإﯽلﻮﺧﺪﻟا ﻚﻟﻮﺨﻳ    ةكلمملا ﻲﻓ ﺎﻬﺑ لﻮﻤﻌﻤﻟا ﺔﻴﻧﻮﻧﺎﻘﻟا تﺎﻤﻴﻈﻨﺘﻟا ﻖﻓو ﻚﺑ
  ﻡمﺎﻣأ ﺎﻘﺣﻻ ﺔﻴﻟوﺆﺴﻤﻟا ﻞﻣﺎﻛ ﻚﻠﻤﺤﻳ و ﺔﻳدﻮﻌﺴﻟا ﺔﻴﺑﺮﻌﻟا
 ﺺﺨﺗﺕتﺎﻴﻟﺎﻜﺷإﺇيأ عﻮﻗو لﺎﺣ ﺔﺼﺘﺨﻤﻟاﺕتﺎﻬﺠﻟا ﻊﻴﻤﺟ
.ﻖﻴﺒﻄﺘﻟا اﺬﻫ ﻲﻓ ﻪﺿﺮﻌﺗ ﺎﻣ`}</Text>
          <Text style={{ ...Fonts.fontLight }}>{`ﻥﺔﻴﻟوﺆﺴﻤﻟﺎﺑ ﻢﻠﻌﻟﺎﺑﺭراﺮﻗإ
ﺰﻳﺰﻌﻟا ﺎﻨﻠﻴﻤﻋ

 (“راﺮﻗإلا” ﺪﻌﺑ ﺎﻤﻴﻓ ﻪﻴﻟإ راشملاﺇ) اﺬﻫ ﺔﻴﻟؤوسملا ءﻼﺧإ ﺭراﺮﻗإ   ﺔﺻﺎﺨﻟا ﺔﺤﻔﺼﻟا
ماﺪﺨﺘﺳا و ﻖﻴﺒﻄﺘﻟا اﺬﻫ ىلإﯽلﻮﺧﺪﻟا ﻚﻟﻮﺨﻳ    ةكلمملا ﻲﻓ ﺎﻬﺑ لﻮﻤﻌﻤﻟا ﺔﻴﻧﻮﻧﺎﻘﻟا تﺎﻤﻴﻈﻨﺘﻟا ﻖﻓو ﻚﺑ
  ﻡمﺎﻣأ ﺎﻘﺣﻻ ﺔﻴﻟوﺆﺴﻤﻟا ﻞﻣﺎﻛ ﻚﻠﻤﺤﻳ و ﺔﻳدﻮﻌﺴﻟا ﺔﻴﺑﺮﻌﻟا
 ﺺﺨﺗﺕتﺎﻴﻟﺎﻜﺷإﺇيأ عﻮﻗو لﺎﺣ ﺔﺼﺘﺨﻤﻟاﺕتﺎﻬﺠﻟا ﻊﻴﻤﺟ
.ﻖﻴﺒﻄﺘﻟا اﺬﻫ ﻲﻓ ﻪﺿﺮﻌﺗ ﺎﻣ`}</Text>
          <Text style={{ ...Fonts.fontLight }}>{`ﻥﺔﻴﻟوﺆﺴﻤﻟﺎﺑ ﻢﻠﻌﻟﺎﺑﺭراﺮﻗإ
ﺰﻳﺰﻌﻟا ﺎﻨﻠﻴﻤﻋ

 (“راﺮﻗإلا” ﺪﻌﺑ ﺎﻤﻴﻓ ﻪﻴﻟإ راشملاﺇ) اﺬﻫ ﺔﻴﻟؤوسملا ءﻼﺧإ ﺭراﺮﻗإ   ﺔﺻﺎﺨﻟا ﺔﺤﻔﺼﻟا
ماﺪﺨﺘﺳا و ﻖﻴﺒﻄﺘﻟا اﺬﻫ ىلإﯽلﻮﺧﺪﻟا ﻚﻟﻮﺨﻳ    ةكلمملا ﻲﻓ ﺎﻬﺑ لﻮﻤﻌﻤﻟا ﺔﻴﻧﻮﻧﺎﻘﻟا تﺎﻤﻴﻈﻨﺘﻟا ﻖﻓو ﻚﺑ
  ﻡمﺎﻣأ ﺎﻘﺣﻻ ﺔﻴﻟوﺆﺴﻤﻟا ﻞﻣﺎﻛ ﻚﻠﻤﺤﻳ و ﺔﻳدﻮﻌﺴﻟا ﺔﻴﺑﺮﻌﻟا
 ﺺﺨﺗﺕتﺎﻴﻟﺎﻜﺷإﺇيأ عﻮﻗو لﺎﺣ ﺔﺼﺘﺨﻤﻟاﺕتﺎﻬﺠﻟا ﻊﻴﻤﺟ
.ﻖﻴﺒﻄﺘﻟا اﺬﻫ ﻲﻓ ﻪﺿﺮﻌﺗ ﺎﻣ`}</Text> */}
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
