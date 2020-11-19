import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import Colors from '../styles/Colors';
import { SafeAreaView } from 'react-navigation';
import Fonts from '../styles/Fonts';
import Styles from '../styles/Styles';
import Header from '../components/Header';
import { REGISTER, ADD_PRIVATE_PROPERY, ADD_COMMERCIAL_PROPERTY, onError, UPDATE_PRIVATE_PROPERTY, UPDATE_COMMERCIAL_PROPERTY } from '../services/graphql/queries'
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
import { ReactNativeFile } from 'apollo-upload-client'
import { getLocationName } from '../utils/functions';
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

export default function UpdatePropertyScreen(props) {
  const { navigate, goBack, state: { params } } = props.navigation
  const item = params.item
  const COMMERCAL = COMMERCIAL_DATA
  const PRIVATE = PRIVATE_DATA

  const [types, setTypes] = useState(TYPES)
  const [location, setLocation] = useState({
    latitude: item.latitude,
    longitude: item.longitude
  })
  const [initLoading, setInitLoading] = useState(true)
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
  const [payload, setPayload] = useState({
    property_id: item.id,
    city_id: item.city.id,
    type_id: item.type.id,
    name: item.name || '',
    description: item.description || '',
    district_id: item.district.id || '',
    contact_no: item.contact_no || '',
    contact_name: item.contact_name || ''
  })

  //FACI
  const [isFaciVisible, setFaciVisible] = useState(false)
  const [selectedFac, setSeelectedFac] = useState(null)
  const [finalFac, setFinalFac] = useState(null)
  const [facilities, setFacilities] = useState(COMMERCAL)
  //
  const [photos, setSelectedPhotos] = useState([])

  //CALENDARS
  const [general, setGeneral] = useState(true)
  const [generalPrice, setGeneralPrice] = useState(item.general_price)
  const [seasonalPrice, setSeasonalPrice] = useState([])
  const [seasonalDates, setSeasonalDates] = useState(null)
  const [availabilityDates, setAvailabilityDates] = useState(null)

  const categories = useStoreState(state => state.auth.categories)
  const commercial_types = useStoreState(state => state.auth.commercial_types)
  const private_types = useStoreState(state => state.auth.private_types)
  const cities = useStoreState(state => state.auth.cities)
  const storedDistricts = useStoreState(state => state.auth.districts)
  const [load, setLoaded] = useState(false)


  useEffect(() => {
    // _requestPermission()
    console.log('@@@ ITEM', item)
    setData()
  }, [])

  const setData = async () => {
    const items = [...categories]
    items.forEach(i => {
      i.selected = false
      if (i.id == String(item.category.id)) {
        i.selected = true
      }
    })
    // items[0].selected = true
    setTypes(items)
    const gprice = { ...generalPrice }
    if (gprice.__typename) {
      delete gprice.__typename
      setGeneralPrice(gprice)
    }
    const l = await getLocationName(location)
    setLocation(l)
    // const cits = [...cities]
    // cits.forEach(i => {
    //   i.selected = false
    //   if (i.id == String(item.city.id)) {
    //     i.selected(true)
    //   }
    // })

    //IMAGE CONVERSION
    // setSelectedPhotos(item.images)
    setInitLoading(false)
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
    setSeelectedFac(fitems)
    setFacilities(items)
  }

  useEffect(() => {
    // console.log('@SEASONAL', seasonalPrice)
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

  const [updatePrivateProperty, { data, error, loading }] = useMutation(UPDATE_PRIVATE_PROPERTY, {
    onCompleted: e => {
      console.log('@Complete UPDATE PRIVATE', e)
      Toast.show({
        text: 'تم اضافة القسم بنجاح',
        type: 'success'
      })
      navigate('Home', { refresh: true })
    }
  })
  const [updateCommercialProperty, { data: commercial_data, error: commercial_error, loading: commercial_loading }] = useMutation(UPDATE_COMMERCIAL_PROPERTY, {
    onCompleted: e => {
      console.log('@Complete ADD COMMERCIAL', commercial_data)
      Toast.show({
        text: 'تم اضافة النزل التجاري بنجاح',
        type: 'success'
      })
      navigate('Home', { refresh: true })
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
    //     text: 'يرجى رفع صورة اثبات الملكية او السجل التجاري',
    //     type: 'danger'
    //   })
    //   validate = false
    //   return validate
    // }

    if (!generalPrice) {
      console.log('Validate General Price')
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
    //     text: 'يرجي رفع صورة رخصة التشيل',
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
    //     text: 'يرجى رفع صورة اثبات الملكية او السجل التجاري',
    //     type: 'danger'
    //   })
    //   validate = false
    //   return validate
    // }

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

  const onUpdatePrivateProperty = async () => {
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
    data.proof_of_ownership = license && license.lengh > 0 ? license[0] : null
    data.images = photos && photos.length > 0 ? photos : []
    data.latitude = location.latitude
    data.longitude = location.longitude
    data.general_price = generalPrice
    delete data.general_price.__typename
    data.seasonal_prices = seasonalPrice
    data.availablities = availabilityDates
    const fpayload = {
      variables: {
        "input": data
      }
    }
    console.log('@FINALPAYLOAD', fpayload)
    updatePrivateProperty(fpayload).catch(e => {
      const relog = onError(e)
      if (relog) {
        // navigate('Login')
      }
    })
  }

  const onUpdateCommercial = () => {
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
    data.facilities = []
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
    updateCommercialProperty(fpayload).catch(e => {
      const relog = onError(e)
      if (relog) {
        // navigate('Login')
      }
    })
  }

  useEffect(() => {
    if (!!types || types.length > 0) {
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
      loadFaci()
      const item = types.filter(i => i.selected)
      const p = { ...payload }
      // p.category_id = item[0].id
      setPayload(p)
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
            textAlign: global.isAndroid ? 'left' : 'right',
            paddingTop: 4,
            paddingRight: global.isAndroid ? 0 : 8,
            paddingLeft: global.isAndroid ? 8 : 0,
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
        // console.log(payload, cTypes)
        // p.type_id = cTypes[index].id
        // setPayload(p)
        // setTypes(cTypes)
      }} style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <Text>{item.label || item.name}</Text>
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
          <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'center' }}>
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
        <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'center' }}>
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
        <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Text style={{ width: '100%', textAlign: global.isAndroid ? 'left' : 'right', ...Fonts.FontMed }}>{`المرافق`}</Text>
          <TouchableOpacity onPress={() => setFaciVisible(true)}>
            <Text style={{ ...Fonts.fontRegular, textAlign: 'center' }}>{`  Add + `}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
          {selectedFac && selectedFac.map((i, index) => renderFaci(i, index))}
        </View>
      </View>
    )
  }

  const renderFooterButton = () => {

    if (types[0].selected == true) {
      return (
        <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Button style={{ alignSelf: 'center', marginVertical: 12, }} onPress={() => {
            navigate('SectionList', { items: item.sections, item, update: true })
            // if (commercial_data) {
            //   // console.log(commercial_data.addCommercialPropety.property_id)
            //   navigate('AddSection', { id: commercial_data.addCommercialPropety.property_id })
            // } else {
            //   Toast.show({
            //     text: 'يرجى حفظ معلومات النزل قبل اضافة الاقسام',
            //     type: 'danger'
            //   })
            // }
          }} text={`ﺇإﺿﺎﻓﺔ ﻣﺮاﻓﻖ اﻟﻨﺰل`} />
          <View style={{ width: 30 }} />
          <Button onPress={() => {
            console.log('@facis', selectedFac)
            if (!commercial_data) {
              if (validateCommercial()) {
                onUpdateCommercial()
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
          onUpdatePrivateProperty()
        }
      }} style={{ alignSelf: 'center', width: 177, marginVertical: 12, }} text={`إضافة`} />
    )
  }

  const renderDescription = () => {
    return (
      <View>
        <Text style={{ ...Fonts.FontMed, width: '100%', marginVertical: 12 }}>{`الوصف و اﻟﻤﻤﻴﺰات`}</Text>
        <Input maxLength={600} onChangeText={e => {
          const i = { ...payload }
          i.description = e
          setPayload(i)
        }} style={{ height: 120 }} multiline value={payload.description} placeholder={'وصف'} />
        {/* {types[1].selected && <Input onChangeText={e => {
          const i = { ...payload }
          i.contact_name = e
          setPayload(i)
        }} style={{ marginVertical: 12 }} placeholder={'اسم المالك'} />} */}
        <Input value={payload.contact_no} onChangeText={e => {
          const i = { ...payload }
          i.contact_no = e
          setPayload(i)
        }} style={{ marginBottom: 12, marginTop: types[0].selected ? 12 : 0 }} placeholder={'رقم التواصل'} />
        {types[1].selected && <Text style={{ ...Fonts.FontMed, width: '100%', marginVertical: 12 }}>{`ﺗﺤﺪﻳﺪ اﻷﺳﻌﺎر `}</Text>}
        {types[1].selected && <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
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
        {/* <Text style={{ ...Fonts.FontMed, width: '100%', marginVertical: 12 }}>{`عدد القسم`}</Text>
        <Input placeholder={'عدد الأقسام  المتوفرة بهذه المواصفات  '} /> */}
        <Text style={{ ...Fonts.FontMed, width: '100%', marginVertical: 12 }}>{`الصور`}</Text>
        {/* {types[0].selected && <Input style={{ marginTop: 12 }} value={registration} upload clickable={() => setShowRegistration(true)} placeholder={'السجل التجاري)اختياري('} />}
        <Input style={{ marginTop: 12 }} value={license} upload clickable={() => setShowLicense(true)} placeholder={types[0].selected ? 'رخصة التشغيل)اختياري(' : ` إثبات ملكية النزل )اختياري(`} /> */}
        <Input style={{ marginVertical: 12 }} value={photos.concat(item.images)} upload clickable={() => setShowImages(true)} placeholder={types[0].selected ? 'صور النزل)اختياري(' : `صور النزل`} />
        {renderFooterButton()}
      </View >
    )
  }

  // if (initLoading) {
  //   return (
  //     <View style={styles.container}>
  //       <Header Add onPressBack={() => goBack()} />
  //       <View style={{ marginTop: '20%' }}>
  //         <ActivityIndicator size={'large'} color={Colors.primaryBlue} />
  //       </View>
  //     </View >
  //   )
  // }

  return (
    <View style={styles.container}>
      <Header Add onPressBack={() => goBack()} />
      <ScrollView contentContainerStyle={{}} style={{ flex: 1, width: '100%', paddingHorizontal: 24, }}>
        {/* <KeyboardAvoidingView style={{ flex: 1, width: '100%' }} */}
        {/* keyboardVerticalOffset={40} behavior={"position"}> */}
        <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingTop: 12, flexWrap: 'wrap', }}>
          {!!types && types.map((i, index) => renderSelection(i, index))}
        </View>
        {/* <Dropdown onChangeText={e => {
          const item = { ...payload }
          item.type_id = e.id
          setPayload(item)
        }} data={types[0].selected ? commercial_types : private_types} style={{ marginTop: 12, }} placeholder={`نوع النزل`} /> */}
        <Input onChangeText={e => {
          const item = { ...payload }
          item.name = e
          setPayload(item)
        }} value={payload.name} style={{ marginVertical: 12 }} placeholder={`اسم النزل`} />
        <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', justifyContent: 'space-evenly', alignItems: 'center', marginVertical: 6, }}>
          {/* <Input value={payload.district} onChangeText={e => {
            const item = { ...payload }
            item.district = e
            setPayload(item)
          }} style={{ width: 140 }} placeholder={`الحي`} /> */}
          <Dropdown key={'districts'} value={item.district.ar} data={storedDistricts} onChangeText={(e) => {
            const item = { ...payload }
            item.district_id = e
            setPayload(item)
          }} data={cities} style={{ width: 140 }} placeholder={`الحي`} />
          <Dropdown key={'cities'} value={item.city.ar} onChangeText={(e) => {
            const item = { ...payload }
            item.city_id = e.id
            setPayload(item)
          }} data={cities} style={{ width: 140 }} placeholder={`المدينة`} />
        </View>
        <Input value={location} clickable={() => setMap(true)} style={{ marginVertical: 12 }} placeholder={`الموقع على الخريطة `} />
        {types[1].selected == true && renderDetails()}
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
      {/* <ImageBrowser onClose={() => setShowRegistration(false)} photos={registration} setPhotos={setRegistration} key={`Commercial Registration`} isVisible={showRegistration} />
      <ImageBrowser onClose={() => setShowLicense(false)} photos={license} setPhotos={setLicense} key={'Operating License'} isVisible={showLicense} /> */}
      <ImageBrowser photos={photos} requestPermission multiple onClose={() => setShowImages(false)} setPhotos={setSelectedPhotos} key={'Hostel Photos'} isVisible={showImages} />
      {showMap && <MapComponent initialValue={location} onPress={setLocation} onClose={() => setMap(false)} isVisible={showMap} />}
      {isFaciVisible && <FacilitiesSelectionComponent update onClose={() => setFaciVisible(false)} data={facilities} setSelected={setSeelectedFac} setFinal={setFinalFac} isVisible={isFaciVisible} />}
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
    marginLeft: global.isAndroid ? 0 : 8,
    marginRight: global.isAndroid ? 8 : 0,
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
