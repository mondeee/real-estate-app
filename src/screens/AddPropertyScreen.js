import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Image,
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
import ImageBrowser from '../components/ImageBrowserComponent';
import CalendarComponent from '../components/CalendarComponent';
import * as Permissions from "expo-permissions";
import { Toast } from 'native-base';
import FacilitiesSelectionComponent from '../components/FacilitiesSelectionComponent';

const TYPES = [
  {
    id: 1,
    selected: false,
    name: 'ﻧﺰل تجاريﺹ'
  },
  {
    id: 2,
    selected: true,
    name: 'ﻧﺰل ﺧﺎصﺹ'
  },
]

const COMMERCIAL_DATA = [
  {
    id: 1,
    name: 'غرفة خادمة ',
    value: 0,

  },
  {
    id: 2,
    name: 'غرفة سائق ',
    value: 0,
  },
  {
    id: 3,
    name: 'مسبح ',
    value: 0,
  },
  {
    id: 4,
    name: 'مؤثثة ',
    value: 0,
  },
  {
    id: 5,
    name: 'ملحق ',
    value: 0,
  },
  {
    id: 6,
    name: 'موقف سيارة  ',
    value: 0,
  },
  {
    id: 7,
    name: 'غرفة المعيشة ',
    value: 0,
  },
  {
    id: 8,
    name: 'دورة مياه ',
    value: 0,
  },
  {
    id: 9,
    name: 'غرفة نوم ',
    value: 0,
  },
  {
    id: 10,
    name: 'ةيجراخ ةحاس ',
    value: 0,
  },
  {
    id: 11,
    name: 'طابق ',
    value: 0,
  },
  {
    id: 12,
    name: 'مطبخ ',
    value: 0,
  },
]

const PRIVATE_DATA = [
  {
    id: 1,
    name: 'موقف سيارة  ',
    value: 0,
  },
  {
    id: 2,
    name: 'مسبح ',
    value: 0,
  },
  {
    id: 3,
    name: 'مؤثثة ',
    value: 0,
  },
  {
    id: 4,
    name: 'ساحة خارجية ',
    value: 0,
  },
  {
    id: 5,
    name: 'الفلل ',
    value: 0,
  },
  {
    id: 6,
    name: ' الأجنحة ',
    value: 0,
  },
  {
    id: 7,
    name: ' الشقق/ الغرف ',
    value: 0,
  },
  {
    id: 8,
    name: ' الأدوار ',
    value: 0,
  },
  {
    id: 9,
    name: ' الشالهيات ',
    value: 0,
  }
]

