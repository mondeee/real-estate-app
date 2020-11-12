import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native';

import Colors from '../styles/Colors';
import { SafeAreaView } from 'react-navigation';
import Fonts from '../styles/Fonts';
import Styles from '../styles/Styles';
import Header from '../components/Header';
import { REGISTER, ADD_SECTION_PROPERTY, onError, UPDATE_SECTION_PROPERTY } from '../services/graphql/queries'
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useStoreActions, useStoreState } from 'easy-peasy';
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
import { COMMERCIAL_FACILITIES } from '../constants/data';
import { ActivityIndicator } from 'react-native';

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


const ASDASD = [
  {
    id: 1,
    name: 'غرفة خادمة',
    value: 0,
    image: require('../../assets/bedicon.png'),
  },
  {
    id: 2,
    name: 'غرفة سائق ',
    value: 0,
    image: require('../../assets/garage.png'),
  },
  {
    id: 3,
    name: 'مسبح ',
    value: 0,
    image: require('../../assets/swim.png'),
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
    image: require('../../assets/room.png'),
  },
  {
    id: 6,
    name: 'موقف سيارة  ',
    value: 0,
    image: require('../../assets/garage.png'),
  },
  {
    id: 7,
    name: 'غرفة المعيشة ',
    value: 0,
    image: require('../../assets/sofa.png'),
  },
  {
    id: 8,
    name: 'دورة مياه ',
    value: 0,
    image: require('../../assets/bathub.png'),
  },
  {
    id: 9,
    name: 'غرفة نوم ',
    value: 0,
    image: require('../../assets/queenbed.png'),
  },
  {
    id: 10,
    name: 'ةيجراخ ةحاس ',
    value: 0,
    image: require('../../assets/yard.png'),
  },
  {
    id: 11,
    name: 'طابق ',
    value: 0,
    image: require('../../assets/stairs.png'),
  },
  {
    id: 12,
    name: 'مطبخ ',
    value: 0,
    image: require('../../assets/dining.png'),
  },
]

