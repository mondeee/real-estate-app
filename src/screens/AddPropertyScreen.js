import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import Colors from '../styles/Colors';
import { NavigationActions, SafeAreaView, StackActions } from 'react-navigation';
import Fonts from '../styles/Fonts';
import Styles from '../styles/Styles';
import Header from '../components/Header';
import { REGISTER, ADD_PRIVATE_PROPERY, ADD_COMMERCIAL_PROPERTY, onError } from '../services/graphql/queries'
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { ScrollView } from 'react-native-gesture-handler';
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
import { ReactNativeFile } from 'apollo-upload-client'

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
    type: 'boolean',
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

const PRIVATE_DATA = [
  {
    id: 1,
    name: 'موقف سيارة ',
    value: 0,
    image: require('../../assets/garage.png'),
  },
  {
    id: 2,
    name: 'مسبح ',
    value: 0,
    image: require('../../assets/swim.png'),
  },
  {
    id: 3,
    name: 'مؤثثة ',
    value: 0,
    type: 'boolean',
    // image: '../../assets/garage.png',
  },
  {
    id: 4,
    name: 'ساحة خارجية ',
    value: 0,
    image: require('../../assets/yard.png'),
  },
  {
    id: 5,
    name: 'الفلل ',
    value: 0,
    image: require('../../assets/house.png'),
  },
  {
    id: 6,
    name: ' الأجنحة ',
    value: 0,
    image: require('../../assets/apartment.png'),
  },
  {
    id: 7,
    name: ' الشقق/ الغرف ',
    value: 0,
    image: require('../../assets/apartment.png'),
  },
  {
    id: 8,
    name: ' الأدوار ',
    value: 0,
    image: require('../../assets/stairs.png'),
  },
  {
    id: 9,
    name: ' الشالهيات ',
    value: 0,
    image: require('../../assets/plant.png'),
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
  const [showSeasonal, setShowSeasonal] = useState(false)
  const [showAvailability, setShowAvailability] = useState(false)
  const [showLicense, setShowLicense] = useState(false)
  const [license, setLicense] = useState(null)
  const [registration, setRegistration] = useState(null)
  const [payload, setPayload] = useState({})
  //FACI
  const [isFaciVisible, setFaciVisible] = useState(false)
  const [selectedFac, setSeelectedFac] = useState(null)
  const [finalFac, setFinalFac] = useState(null)
  const [facilities, setFacilities] = useState(COMMERCAL)
  //
  const [photos, setSelectedPhotos] = useState(false)
  //CALENDARS
  const [general, setGeneral] = useState(true)
  const [generalPrice, setGeneralPrice] = useState({
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0,
    saturday: 0,
    sunday: 0
  })
  const [seasonalPrice, setSeasonalPrice] = useState([])
  const [seasonalDates, setSeasonalDates] = useState(null)
  const [availabilityDates, setAvailabilityDates] = useState([])
  const categories = useStoreState(state => state.auth.categories)
  const commercial_types = useStoreState(state => state.auth.commercial_types)
  const private_types = useStoreState(state => state.auth.private_types)
  const cities = useStoreState(state => state.auth.cities)
  const storedDistricts = useStoreState(state => state.auth.districts)
  const storedLocation = useStoreState(state => state.auth.location)

  const initialState = () => {
    setPayload({})
    setSeasonalPrice([])
    setAvailabilityDates([])
    setLicense(null)
    setRegistration(null)
    setSelectedPhotos(null)
    setFinalFac(null)
    setLocation(null)
    setSeelectedFac(null)
    setFacilities(COMMERCAL)
    setLocation(storedLocation)
    setGeneralPrice(
      {
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        sunday: 0
      }
    )
  }

  useEffect(() => {
    if (storedLocation) {
      console.log('storedLoc', storedLocation)
      setLocation(storedLocation)
    }
  }, [storedLocation])

  useEffect(() => {
  }, [availabilityDates])

  useEffect(() => {
  }, [seasonalPrice])

  useEffect(() => {
    if (selectedFac) {
      const items = JSON.parse(JSON.stringify(selectedFac))
      items.forEach(i => {
        i.facility_id = i.id
        delete i.name
        delete i.image
        delete i.type
        delete i.id
      })
      setFinalFac(items)
    }
  }, [selectedFac])

  const [isMediaAllowed, setAllowMedia] = useState(false)
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

  const [addPrivateProperty, { data, error, loading }] = useMutation(ADD_PRIVATE_PROPERY, {
    onCompleted: e => {
      // console.log('@Complete ADD PRIVATE', e)
      Toast.show({
        text: 'تم اضافة النزل الخاص بنجاح',
        type: 'success'
      })
      initialState()
      navigate('Home')
    }
  })
  const [addCommercialPropety, { data: commercial_data, error: commercial_error, loading: commercial_loading }] = useMutation(ADD_COMMERCIAL_PROPERTY, {
    onCompleted: e => {
      console.log('@Complete ADD COMMERCIAL', commercial_data)
      Toast.show({
        text: 'تم اضافة النزل التجاري بنجاح',
        type: 'success'
      })
    }
  })

  useEffect(() => {
    console.log('@@ADDCOMMERCIAL', commercial_error, commercial_data)
  }, [commercial_data, commercial_error])

  useEffect(() => {
    console.log('@ADDPROPERTYLISTENER', error, data)
  }, [data, error])

  const validatePrivate = () => {
    let validate = false
    // console.log('@PAYlOAD', payload)
    if (!payload) {
      validate = false
      Toast.show({
        text: 'يرجى ادخال جميع البيانات المطلوبة',
        type: 'danger'
      })
      return validate
    }

    if (!location) {
      Toast.show({
        text: 'الموقع غير معروف',
        type: 'danger'
      })
      validate = false
      return validate
    }

    if (!photos) {
      Toast.show({
        text: 'يرجى رفع الصور ',
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

    if (!license) {
      Toast.show({
        text: 'يرجى رفع صورة اثبات الملكية او السجل التجاري',
        type: 'danger'
      })
      validate = false
      return validate
    }

    if (!generalPrice) {
      Toast.show({
        text: 'يرجى ادخال الأسعار العامة ',
        type: 'danger'
      })
      validate = false
      return validate
    }

    return true
  }

  const validateCommercial = () => {
    let validate = false
    // console.log('@PAYlOAD', payload)
    if (!payload) {
      validate = false
      Toast.show({
        text: 'يرجى ادخال جميع البيانات المطلوبة ',
        type: 'danger'
      })
      return validate
    }

    if (!location) {
      Toast.show({
        text: 'الموقع غير معروفn',
        type: 'danger'
      })
      validate = false
      return validate
    }

    if (!photos) {
      Toast.show({
        text: 'يرجى رفع الصور',
        type: 'danger'
      })
      validate = false
      return validate
    }

    if (!registration) {
      Toast.show({
        text: 'يرجي رفع صورة رخصة التشيل',
        type: 'danger'
      })
      validate = false
      return validate
    }

    if (!facilities) {
      Toast.show({
        text: 'Please add some facilities and details.',
        type: 'danger'
      })
      validate = false
      return validate
    }

    if (!license) {
      Toast.show({
        text: 'يرجى رفع صورة اثبات الملكية او السجل التجاري',
        type: 'danger'
      })
      validate = false
      return validate
    }

    // if (!generalPrice) {
    //   Toast.show({
    //     text: 'Please add some general prices.',
    //     type: 'danger'
    //   })
    //   validate = false
    //   return validate
    // }

    return true
  }

  const onCreatePrivate = async () => {
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
    data.facilities = finalFac
    data.category_id = 2
    data.proof_of_ownership = license && license.lengh > 0 ? license[0] : null
    data.images = photos && photos.length > 0 ? photos : []
    data.latitude = location.latitude
    data.longitude = location.longitude
    data.general_price = generalPrice
    data.seasonal_prices = seasonalPrice
    data.availablities = availabilityDates
    const fpayload = {
      variables: {
        "input": data
      }
    }
    console.log('@PRIVATE', fpayload)
    // return
    addPrivateProperty(fpayload).catch(e => {
      onError(e)
    })
  }

  const onCreateCommercial = () => {
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
    data.facilities = finalFac
    data.category_id = 1
    data.proof_of_commercial_license = registration[0]
    data.proof_of_operation_license = license[0]
    data.images = photos && photos.length > 0 ? photos : []
    data.latitude = location.latitude
    data.longitude = location.longitude
    delete data.contact_name
    const fpayload = {
      variables: {
        "input": data
      }
    }
    console.log('@payload', fpayload)
    // return
    addCommercialPropety(fpayload).catch(e => {
      onError(e)
    })
  }

  useEffect(() => {
    const items = [...categories]
    items.forEach(i => i.selected = false)
    items[0].selected = true
    setTypes(items)
  }, [categories])


  useEffect(() => {
    facilities.forEach(i => {
      i.value = 0
    })
    if (types[0].selected) {
      setFacilities(COMMERCAL)
      setPayload(item)
    } else {
      setFacilities(PRIVATE)
      setPayload(item)
    }
    setSeelectedFac([])
    const item = types.filter(i => i.selected)
    const p = { ...payload }
    p.category_id = item[0].id.toString()
    setPayload(p)
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
        const p = { ...payload }
        cTypes.forEach(i => i.selected = false)
        cTypes[index].selected = true
        // p.type_id = cTypes[index].id
        // setPayload(p)
        setTypes(cTypes)
      }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <Text>{item.label}</Text>
        <View style={styles.selectionCircle}>
          {item.selected && <View style={styles.selectedCircle} />}
        </View>
      </TouchableOpacity>
    )
  }

  const renderFaci = (item, index) => {
    if (item.type == 'boolean') {
      return (
        <View key={index} style={{ alignItems: 'center', justifyContent: 'center', width: '25%' }}>
          <TouchableOpacity style={{ borderRadius: 5, maxWidth: 132, backgroundColor: '#E7E9EF', padding: 4, paddingHorizontal: 8, alignSelf: 'flex-end', marginVertical: 12, }}>
            <Text style={{ ...Fonts.fontLight, textAlign: 'center', fontSize: 12 }}>{item.name || `facility name`}</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name={item.value > 0 ? 'check' : 'close'} color={Colors.primaryBlue} size={25} />
          </View>
        </View>
      )
    }

    return (
      <View key={index} style={{ alignItems: 'center', justifyContent: 'center', width: '25%' }}>
        <TouchableOpacity style={{ borderRadius: 5, maxWidth: 132, backgroundColor: '#E7E9EF', padding: 4, paddingHorizontal: 8, alignSelf: 'flex-end', marginVertical: 12, }}>
          <Text style={{ ...Fonts.fontLight, textAlign: 'center', fontSize: 12 }}>{item.name || `facility name`}</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <TextInput
            maxLength={2}
            value={item.value.toString()}
            onChangeText={e => {
              var facis = [...selectedFac]
              facis[index].value = e
              setSeelectedFac(facis)
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
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
          <TouchableOpacity onPress={() => setFaciVisible(true)}>
            <Text style={{ width: '100%', textAlign: 'right', ...Fonts.FontMed }}>{`المرافق (+ Add)`}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
          {selectedFac && selectedFac.map((i, index) => renderFaci(i, index))}
        </View>
      </View>
    )
  }

  const renderFooterButton = () => {

    if (types[0].selected == true) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Button style={{ alignSelf: 'center', marginVertical: 12, }} onPress={() => {
            if (commercial_data) {
              // console.log(commercial_data.addCommercialPropety.property_id)
              navigate('AddSection', { id: commercial_data.addCommercialPropety.property_id })
            } else {
              Toast.show({
                text: 'يرجى حفظ معلومات النزل قبل اضافة الاقسام',
                type: 'danger'
              })
            }
          }} text={`ﺇإﺿﺎﻓﺔ ﻣﺮاﻓﻖ اﻟﻨﺰل`} />
          <View style={{ width: 30 }} />
          <Button onPress={() => {
            // console.log('@facis', selectedFac)
            if (!commercial_data) {
              if (validateCommercial()) {
                onCreateCommercial()
              }
            }
          }
          } style={{ alignSelf: 'center', width: 88, marginVertical: 12, paddingTop: 12 }} text={`حفظ`} />
        </View>
      )
    }

    return (
      <Button onPress={() => {
        if (validatePrivate()) {
          onCreatePrivate()
        }
      }} style={{ alignSelf: 'center', width: 177, marginVertical: 12, }} text={`إضافة`} />
    )
  }

  const renderDescription = () => {
    return (
      <View>
        <Text style={{ ...Fonts.FontMed, width: '100%', marginVertical: 12 }}>{`الوصف و اﻟﻤﻤﻴﺰات`}</Text>
        <Input maxLength={300} value={payload.description} onChangeText={e => {
          const i = { ...payload }
          i.description = e
          setPayload(i)
        }} style={{ height: 120 }} multiline placeholder={'وصف'} />
        {types[1].selected && <Input value={payload.contact_name} onChangeText={e => {
          const i = { ...payload }
          i.contact_name = e
          setPayload(i)
        }} style={{ marginVertical: 12 }} placeholder={'اسم المالك'} />}
        <Input value={payload.contact_no} onChangeText={e => {
          const i = { ...payload }
          i.contact_no = e
          setPayload(i)
        }} style={{ marginBottom: 12, marginTop: types[0].selected ? 12 : 0 }} placeholder={'رقم التواصل'} />
        {types[1].selected && <Text style={{ ...Fonts.FontMed, width: '100%', marginVertical: 12 }}>{`ﺗﺤﺪﻳﺪ اﻷﺳﻌﺎر `}</Text>}
        {types[1].selected && <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
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
        </View>}
        {types[1].selected && <Text style={{ ...Fonts.FontMed, width: '100%', marginVertical: 12 }}>{`ﺗﺤﺪﻳﺪ اﻷيام `}</Text>}
        {types[1].selected && <TouchableOpacity onPress={() => setShowAvailability(true)} style={{ borderRadius: 100, maxWidth: 132, backgroundColor: '#E7E9EF', padding: 10, paddingHorizontal: 12, alignSelf: 'flex-end' }}>
          <Text style={{ ...Fonts.fontRegular, textAlign: 'center' }}>{`  اﻷﺳﻌﺎر العامة `}</Text>
        </TouchableOpacity>}
        <Text style={{ ...Fonts.FontMed, width: '100%', marginVertical: 12 }}>{`عدد القسم`}</Text>
        <Input placeholder={'عدد الأقسام  المتوفرة بهذه المواصفات  '} />
        <Text style={{ ...Fonts.FontMed, width: '100%', marginVertical: 12 }}>{`الصور`}</Text>
        {types[0].selected && <Input style={{ marginTop: 12 }} value={registration} upload clickable={() => setShowRegistration(true)} placeholder={'السجل التجاري)اختياري('} />}
        <Input style={{ marginTop: 12 }} value={license} upload clickable={() => setShowLicense(true)} placeholder={types[0].selected ? 'رخصة التشغيل)اختياري(' : ` إثبات ملكية النزل )اختياري(`} />
        <Input style={{ marginVertical: 12 }} value={photos} upload clickable={() => setShowImages(true)} placeholder={types[0].selected ? 'صور النزل)اختياري(' : `صور النزل`} />
        {renderFooterButton()}
      </View >
    )
  }

  return (
    <View style={styles.container}>
      <Header Add onPressBack={() => {
        initialState()
        navigate('Home')
      }} />
      <ScrollView contentContainerStyle={{}} style={{ flex: 1, width: '100%', paddingHorizontal: 24, }}>
        {/* <KeyboardAvoidingView style={{ flex: 1, width: '100%' }} */}
        {/* keyboardVerticalOffset={40} behavior={"position"}> */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingTop: 12, flexWrap: 'wrap', }}>
          {/* {renderSelection()} */}
          {types.map((i, index) => renderSelection(i, index))}
        </View>
        <Dropdown onChangeText={e => {
          const item = { ...payload }
          item.type_id = e.id
          setPayload(item)
        }} data={types[0].selected ? commercial_types : private_types} style={{ marginTop: 12, }} placeholder={`نوع النزل`} />
        <Input onChangeText={e => {
          const item = { ...payload }
          item.name = e
          setPayload(item)
        }} value={payload.name || null} style={{ marginVertical: 12 }} placeholder={`اسم النزل`} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginVertical: 6, }}>
          {/* <Input onChangeText={e => {
            const item = { ...payload }
            item.district = e
            setPayload(item)
          }} style={{ width: 140 }} placeholder={`الحي`} /> */}
          <Dropdown onChangeText={(e) => {
            const item = { ...payload }
            item.district_id = e.id
            setPayload(item)
          }} data={storedDistricts} style={{ width: 140 }} placeholder={`الحي`} />
          <Dropdown onChangeText={(e) => {
            const item = { ...payload }
            item.city_id = e.id
            setPayload(item)
          }} data={cities} style={{ width: 140 }} placeholder={`المدينة`} />
        </View>
        <Input value={location} clickable={() => setMap(true)} style={{ marginVertical: 12 }} placeholder={`الموقع على الخريطة `} />
        {renderDetails()}
        {renderDescription()}
        <View style={{ height: 400 }} />
        {/* </KeyboardAvoidingView> */}
      </ScrollView>
      {showCalendar && <CalendarComponent seasonal={seasonalPrice} setPrice={setSeasonalPrice} setDates={setSeasonalDates} key={'seasonal'} onClose={() => {
        setShowCalendar(false)
      }} isVisible={showCalendar} />}
      <CalendarComponent setPrice={setGeneralPrice} data={generalPrice} general={general} onClose={() => {
        setShowSeasonal(false)
      }} isVisible={showSeasonal} />
      <CalendarComponent setDates={setAvailabilityDates} data={availabilityDates} availabilities={true} key={'calendar'} onClose={() => {
        setShowAvailability(false)
      }} isVisible={showAvailability} />
      <ImageBrowser onClose={() => setShowRegistration(false)} photos={registration} setPhotos={setRegistration} key={`Commercial Registration`} isVisible={showRegistration} />
      <ImageBrowser onClose={() => setShowLicense(false)} photos={license} setPhotos={setLicense} key={'Operating License'} isVisible={showLicense} />
      <ImageBrowser photos={photos} requestPermission multiple onClose={() => setShowImages(false)} setPhotos={setSelectedPhotos} key={'Hostel Photos'} isVisible={showImages} />
      {showMap && <MapComponent initialValue={location} onPress={setLocation} onClose={() => setMap(false)} isVisible={showMap} />}
      {isFaciVisible && <FacilitiesSelectionComponent onClose={() => setFaciVisible(false)} data={facilities} setSelected={setSeelectedFac} setFinal={setFinalFac} isVisible={isFaciVisible} />}
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