export default function AddPropertyScreen(props) {
  const { navigate, goBack } = props.navigation
  const COMMERCAL = COMMERCIAL_DATA
  const PRIVATE = PRIVATE_DATA
  const [types, setTypes] = useState(TYPES)
  const [location, setLocation] = useState(null)
  const [selectedType, setType] = useState(null)
  const [city, setCity] = useState(null)
  const [showMap, setMap] = useState(false)
  const [showImages, setShowImages] = useState(false)
  const [showRegistration, setShowRegistration] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showLicense, setShowLicense] = useState(false)
  const [license, setLicense] = useState(null)
  const [registration, setRegistration] = useState(null)

  //FACI
  const [isFaciVisible, setFaciVisible] = useState(false)
  const [selectedFac, setSeelectedFac] = useState(null)
  const [facilities, setFacilities] = useState(COMMERCAL)

  //
  const [photos, setSelectedPhotos] = useState(false)

  //CALENDARS
  const [general, setGeneral] = useState(false)

  const categories = useStoreState(state => state.auth.categories)
  const commercial_types = useStoreState(state => state.auth.commercial_types)
  const private_types = useStoreState(state => state.auth.private_types)
  const cities = useStoreState(state => state.auth.cities)


  useEffect(() => {
    // _requestPermission()
  }, [])

  const [isMediaAllowed, setAllowMedia] = useState(false)
  const _requestPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    if (status === 'granted') {
      console.log('@GRANED call fetch')
      setAllowMedia(true)
    } else {
      Toast.show({
        text: `Please allow the app to access the gallery`,
        buttonText: 'OK',
        type: "danger",
        duration: 50000,
      })
      setAllowMedia(false)
    }
  }

  useEffect(() => {
    const items = [...categories]
    items.forEach(i => i.selected = false)
    items[0].selected = true
    setTypes(items)
  }, [categories])


  useEffect(() => {
    if (types[0].selected) {
      setFacilities(COMMERCAL)
    } else {
      setFacilities(PRIVATE)
    }
  }, [types])


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

  const renderFaci = item => {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', width: '25%' }}>
        <TouchableOpacity style={{ borderRadius: 5, maxWidth: 132, backgroundColor: '#E7E9EF', padding: 4, paddingHorizontal: 8, alignSelf: 'flex-end', marginVertical: 12, }}>
          <Text style={{ ...Fonts.fontLight, textAlign: 'center', fontSize: 12 }}>{item.name || `facility name`}</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <TextInput
            maxLength={2}
            keyboardType={'numeric'}
            style={{ borderColor: 'gray', borderBottomWidth: 1, width: 17, marginRight: 4, fontSize: 12, }}
          />
          <Image style={{ height: 20, width: 20 }} source={item.image || require(`../../assets/bedicon.png`)} />
        </View>
      </View>
    )
  }

  const renderDetails = () => {
    return (
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Text style={{ width: '100%', textAlign: 'right', ...Fonts.FontMed }}>{`المرافق`}</Text>
          <TouchableOpacity onPress={() => setFaciVisible(true)}>
            <Text style={{ ...Fonts.fontRegular, textAlign: 'center' }}>{`  Add + `}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
          {selectedFac && selectedFac.map(i => renderFaci(i))}
        </View>
      </View>
    )
  }

  const renderFooterButton = () => {

    if (types[0].selected == true) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Button style={{ alignSelf: 'center', marginVertical: 12, }} onPress={() => navigate('AddSection')} text={`ﺇإﺿﺎﻓﺔ ﻣﺮاﻓﻖ اﻟﻨﺰل`} />
          <View style={{ width: 30 }} />
          <Button style={{ alignSelf: 'center', width: 88, marginVertical: 12, paddingTop: 12 }} onPress={() => console.log('button')} text={`حفظ`} />
        </View>
      )
    }

    return (
      <Button style={{ alignSelf: 'center', width: 177, marginVertical: 12, }} onPress={() => console.log('button')} text={`إضافة`} />
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
          <TouchableOpacity
            onPress={() => {
              setGeneral(false)
              setShowCalendar(true)
            }}
            style={{ borderRadius: 100, maxWidth: 132, backgroundColor: '#E7E9EF', padding: 10, paddingHorizontal: 12 }}>
            <Text style={{ ...Fonts.fontRegular, textAlign: 'center' }}>{`  أيام المواسم`}</Text>
          </TouchableOpacity>
          <View style={{ width: 50 }} />
          <TouchableOpacity onPress={() => {
            setGeneral(true)
            setShowCalendar(true)
          }} style={{ borderRadius: 100, maxWidth: 132, backgroundColor: '#E7E9EF', padding: 10, paddingHorizontal: 12 }}>
            <Text style={{ ...Fonts.fontRegular, textAlign: 'center' }}>{`  اﻷﺳﻌﺎر العامة `}</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ ...Fonts.FontMed, width: '100%', marginVertical: 12 }}>{`ﺗﺤﺪﻳﺪ اﻷيام `}</Text>
        <TouchableOpacity style={{ borderRadius: 100, maxWidth: 132, backgroundColor: '#E7E9EF', padding: 10, paddingHorizontal: 12, alignSelf: 'flex-end' }}>
          <Text style={{ ...Fonts.fontRegular, textAlign: 'center' }}>{`  اﻷﺳﻌﺎر العامة `}</Text>
        </TouchableOpacity>
        <Text style={{ ...Fonts.FontMed, width: '100%', marginVertical: 12 }}>{`عدد القسم`}</Text>
        <Input placeholder={'عدد الأقسام  المتوفرة بهذه المواصفات  '} />
        <Text style={{ ...Fonts.FontMed, width: '100%', marginVertical: 12 }}>{`الصور`}</Text>
        {types[0].selected && <Input style={{ marginTop: 12 }} upload clickable={() => setShowImages(true)} placeholder={'السجل التجاري)اختياري('} />}
        <Input style={{ marginTop: 12 }} upload clickable={() => setShowLicense(true)} placeholder={types[0].selected ? 'رخصة التشغيل)اختياري(' : ` إثبات ملكية النزل )اختياري(`} />
        <Input style={{ marginVertical: 12 }} upload clickable={() => setShowImages(true)} placeholder={types[0].selected ? 'صور النزل)اختياري(' : `صور النزل`} />
        {renderFooterButton()}
      </View >
    )
  }

  return (
    <View style={styles.container}>
      <Header Add onPressBack={() => navigate('Home')} />
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
        <Input clickable={() => setMap(true)} style={{ marginVertical: 12 }} placeholder={`الموقع على الخريطة `} />
        {renderDetails()}
        {renderDescription()}
        <View style={{ height: 400 }} />
        {/* </KeyboardAvoidingView> */}
      </ScrollView>
      <CalendarComponent general={general} onClose={() => {
        setGeneral(false)
        setShowCalendar(false)
      }} isVisible={showCalendar} />
      <ImageBrowser onClose={() => setShowRegistration(false)} setPhotos={registration} key={`Commercial Registration`} isVisible={showRegistration} />
      <ImageBrowser onClose={() => setShowLicense(false)} setPhotos={license} key={'Operating License'} isVisible={showLicense} />
      <ImageBrowser requestPermission multiple onClose={() => setShowImages(false)} setPhotos={setSelectedPhotos} key={'Hostel Photos'} isVisible={showImages} />
      {showMap && <MapComponent initialValue={location} onPress={setLocation} onClose={() => setMap(false)} isVisible={showMap} />}
      <FacilitiesSelectionComponent onClose={() => setFaciVisible(false)} data={facilities} setSelected={setSeelectedFac} isVisible={isFaciVisible} />
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