export default function UpdateSectionScreen(props) {
  const { navigate, goBack, state: { params: { item, refresh } } } = props.navigation
  const COMMERCIAL = COMMERCIAL_FACILITIES
  // console.log(item)
  const [types, setTypes] = useState(TYPES)
  const [location, setLocation] = useState(null)
  const [selectedType, setType] = useState(null)
  const [city, setCity] = useState(null)
  const [showMap, setMap] = useState(false)
  const [showImages, setShowImages] = useState(false)
  const [showRegistration, setShowRegistration] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showSeasonal, setShowSeasonal] = useState(false)
  const [showAvailability, setShowAvailability] = useState(false)
  const [showLicense, setShowLicense] = useState(false)
  const [license, setLicense] = useState(null)
  const [registration, setRegistration] = useState(null)
  const [photos, setSelectedPhotos] = useState([])

  //CALENDARS
  const [general, setGeneral] = useState(false)
  const [generalPrice, setGeneralPrice] = useState(item.general_price)
  const [seasonalPrice, setSeasonalPrice] = useState([])
  const [seasonalDates, setSeasonalDates] = useState(null)
  const [availabilityDates, setAvailabilityDates] = useState(item.availablities)

  //FACI
  const [isFaciVisible, setFaciVisible] = useState(false)
  const [selectedFac, setSelectedFac] = useState(null)
  const [finalFac, setFinalFac] = useState(null)
  const [facilities, setFacilities] = useState(COMMERCIAL)

  const categories = useStoreState(state => state.auth.categories)
  const commercial_types = useStoreState(state => state.auth.commercial_types)
  const private_types = useStoreState(state => state.auth.private_types)
  const cities = useStoreState(state => state.auth.cities)
  const [loading, setLoading] = useState(false)

  const [isMediaAllowed, setAllowMedia] = useState(false)
  const [payload, setPayload] = useState({
    section_id: item.id || '',
    name: item.name || '',
    description: item.description || ''
    // contact_no: item.contact_no || '',
    // contact_name: item.contact_name || ''
  })

  const [updateSectionProperty, { data, error }] = useMutation(UPDATE_SECTION_PROPERTY, {
    onCompleted: e => {
      console.log('@onComplete', e)
      Toast.show({
        text: 'تم اضافة القسم بنجاح',
        type: 'success'
      })
      refresh()
      setTimeout(() => {
        goBack()
      }, 1500)
    }
  })

  useEffect(() => {
    if (data || error)
      setLoading(false)
  }, [data, error])

  useEffect(() => {
    console.log('EDITSECTION', availabilityDates)
  }, [availabilityDates])


  useEffect(() => {
    // _requestPermission()
    if (selectedFac && selectedFac.length > 0) {
      const items = JSON.parse(JSON.stringify(selectedFac))
      items.forEach(i => {
        i.facility_id = i.id
        delete i.id
        delete i.name
        delete i.image
      })
      setFinalFac(items)
    }
  }, [selectedFac])

  useEffect(() => {
    loadFaci()
    setData()
    // console.log('@PARAMS', item)
  }, [])

  const setData = () => {
    const gprice = { ...generalPrice }
    delete gprice?.__typename
    setGeneralPrice(gprice)
  }

  const loadFaci = () => {
    const items = [...facilities]
    items.forEach(i => {
      item.facilities.forEach(q => {
        if (q.facility.id == i.id) {
          i.value = 1
        }
      })
    })
    // console.log('@ITEMS', items)
    const fitems = items.filter(i => i.value == 1)
    setSelectedFac(fitems)
    setFacilities(items)
  }

  const _requestPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    if (status === 'granted') {
      console.log('@GRANED call fetch')
      setAllowMedia(true)
    } else {
      Toast.show({
        text: `يرجى السماح لتطبيق نزل بالوصول إلى المعرض لإضافة الصور حتى تتمكن من إضافة صورة نزلك`,
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

  const validateData = () => {
    let validate = false
    // console.log('@PAYlOAD', payload)
    if (!payload) {
      validate = false
      Toast.show({
        text: 'الرجاء إضافة بعض المرافق   .',
        type: 'danger'
      })
      return validate
    }

    // if (!location) {
    //   Toast.show({
    //     text: 'Location is unknown',
    //     type: 'danger'
    //   })
    //   validate = false
    //   return validate
    // }

    if (!photos) {
      Toast.show({
        text: 'يرجى رفع الصور ',
        type: 'danger'
      })
      validate = false
      return validate
    }

    if (photos?.length > 6) {
      Toast.show({
        text: 'الحد الاعلى لرفع الصور ٦ صور ',
        type: 'danger'
      })
      validate = false
      return validate
    }

    // if (!registration) {
    //   Toast.show({
    //     text: 'Please provide some Registration info.',
    //     type: 'danger'
    //   })
    //   validate = false
    //   return validate
    // }

    // if (!facilities) {
    //   Toast.show({
    //     text: 'Please add some facilities and details.',
    //     type: 'danger'
    //   })
    //   validate = false
    //   return validate
    // }

    // if (!license) {
    //   Toast.show({
    //     text: 'Please provide some License info.',
    //     type: 'danger'
    //   })
    //   validate = false
    //   return validate
    // }

    if (!generalPrice) {
      Toast.show({
        text: 'الرجاء إضافة الأسعار العامة.',
        type: 'danger'
      })
      validate = false
      return validate
    }

    return true
  }

  const onUpdateSection = async () => {
    const { params } = props.navigation.state
    setLoading(true)
    // const imageFile = new ReactNativeFile({
    //   uri: image,
    //   type: 'image/png',
    //   name: 'image.png'
    // })
    // console.log('regisration', registration)
    // console.log('license', license)
    // console.log('photos', photos)
    const item = types.filter(i => i.selected)
    const data = { ...payload }
    data.property_id = params.id
    data.type_id = 2
    data.facilities = finalFac
    data.images = photos && photos.length > 0 ? photos : []
    data.general_price = generalPrice
    data.seasonal_prices = seasonalPrice
    data.availablities = availabilityDates
    const fpayload = {
      variables: {
        "input": data
      }
    }
    console.log('@finalPayload', fpayload)
    // return
    updateSectionProperty(fpayload).catch(e => {
      onError(e)
    })
  }

  const renderSelection = (item, index) => {
    return (
      <TouchableOpacity key={index} onPress={() => {
        const cTypes = [...types]
        cTypes.forEach(i => i.selected = false)
        cTypes[index].selected = true
        setTypes(cTypes)
      }} style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <Text>{item.label}</Text>
        <View style={styles.selectionCircle}>
          {item.selected && <View style={styles.selectedCircle} />}
        </View>
      </TouchableOpacity>
    )
  }

  const renderFaci = item => {
    if (item.type == 'boolean') {
      return (
        <View key={item.id} style={{ alignItems: 'center', justifyContent: 'center', width: '25%' }}>
          <TouchableOpacity style={{ borderRadius: 5, maxWidth: 132, backgroundColor: '#E7E9EF', padding: 4, paddingHorizontal: 8, alignSelf: 'flex-end', marginVertical: 12, }}>
            <Text style={{ ...Fonts.fontLight, textAlign: 'center', fontSize: 12 }}>{item.name || `facility name`}</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name={item.value > 0 ? 'check' : 'close'} color={Colors.primaryBlue} size={25} />
          </View>
        </View>
      )
    }

    return (
      <View key={item.id} style={{ alignItems: 'center', justifyContent: 'center', width: '25%' }}>
        <TouchableOpacity style={{ borderRadius: 5, maxWidth: 132, backgroundColor: '#E7E9EF', padding: 4, paddingHorizontal: 8, alignSelf: 'flex-end', marginVertical: 12, }}>
          <Text style={{ ...Fonts.fontLight, textAlign: 'center', fontSize: 12 }}>{item.name || `facility name`}</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'center' }}>
          <TextInput
            maxLength={2}
            value={item.value.toString()}
            onChangeText={e => {
              var facis = selectedFac
              facis[index].value = e
              setSelectedFac(facis)
            }}
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
        <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Text style={{ width: '100%', textAlign: 'right', ...Fonts.FontMed }}>{`المرافق`}</Text>
          <TouchableOpacity onPress={() => setFaciVisible(true)}>
            <Text style={{ ...Fonts.fontRegular, textAlign: 'center' }}>{`  Add + `}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
          {selectedFac && selectedFac.map(i => renderFaci(i))}
        </View>
      </View>
    )
  }


  const renderFooterButton = () => {

    // if (types[0].selected == true) {
    //   return (
    //     <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
    //       <Button style={{ alignSelf: 'center', marginVertical: 12, }} onPress={() => console.log('button')} text={`ﺇإﺿﺎﻓﺔ ﻣﺮاﻓﻖ اﻟﻨﺰل`} />
    //       <View style={{ width: 30 }} />
    //       <Button style={{ alignSelf: 'center', width: 88, marginVertical: 12, paddingTop: 12 }} onPress={() => console.log('button')} text={`حفظ`} />
    //     </View>
    //   )
    // }
    if (loading) {
      return (
        <ActivityIndicator color={Colors.primaryBlue} />
      )
    }

    return (
      <Button style={{ alignSelf: 'center', width: 177, marginVertical: 12, }} onPress={() => {
        if (validateData()) {
          onUpdateSection()
        }
      }} text={`إضافة`} />
    )
  }

  const renderDescription = () => {
    return (
      <View>
        <Text style={{ ...Fonts.FontMed, width: '100%', marginVertical: 12 }}>{`الوصف و اﻟﻤﻤﻴﺰات`}</Text>
        <Input value={payload.description} maxLength={600} multiline={true} onChangeText={e => {
          const item = { ...payload }
          item.description = e
          setPayload(item)
        }}
          style={{ height: 120 }} multiline placeholder={'وصف'} />
        {/* <Input style={{ marginVertical: 12 }} placeholder={'اسم المالك'} /> */}
        {/* <Input style={{ marginBottom: 12, }} placeholder={'رقم التواصل'} /> */}
        <Text style={{ ...Fonts.FontMed, width: '100%', marginVertical: 12 }}>{`ﺗﺤﺪﻳﺪ اﻷﺳﻌﺎر `}</Text>
        <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
          <TouchableOpacity
            onPress={() => {
              setShowCalendar(true)
            }}
            style={{ borderRadius: 100, maxWidth: 132, backgroundColor: '#E7E9EF', padding: 10, paddingHorizontal: 12 }}>
            <Text style={{ ...Fonts.fontRegular, textAlign: 'center' }}>{`  أيام المواسم`}</Text>
          </TouchableOpacity>
          <View style={{ width: 50 }} />
          <TouchableOpacity onPress={() => {
            setShowSeasonal(true)
          }} style={{ borderRadius: 100, maxWidth: 132, backgroundColor: '#E7E9EF', padding: 10, paddingHorizontal: 12 }}>
            <Text style={{ ...Fonts.fontRegular, textAlign: 'center' }}>{`  اﻷﺳﻌﺎر العامة `}</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ ...Fonts.FontMed, width: '100%', marginVertical: 12 }}>{`ﺗﺤﺪﻳﺪ اﻷيام `}</Text>
        <TouchableOpacity onPress={() => setShowAvailability(true)} style={{ borderRadius: 100, maxWidth: 132, backgroundColor: '#E7E9EF', padding: 10, paddingHorizontal: 12, alignSelf: 'flex-end' }}>
          <Text style={{ ...Fonts.fontRegular, textAlign: 'center' }}>{`  اﻷﺳﻌﺎر العامة `}</Text>
        </TouchableOpacity>
        <Text style={{ ...Fonts.FontMed, width: '100%', marginVertical: 12 }}>{`عدد القسم`}</Text>
        <Input placeholder={'عدد الأقسام  المتوفرة بهذه المواصفات  '} />
        <Text style={{ ...Fonts.FontMed, width: '100%', marginVertical: 12 }}>{`الصور`}</Text>
        {/* {types[0].selected && <Input style={{ marginTop: 12 }} upload clickable={() => setShowImages(true)} placeholder={'السجل التجاري)اختياري('} />} */}
        {/* <Input style={{ marginTop: 12 }} upload clickable={() => setShowLicense(true)} placeholder={types[0].selected ? 'رخصة التشغيل)اختياري(' : ` إثبات ملكية النزل )اختياري(`} /> */}
        <Input style={{ marginVertical: 12 }} value={photos.concat(item.images)} upload clickable={() => setShowImages(true)} placeholder={`صور النزل`} />
        {renderFooterButton()}
      </View >
    )
  }

  return (
    <View style={styles.container}>
      <Header Add Section onPressBack={() => goBack()} />
      <ScrollView contentContainerStyle={{}} style={{ flex: 1, width: '100%', paddingHorizontal: 24, }}>
        {/* <KeyboardAvoidingView style={{ flex: 1, width: '100%' }} */}
        {/* keyboardVerticalOffset={40} behavior={"position"}> */}
        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingTop: 12, flexWrap: 'wrap', }}> */}
        {/* {renderSelection()} */}
        {/* {types.map((i, index) => renderSelection(i, index))} */}
        {/* </View> */}
        {/* <Dropdown onChangeText={e => {
          const item = { ...payload }
          item.type_id = e.id
          setPayload(item)
        }} data={types[0].selected ? commercial_types : private_types} style={{ marginTop: 12, }} placeholder={`نوع النزل`} /> */}
        <Input value={payload.name} onChangeText={e => {
          const item = { ...payload }
          item.name = e
          setPayload(item)
        }}
          style={{ marginVertical: 12 }} placeholder={`اسم القسم`} />
        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginVertical: 6, }}>
          <Input style={{ width: 140 }} placeholder={`الحي`} />
          <Dropdown onChangeText={setCity} data={cities} style={{ width: 140 }} placeholder={`المدينة`} />
        </View>
        <Input clickable={() => setMap(true)} style={{ marginVertical: 12 }} placeholder={`الموقع على الخريطة `} /> */}
        {renderDetails()}
        {renderDescription()}
        <View style={{ height: 400 }} />
        {/* </KeyboardAvoidingView> */}
      </ScrollView>
      {showCalendar && <CalendarComponent seasonal={seasonalPrice} setPrice={setSeasonalPrice} setDates={setSeasonalDates} key={'seasonal'} onClose={() => {
        setShowCalendar(false)
      }} isVisible={showCalendar} />}
      <CalendarComponent setPrice={setGeneralPrice} data={generalPrice} general={true} onClose={() => {
        setShowSeasonal(false)
      }} isVisible={showSeasonal} />
      <CalendarComponent setDates={setAvailabilityDates} data={availabilityDates} availabilities={true} key={'calendar'} onClose={() => {
        setShowAvailability(false)
      }} isVisible={showAvailability} />
      {/* <ImageBrowser onClose={() => setShowRegistration(false)} setPhotos={registration} key={`Commercial Registration`} isVisible={showRegistration} /> */}
      {/* <ImageBrowser onClose={() => setShowLicense(false)} setPhotos={license} key={'Operating License'} isVisible={showLicense} /> */}
      <ImageBrowser requestPermission multiple onClose={() => setShowImages(false)} setPhotos={setSelectedPhotos} key={'Hostel Photos'} isVisible={showImages} />
      {showMap && <MapComponent initialValue={location} onPress={setLocation} onClose={() => setMap(false)} isVisible={showMap} />}
      <FacilitiesSelectionComponent onClose={() => setFaciVisible(false)} data={facilities} setSelected={setSelectedFac} isVisible={isFaciVisible} />
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
    flexDirection: global.isAndroid ? 'row-reverse' : 'row',
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
