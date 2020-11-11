import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Platform,
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
} from 'react-native';

import Header from '../components/Header'
import Colors from '../styles/Colors';
import Fonts from '../styles/Fonts'
import { getToken } from '../utils/functions'
import { SAMPLE_LIST } from '../constants/data'
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { IMAGE_URL } from '../services/api/url'
import gql from 'graphql-tag';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { SafeAreaView } from 'react-navigation';
import { GET_CITIES, GET_GENDER, GET_USER_DETAILS, GET_TYPE, GET_CATEGORIES, GET_ALL_PROPERTIES, GET_SECTIONS } from '../services/graphql/queries';
import { useStoreActions } from 'easy-peasy';
import Button from '../components/Button';
import CalendarComponent from '../components/CalendarComponent';
import Modal from 'react-native-modal'


export default function SectionListScreen(props) {
  const { navigate, goBack, state: { params } } = props.navigation
  const [items, setItems] = useState(params.items ? params.items.reverse() : [])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(false)
  const storeCity = useStoreActions(actions => actions.auth.setCities)
  const storeGender = useStoreActions(actions => actions.auth.setGenders)
  const storeUser = useStoreActions(actions => actions.auth.setUser)
  const storeCat = useStoreActions(actions => actions.auth.setCategories)
  const storeType_ = useStoreActions(actions => actions.auth.setCommercialTypes)
  const storeType__ = useStoreActions(actions => actions.auth.setPivateTypes)
  const { loading: cityloading, error, data } = useQuery(GET_CITIES)
  const { loading: genderLoading, error: genderError, data: genderData } = useQuery(GET_GENDER)
  const { data: userdata, error: userError } = useQuery(GET_USER_DETAILS)
  const { data: commercialTypes } = useQuery(GET_TYPE(1))
  const { data: privateTypes } = useQuery(GET_TYPE(2))
  const { data: dataCat } = useQuery(GET_CATEGORIES)

  const [mainPriceModal, showmainPriceModal] = useState(false)
  const [generalPriceModal, showGeneralPriceModal] = useState(false)
  const [availabilityModal, showAvailabilityModal] = useState(false)
  const [availabilityDates, setAvailabilityDates] = useState([])
  const [generalPrice, setGeneralPrice] = useState(null)
  const [showGeneral, setShowGeneral] = useState(false)
  const [showAvailability, setShowAvailability] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [seasonalPrice, setSeasonalPrice] = useState([])
  const [showSeasonalModal, setShowSeasonalModal] = useState(false)
  const [seasonalDates, setSeasonalDates] = useState(null)


  const [allSection, { loading: properyloading, error: properyError, data: propertiesdata, refetch }] = useLazyQuery(GET_SECTIONS, {
    variables: {
      page: 1,
      property_id: params.item.id,
    }
  })
  // const [fetchAllProperties, { loading: properyloading, error: properyError, data: propertiesdata, refetch }] = useLazyQuery(GET_ALL_PROPERTIES)

  useEffect(() => {
    setLoading(false)
    console.log('properties', propertiesdata, properyError, properyloading)
    if (propertiesdata) {
      setItems(propertiesdata.allSection.data.reverse())
    }
  }, [propertiesdata, properyError, properyloading])

  if (loading || genderLoading) console.log('LOADING')
  if (error || genderError) console.log(`Error! ${error.message}`, `Error! ${genderError.message}`);

  useEffect(() => {
    // fetchAllProperties()
    allSection()
    const { navigation } = props
    const navFocusListener = navigation.addListener('didFocus', () => {
      // API_CALL();
      // fetchAllProperties()
      if (propertiesdata) {
        setLoading(true)
        refetch()
      }
    });

    // return () => {
    //   navFocusListener.remove();
    // };
  }, [])

  useEffect(() => {
    // console.log('@userdata', userdata, userError)
    if (userdata && userdata.me) {
      storeUser(userdata.me)
      if (!userdata.me.is_verified) {
        navigate('Register', { varify_user: true, phone: userdata.me.phone })
        return
      }
    }

    if (userError) {
      deleteToken()
    }
  }, [userdata, userError])

  useEffect(() => {
    // console.log('@items')
  }, [items])

  const deleteToken = async () => {
    await AsyncStorage.removeItem('token')
  }

  useEffect(() => {

    if (dataCat && dataCat.allCategories) {
      const items = dataCat.allCategories
      items.forEach(i => {
        i.key = i.id
        i.label = i.ar
      })
      storeCat(items)
    }

    if (commercialTypes && commercialTypes.allTypes) {
      const items = commercialTypes.allTypes
      items.forEach(i => {
        i.key = i.id
        i.label = i.ar
      })
      storeType_(items)
    }

    if (privateTypes && privateTypes.allTypes) {
      const items = privateTypes.allTypes
      items.forEach(i => {
        i.key = i.id
        i.label = i.ar
      })
      storeType__(items)
    }

  }, [dataCat, privateTypes, commercialTypes])

  useEffect(() => {
    if (data && data.allCities) {
      const items = data.allCities
      items.forEach(i => {
        i.key = i.id
        i.label = i.ar
      })
      storeCity(items)
    }
    if (genderData && genderData.allGenders) {
      const items = genderData.allGenders
      items.forEach(i => {
        i.key = i.id
        i.label = i.ar
      })
      storeGender(items)
    }
  }, [data, genderData])

  const fetchNext = () => {

  }

  const renderUpdateModal = () => {

    return (
      <Modal isVisible={mainPriceModal}>
        <View style={{ height: 200, backgroundColor: 'white', borderRadius: 30, }}>
          <TouchableOpacity onPress={() => showmainPriceModal(false)} style={{ marginBottom: 4, alignSelf: 'flex-end', padding: 8 }}>
            <MaterialIcons size={25} color={Colors.primaryBlue} name={'close'} />
          </TouchableOpacity >
          <View style={{ alignSelf: 'center', width: '50%' }}>
            <Text style={{ ...Fonts.fontRegular, textAlign: 'center' }}>
              ﺗﺤﺪﻳﺪ اﻷﺳﻌﺎر
          </Text>
            <TouchableOpacity onPress={() => {
              showmainPriceModal(false)
              setTimeout(() => {
                setShowSeasonalModal(true)
              }, 500)
            }
            } style={{ backgroundColor: Colors.gray, padding: 12, borderRadius: 30, margin: 8, marginTop: 16, }}>
              <Text style={{ ...Fonts.fontRegular, textAlign: 'center' }}>{` أيام ا لمواسم`}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              showmainPriceModal(false)
              setTimeout(() => {
                setShowGeneral(true)
                showGeneralPriceModal(true)
              }, 500)
            }
            } style={{ backgroundColor: Colors.gray, padding: 12, borderRadius: 30, margin: 8 }}>
              <Text style={{ ...Fonts.fontRegular, textAlign: 'center' }}>{` اﻷﺳﻌﺎر العامة`}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }

  const renderItem = (item, index) => {
    console.log('@item', item)
    return (
      <TouchableOpacity key={item.id} style={{
        height: 125,
        marginVertical: 8,
        width: '98%',
        borderRadius: 11,
        alignSelf: 'center',
        backgroundColor: 'white',
        shadowOffset: { height: 3, width: -2, },
        shadowColor: 'black',
        shadowOpacity: 0.1,
        flexDirection: 'row',
        elevation: 3,
      }}
        onPress={() => {
          const newitem = { ...item }
          newitem.city = params.item.city
          newitem.district = params.item.district
          if (params.update) {
            navigate('UpdateSection', { item: newitem, refresh: () => refetch() })
            return
          }
          navigate('SectionDetails', { item: newitem, })
          return
        }}
      >
        <View style={{ flex: 1, padding: 12, }}>
          <Text style={{ ...Fonts.fontBold, fontSize: 18, width: '100%', textAlign: 'right' }}>{`${item.name}  `}</Text>
          <View style={{ height: 1, width: '100%', backgroundColor: Colors.gray }} />
          <View style={{ flexDirection: 'row', padding: 12, width: '100%', justifyContent: "space-between" }}>
            <TouchableOpacity
              onPress={() => {
                setShowAvailability(true)
              }}
            >
              <Text style={{ ...Fonts.fontRegular }}>{`الأوقات المتاحة `}<FontAwesome name={'calendar'} /></Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              console.log('ONPRESS SET DATA', item.general_price, item.availablities, seasonalPrice)
              // return
              setGeneralPrice(item?.general_price)
              setAvailabilityDates(item?.availablities)
              setSeasonalPrice(item?.seasonal_prices)
              showmainPriceModal(true)
            }}>
              {item.general_price && < Text style={{ ...Fonts.fontRegular }}>{`الأسعار`}<FontAwesome name={'money'} /></Text>}
            </TouchableOpacity>
          </View>
        </View>
        {
          item.images && item.images.length > 0 ?
            <Image
              style={{ alignSelf: 'flex-end', height: '100%', width: '30%' }}
              source={{ uri: IMAGE_URL + item.images[0].avatar }}
            />
            :
            <Image
              style={{ alignSelf: 'flex-end', height: '100%', width: '30%' }}
              source={require('../../assets/itemimage.png')}
            />
        }
      </TouchableOpacity >
    )
  }

  const renderEmpty = () => {
    return (
      <TouchableOpacity style={{ ...styles.container, justifyContent: "center", marginTop: 50, }}>
        <Image style={{ height: 34, width: 34, marginBottom: 20 }} source={require('../../assets/additem.png')} />
        <Text style={styles.text}>{`ﻻ ﻳﻮجد ﻟﺪﻳﻚ نزل بع`}</Text>
        <Text style={styles.text}>{`أضف نزلك الان`}</Text>
      </TouchableOpacity>
    )
  }

  const renderList = () => <FlatList
    data={items}
    extraData={items}
    contentContainerStyle={{ padding: 12, justifyContent: 'center', paddingVertical: Platform.OS === 'ios' ? '5%' : '5%' }}
    style={{ width: '100%', alignContent: 'center', alignSelf: 'center' }}
    keyExtractor={item => `${item.id}${item.name}`}
    renderItem={({ item }) => renderItem(item)}
    ListEmptyComponent={() => renderEmpty()}
    onEndReached={() => fetchNext()}
    onEndReachedThreshold={0.5}
    initialNumToRender={20}
    refreshControl={
      <RefreshControl
        refreshing={loading}
        onRefresh={() => {
          refetch()
        }}
        tintColor={Colors.primarBlue}
      />
    }
  />

  return (
    <SafeAreaView style={styles.container}>
      <Header onPressBack={() => {
        goBack()
      }} style={{ paddingTop: 20 }} openDrawer={() => props.navigation.openDrawer()} search section={params.item} />
      <View style={{ width: '100%', alignItems: 'center', height: '80%' }}>
        {renderUpdateModal()}
        <CalendarComponent setPrice={setGeneralPrice} data={generalPrice} general={true} key={'general'} onClose={() => {
          setShowGeneral(false)
          showGeneralPriceModal(false)
        }} isVisible={showGeneral} />
        <CalendarComponent setDates={setAvailabilityDates} data={availabilityDates} availabilities={true} key={'calendar'} onClose={() => {
          setShowAvailability(false)
          setShowAvailability(false)
        }} isVisible={showAvailability} />
        {showSeasonalModal && <CalendarComponent seasonal={seasonalPrice} setPrice={setSeasonalPrice} setDates={setSeasonalDates} key={'seasonal'} onClose={() => {
          setShowSeasonalModal(false)
          setShowCalendar(false)
        }} isVisible={showSeasonalModal} />}
        {renderList()}
        {params.update && <Button
          text={`ﺇإﺿﺎﻓﺔ ﻣﺮاﻓﻖ اﻟﻨﺰل`}
          style={{ position: 'absolute', bottom: 100, height: 40 }}
          onPress={() => {
            navigate('UpdateAndAddSection', { id: params.item.id, refresh: () => refetch() })
          }}
        />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  text: {
    ...Fonts.fontRegular,
    fontSize: 20,
  }
});
