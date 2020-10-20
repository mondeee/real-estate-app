import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Platform,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';

import Header from '../components/Header'
import Colors from '../styles/Colors';
import Fonts from '../styles/Fonts'
import { getToken } from '../utils/functions'
import { SAMPLE_LIST } from '../constants/data'
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { IMAGE_URL } from '../services/api/url'
import gql from 'graphql-tag';
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';
import { SafeAreaView } from 'react-navigation';
import { GET_CITIES, GET_GENDER, GET_USER_DETAILS, GET_TYPE, GET_CATEGORIES, GET_ALL_PROPERTIES, GET_OWNED_PROPERTIES, SEND_NOTIF_TOKEN } from '../services/graphql/queries';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { Toast } from 'native-base';
import { ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import CalendarComponent from '../components/CalendarComponent';


export default function HomeScreen(props) {
  const { navigate, goBack, state: { params } } = props.navigation
  const [items, setItems] = useState([])
  const [firstLoading, setFirstLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(false)
  const storedUserState = useStoreState(state => state.auth.user)
  const notifToken = useStoreState(state => state.auth.usnotifTokener)
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
  const [page, setpage] = useState(1)
  const [firstRun, setFirstRun] = useState(true)
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

  const [addExpoToken, { error: tokenError, data: tokenData }] = useMutation(SEND_NOTIF_TOKEN, {
    variables: {
      input: {
        token: "asd"
      }
    }
  })

  const [fetchProperties, { loading: properyloading, error: properyError, data: propertiesdata, refetch }] = useLazyQuery(GET_OWNED_PROPERTIES, {
    variables: {
      page: page,
      first: 50,
    },
    onCompleted: e => {
      setLoading(false)
    }
  }
  )
  const [ownedProperties, {
    data: ownedPropertiesData,
    error: ownedPropertiesError
  }] = useLazyQuery(GET_OWNED_PROPERTIES)
  // const [fetchallOwnerProperties, { loading: properyloading, error: properyError, data: propertiesdata, refetch }] = useLazyQuery(GET_ALL_PROPERTIES)

  useEffect(() => {
    if (!mainPriceModal && availabilityModal) {
      setShowAvailability(true)
    }

    if (!mainPriceModal && generalPriceModal) {
      setShowGeneral(true)
    }

    if (!mainPriceModal && showSeasonalModal) {
      setShowCalendar(true)
    }

  }, [mainPriceModal, availabilityModal, generalPriceModal, showSeasonalModal])

  const updatePrices = () => {
    //LOGIC HERE
  }

  const updateAvailability = () => {
    //LOGIC HERE
  }

  useEffect(() => {
    if (!storedUserState) {
      // Toast.show({
      //   text: 'User is not Logged In, Unable to fetch Properties',
      //   type: 'danger'
      // })
      // setItems(null)
    }
  }, [storedUserState])

  useEffect(() => {
    console.log('properties', propertiesdata, properyError)
    if (propertiesdata) {
      // const filterdata = propertiesdata.allProperties.data.filter(i => i.owner.id == userdata.me.id)
      // setItems(filterdata.reverse())e
      setItems(propertiesdata.ownerProperties.data.reverse())
    }

    if (properyError) {
      Toast.show({
        text: 'User Token has Expired, Please Login again',
        type: 'danger'
      })
      deleteToken()
      // navigate('Login')
    }
    setLoading(false)

    // if (properyError) {
    //   Toast.show({
    //     text: 'User is not Logged In, Unable to fetch Properties',
    //     type: 'danger'
    //   })
    // }
    setFirstLoading(false)
    setFirstRun(false)
  }, [propertiesdata, properyError])

  if (loading || genderLoading) console.log('LOADING')
  if (error || genderError) console.log(`Error! ${error.message}`, `Error! ${genderError.message}`);

  useEffect(() => {
    // fetchallOwnerProperties()
    const { navigation } = props
    const token = getToken()
    if (!token) {
      console.log('@TOKEN', token)
      navigate('Login')
    }

    const navFocusListener = navigation.addListener('didFocus', () => {
      setLoading(true)
      if (storedUserState && !firstRun) {
        console.log('refetch')
        refetch()
      }
      setTimeout(() => {
        setLoading(false)
      }, 1500)
    });
  }, [])

  useEffect(() => {
    console.log('@TOKEN RESP\n', tokenError, '\n', tokenData)
  }, [tokenError, tokenData])

  useEffect(() => {
    console.log('@userdata', userdata, userError)
    if (userdata && userdata.me) {
      storeUser(userdata.me)
      if (!userdata.me.is_verified) {
        navigate('Register', { varify_user: true, phone: userdata.me.phone })
        return
      }
      fetchProperties()
      addExpoToken()
    }

    if (userError) {
      deleteToken()
    }
  }, [userdata, userError])

  const deleteToken = async () => {
    await AsyncStorage.removeItem('token')
    storeUser(null)
    navigate('Login')
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
    if (propertiesdata.paginatorInfohasMorePages) {
      setPage(page + 1)
    }
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
              <Text style={{ ...Fonts.fontRegular, textAlign: 'center' }}>{` اﻷﺳﻌﺎر العامة`}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              showmainPriceModal(false)
              setTimeout(() => {
                showAvailabilityModal(true)
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
          // if (item.sections && item.sections.length > 0) {
          //   // console.log('@section', item.sections)
          //   setSelected(item)
          //   setItems(item.sections)
          //   return
          // }
          // if (selected) {
          //   const newitem = { ...item }
          //   newitem.city = selected.city
          //   newitem.district = selected.district
          //   // console.log(newitem)
          //   navigate('PropertyDetails', { item: newitem, })
          //   return
          // }
          navigate('PropertyDetails', { item, })
        }}
      >
        <View style={{ flex: 1, padding: 12, }}>
          <Text style={{ ...Fonts.fontBold, fontSize: 18, width: '100%', textAlign: 'right' }}>{`${item.name}  `}<Text style={{ ...Fonts.fontRegular, color: "#979797", fontSize: 14 }}>{item.type.ar}</Text></Text>
          <View style={{ height: 1, width: '100%', backgroundColor: Colors.gray }} />
          <View style={{ flexDirection: 'row', padding: 12, width: '100%', justifyContent: "space-between" }}>
            <View />
            {item.category.id == 2 ?
              <TouchableOpacity
                onPress={() => {
                  setShowAvailability(true)
                }}
                style={{
                  padding: 8
                }}>
                <Text style={{ ...Fonts.fontRegular }}>{`الأوقات المتاحة `}<FontAwesome name={'calendar'} /></Text>
              </TouchableOpacity>
              :
              <TouchableOpacity
                onPress={() => navigate('SectionList', { items: item.sections.reverse(), item, })}
                style={{
                  padding: 8
                }}>
                <Text style={{ ...Fonts.fontRegular }}>{`الأقسام `}<FontAwesome name={'calendar'} /></Text>
              </TouchableOpacity>
            }
            {item.category.id == 2 ?
              <TouchableOpacity
                onPress={() => {
                  console.log(item.category)
                  if (item?.category.id == 2) {
                    console.log('ONPRESS SET DATA', item.general_price, item.availablities, seasonalPrice)
                    // return
                    setGeneralPrice(item?.general_price)
                    setAvailabilityDates(item?.availablities)
                    setSeasonalPrice(item?.seasonal_prices)
                    showmainPriceModal(true)
                  }
                }}
                style={{
                  padding: 8
                }}>
                <Text style={{ ...Fonts.fontRegular }}>{`الأسعار `}<FontAwesome name={'money'} /></Text>
              </TouchableOpacity> : null}
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
    if (loading || properyloading) {
      return (
        <View>
          <ActivityIndicator size={'large'} color={Colors.primaryBlue} style={{ marginTop: '20%' }} />
        </View>
      )
    }

    return (
      <TouchableOpacity style={{ ...styles.container, justifyContent: "center", marginTop: 50, }}>
        <Image style={{ height: 34, width: 34, marginBottom: 20 }} source={require('../../assets/additem.png')} />
        <Text style={styles.text}>{`لايوجد لديك اي نزل`}</Text>
        <Text style={styles.text}>{`أضفﺇنزلك الأن`}</Text>
      </TouchableOpacity>
    )
  }

  const renderList = () => <FlatList
    data={items}
    extraData={propertiesdata}
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
          if (storedUserState) {
            // fetchProperties()
            setLoading(true)
            refetch()
            setTimeout(() => {
              setLoading(false)
            }, 1500)
          }
        }}
        tintColor={Colors.primarBlue}
      />
    }
  />

  return (
    <SafeAreaView style={styles.container}>
      <Header onPressBack={() => {
        // setItems(propertiesdata.ownerProperties.properties.data.reverse())
        setSelected(false)
      }} style={{ paddingTop: 20 }} openDrawer={() => props.navigation.openDrawer()} search section={selected} />
      <View style={{ width: '100%', alignItems: 'center', height: '80%' }}>
        {renderUpdateModal()}
        <CalendarComponent setPrice={setGeneralPrice} data={generalPrice} general={true} key={'general'} onClose={() => {
          setShowGeneral(false)
          showGeneralPriceModal(false)
        }} isVisible={showGeneral} />
        <CalendarComponent setDates={setAvailabilityDates} data={availabilityDates} availabilities={true} key={'calendar'} onClose={() => {
          setShowAvailability(false)
          showAvailabilityModal(false)
        }} isVisible={showAvailability} />
        {showCalendar && <CalendarComponent seasonal={seasonalPrice} setPrice={setSeasonalPrice} setDates={setSeasonalDates} key={'seasonal'} onClose={() => {
          setShowSeasonalModal(false)
          setShowCalendar(false)
        }} isVisible={showCalendar} />}
        {firstLoading ? <ActivityIndicator size={'large'} color={Colors.primaryBlue} style={{ marginTop: '20%' }} /> : renderList()}
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
