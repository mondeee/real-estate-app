import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Platform,
  Text,
  View,
  AsyncStorage
} from 'react-native';

import Header from '../components/Header'
import Colors from '../styles/Colors';
import Fonts from '../styles/Fonts'
import { getToken } from '../utils/functions'
import { SAMPLE_LIST } from '../constants/data'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { IMAGE_URL } from '../services/api/url'
import gql from 'graphql-tag';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { SafeAreaView } from 'react-navigation';
import { GET_CITIES, GET_GENDER, GET_USER_DETAILS, GET_TYPE, GET_CATEGORIES, GET_ALL_PROPERTIES } from '../services/graphql/queries';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { Toast } from 'native-base';


export default function HomeScreen(props) {
  const { navigate, goBack } = props.navigation
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(false)
  const storedUserState = useStoreState(state => state.auth.user)
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


  const [fetchProperties, { loading: properyloading, error: properyError, data: propertiesdata, refetch }] = useLazyQuery(GET_ALL_PROPERTIES, {
    variables: {
      page: page,
      first: 30,
      userId: userdata ? userdata.me.id : null
    }
  }
  )
  // const [fetchAllProperties, { loading: properyloading, error: properyError, data: propertiesdata, refetch }] = useLazyQuery(GET_ALL_PROPERTIES)

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
    console.log('properties', propertiesdata)
    if (propertiesdata) {
      setItems(propertiesdata.allProperties.data.reverse())
    }
    setLoading(false)

    // if (properyError) {
    //   Toast.show({
    //     text: 'User is not Logged In, Unable to fetch Properties',
    //     type: 'danger'
    //   })
    // }
  }, [propertiesdata, properyError, properyloading])

  if (loading || genderLoading) console.log('LOADING')
  if (error || genderError) console.log(`Error! ${error.message}`, `Error! ${genderError.message}`);

  useEffect(() => {
    // fetchAllProperties()
    const { navigation } = props
    const navFocusListener = navigation.addListener('didFocus', () => {
      // API_CALL();
      // fetchAllProperties()
      if (storedUserState) {
        // refetch()
        // fetchProperties()
      }
      console.log('hooooks');
    });

    return () => {
      navFocusListener.remove();
    };
  }, [])

  useEffect(() => {
    console.log('@userdata', userdata, userError)
    if (userdata && userdata.me) {
      storeUser(userdata.me)
      if (!userdata.me.is_verified) {
        navigate('Register', { varify_user: true, phone: userdata.me.phone })
        return
      }
      fetchProperties()
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
    storeUser(null)
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

  renderItem = (item, index) => {
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
            <View/>
            {/* <Text style={{ ...Fonts.fontRegular }}>{`Date `}<FontAwesome name={'calendar'} /></Text> */}
            <Text style={{ ...Fonts.fontRegular }}>{`${item.price_average} `}<FontAwesome name={'money'} /></Text>
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

  renderEmpty = () => {
    return (
      <TouchableOpacity style={{ ...styles.container, justifyContent: "center", marginTop: 50, }}>
        <Image style={{ height: 34, width: 34, marginBottom: 20 }} source={require('../../assets/additem.png')} />
        <Text style={styles.text}>{`ﻻ ﻳﻮجدﺩﻟﺪﻳﻚ نزل بعد `}</Text>
        <Text style={styles.text}>{`أضفﺇنزلك الأن`}</Text>
      </TouchableOpacity>
    )
  }

  renderList = () => <FlatList
    data={items}
    extraData={items}
    contentContainerStyle={{ padding: 12, justifyContent: 'center', paddingVertical: Platform.OS === 'ios' ? '20%' : '30%' }}
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
            refetch()
          }
        }}
        tintColor={Colors.primarBlue}
      />
    }
  />

  return (
    <SafeAreaView style={styles.container}>
      <Header onPressBack={() => {
        setItems(propertiesdata.allProperties.data.reverse())
        setSelected(false)
      }} style={{ paddingTop: 20 }} openDrawer={() => props.navigation.openDrawer()} search section={selected} />
      <View style={{ width: '100%', alignItems: 'center', height: '80%' }}>
        {renderList()}
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
