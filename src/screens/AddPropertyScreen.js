import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import Colors from '../styles/Colors';
import { SafeAreaView } from 'react-navigation';
import Fonts from '../styles/Fonts';
import Styles from '../styles/Styles';
import Header from '../components/Header';
import { REGISTER } from '../services/graphql/queries'
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Dropdown from '../components/Dropdown';
import Input from '../components/Input';
import Button from '../components/Button';
import MapComponent from '../components/MapComponent'

const TYPES = [
  {
    id: 1,
    selected: false,
    name: 'ﻧﺰل تجاريﺹ'
  },
  {
    id: 2,
    selected: true,
    name: 'ﻧﺰل ﻧﺰل ﺧﺎصﺹ'
  },
]

export default function AddPropertyScreen(props) {
  const { navigate, goBack } = props.navigation
  const [types, setTypes] = useState(TYPES)
  const [location, setLocation] = useState(null)
  const [selectedType, setType] = useState(null)
  const [city, setCity] = useState(null)
  const [showMap, setMap] = useState(false)

  const categories = useStoreState(state => state.auth.categories)
  const commercial_types = useStoreState(state => state.auth.commercial_types)
  const private_types = useStoreState(state => state.auth.private_types)
  const cities = useStoreState(state => state.auth.cities)


  useEffect(() => {
  }, [])

  useEffect(() => {
    const items = [...categories]
    items.forEach(i => i.selected = false)
    items[0].selected = true
    setTypes(items)
  }, [categories])

  const renderMapSelection = () => {
    return (
      <TouchableOpacity style={styles.buttonContainer}>
        <MaterialIcons color={Colors.darkGray} size={18} name={'remove-red-eye'} />
        <TextInput placeholder={'placeholder' || ''}
          autoCapitalize={false}
          keyboardType={'default'}
          value={location}
          style={{
            flex: 4,
            textAlign: 'right',
            paddingTop: 4,
            paddingRight: 8,
            fontSize: 14,
            ...Fonts.fontRegular,
          }}
        />
      </TouchableOpacity>
    )
  }

  const renderSelection = (item, index) => {
    return (
      <TouchableOpacity key={index} onPress={() => {
        const cTypes = [...types]
        cTypes.forEach(i => i.selected = false)
        cTypes[index].selected = true
        setTypes(cTypes)
      }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <Text>{item.label}</Text>
        <View style={styles.selectionCircle}>
          {item.selected && <View style={styles.selectedCircle} />}
        </View>
      </TouchableOpacity>
    )
  }

  const renderDetails = () => {
    return (
      <View>

      </View>
    )
  }

  const renderDescription = () => {
    return (
      <View>
        <Text style={{ ...Fonts.FontMed, width: '100%', marginVertical: 12 }}>{`الوصف و اﻟﻤﻤﻴﺰات`}</Text>
        <Input style={{ height: 120 }} multiline placeholder={'وصف'} />
        <Input style={{ marginVertical: 12 }} placeholder={'اسم المالك'} />
        <Input style={{ marginBottom: 12, }} placeholder={'رقم التواصل'} />
        <Text style={{ ...Fonts.FontMed, width: '100%', marginVertical: 12 }}>{`ﺗﺤﺪﻳﺪ اﻷﺳﻌﺎر `}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
          <TouchableOpacity style={{ borderRadius: 100, maxWidth: 132, backgroundColor: '#E7E9EF', padding: 10, paddingHorizontal: 12 }}>
            <Text style={{ ...Fonts.fontRegular, textAlign: 'center' }}>{`  أيام المواسم`}</Text>
          </TouchableOpacity>
          <View style={{ width: 50 }} />
          <TouchableOpacity style={{ borderRadius: 100, maxWidth: 132, backgroundColor: '#E7E9EF', padding: 10, paddingHorizontal: 12 }}>
            <Text style={{ ...Fonts.fontRegular, textAlign: 'center' }}>{`  اﻷﺳﻌﺎر العامة `}</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ ...Fonts.FontMed, width: '100%', marginVertical: 12 }}>{`مايﻷا ﺪﻳﺪﺤﺗ`}</Text>
        <TouchableOpacity style={{ borderRadius: 100, maxWidth: 132, backgroundColor: '#E7E9EF', padding: 10, paddingHorizontal: 12, alignSelf: 'flex-end' }}>
          <Text style={{ ...Fonts.fontRegular, textAlign: 'center' }}>{`  اﻷﺳﻌﺎر العامة `}</Text>
        </TouchableOpacity>
        <Text style={{ ...Fonts.FontMed, width: '100%', marginVertical: 12 }}>{`روصلا`}</Text>
        <Input placeholder={'عدد الأقسام  المتوفرة بهذه المواصفات '} />
        <Text style={{ ...Fonts.FontMed, width: '100%', marginVertical: 12 }}>{`الصور`}</Text>
        <Input clickable={() => console.log('upload')} placeholder={'لزنلا روص'} />
        <Button style={{ alignSelf: 'center', width: 177, marginVertical: 12, }} onPress={() => console.log('button')} text={`إضافة`} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header Add onPressBack={() => goBack()} />
      <ScrollView contentContainerStyle={{}} style={{ flex: 1, width: '100%', paddingHorizontal: 24, }}>
        {/* <KeyboardAvoidingView style={{ flex: 1, width: '100%' }} */}
        {/* keyboardVerticalOffset={40} behavior={"position"}> */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingTop: 12, flexWrap: 'wrap', }}>
          {/* {renderSelection()} */}
          {types.map((i, index) => renderSelection(i, index))}
        </View>
        <Dropdown onChangeText={setType} data={types[0].selected ? commercial_types : private_types} style={{ marginTop: 12, }} placeholder={`نوع النزل`} />
        <Input style={{ marginVertical: 12 }} placeholder={`اسم النزل`} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginVertical: 6, }}>
          <Input style={{ width: 140 }} placeholder={`الحي`} />
          <Dropdown onChangeText={setCity} data={cities} style={{ width: 140 }} placeholder={`المدينة`} />
        </View>
        <Input clickable={() => setMap(true)} style={{ marginVertical: 12 }} placeholder={`اسم النزل`} />
        {renderDetails()}
        {renderDescription()}
        <View style={{ height: 400 }} />
        {/* </KeyboardAvoidingView> */}
      </ScrollView>
      {showMap && <MapComponent onClose={() => setMap(false)} isVisible={showMap} />}
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
  selectionCircle: {
    marginLeft: 8,
    borderWidth: 2,
    borderColor: Colors.primaryBlue,
    width: 20,
    height: 20,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectedCircle: {
    borderRadius: 20,
    height: 10,
    width: 10,
    backgroundColor: Colors.primaryYellow,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 12,
    marginHorizontal: 5,
    padding: 12,
    // paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 21,
    shadowOffset: { height: 2, width: 2 },
    shadowColor: 'black',
    shadowOpacity: 0.1,
    backgroundColor: 'white',
  },
});
