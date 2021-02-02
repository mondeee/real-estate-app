import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView, Alert
} from 'react-native';

import Modal from 'react-native-modal';

import Colors from '../styles/Colors';
import { SafeAreaView } from 'react-navigation';
import Fonts from '../styles/Fonts';
import Styles from '../styles/Styles';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Header from '../components/Header';
import { REGISTER } from '../services/graphql/queries'
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useStoreActions, useStoreState } from 'easy-peasy';
import Input from './Input';
import moment from 'moment';
import Button from './Button'

import DateRangePicker from './DateRangePicker'


import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { Toast } from 'native-base';
const XDate = require('xdate');

const WEEK_DAYS = [
  {
    value: null,
    label: `الأحد`,
    en: 'sunday',
  },
  {
    value: null,
    en: 'monday',
    label: `الأثنين`,
  },
  {
    value: null,
    en: 'tuesday',
    label: `الثلاثاء`
  },
  {
    value: null,
    en: 'wednesday',
    label: `الإربعاء`
  },
  {
    value: null,
    en: 'thursday',
    label: `الخميس`
  },
]

const WEEK_ENDS = [
  {
    value: null,
    en: 'friday',
    label: `الجمعة`
  },
  {
    value: null,
    en: 'saturday',
    label: `السبت`
  },
]

export default function CalendarComponent(props) {
  const {
    style,
    textStyle,
    onPress,
    child,
    text,
    availabilities,
    data,
    seasonal,
    general,
    isVisible,
    onClose,
    calendar,
  } = props

  const [showCalendar, setShowCalendar] = useState(calendar)
  const [toDate, setToDate] = useState(null)
  const [fromDate, setFromDate] = useState(null)
  const [addedPrice, setAddedPrice] = useState(0)
  const [fdate, setfDate] = useState(true)
  const [weekdaysData, setWeekDaysData] = useState(WEEK_DAYS)
  const [weekendData, setWeekendData] = useState(WEEK_ENDS)
  const [sPrices, setsPrices] = useState(seasonal)
  const [marked, setMarked] = useState({})
  const [tempMarked, setTempMarked] = useState({})
  const [final, setFinal] = useState(false)
  const [current_price, setCurrentPrice] = useState(0)
  const [availabilitiesData, setAvailabilitiesData] = useState(data)


  useEffect(() => {
    if (!isVisible && !calendar) setShowCalendar(false)
    if (!isVisible) setsPrices([])
    // if (availabilities) setMarked(tempMarked)
  }, [isVisible])

  useEffect(() => {
    console.log('2avail', availabilitiesData)
    if (availabilitiesData?.length > 0) {
      props.setDates(availabilitiesData)
    }
  }, [availabilitiesData])

  useEffect(() => {
    setShowCalendar(calendar)
    if (seasonal) {
      setsPrices(seasonal)
      initialMarkedDates(sPrices)
    }

    if (availabilities) {
      setfDate(true)
      setFinal(false)
      initialMarkedDates(data)
    }
    // console.log('@DATA', props.data)

  }, [])

  useEffect(() => {
    const weekend = [...weekendData]
    const weekdays = [...weekdaysData]
    if (general && props.data) {
      Object.keys(props.data).forEach(e => {
        // console.log('@LISTENER', e, props.data[e])
        weekend.forEach(wk => {
          if (wk.en == e) {
            console.log('weekendloop', wk, e)
            wk.value = String(props.data[e])
          }
        })

        weekdays.forEach(wk => {
          if (wk.en == e) {
            console.log(wk.en, e)
            wk.value = String(props.data[e])
          }
        })
      })

      setWeekDaysData(weekdays)
      setWeekendData(weekend)
      console.log(weekdays, weekend)
    }
  }, [general, props.data])

  useEffect(() => {
    console.log(fromDate, toDate)
    if (toDate || fromDate) {
      // const item = {}
      // item[toDate] = { selected: true, color: Colors.primaryBlue, textColor: 'white' }
      // item[fromDate] = { selected: true, color: Colors.primaryBlue, textColor: 'white' }
      // setMarked(item)
      setupMarkedDates(fromDate, toDate)
    }
  }, [toDate, fromDate])

  const initialMarkedDates = data => {
    if (!data) return
    let markedDates = {
      ...marked,
    }
    data.forEach((item, index) => {
      delete item.__typename
      const fromDate = item.from
      const toDate = item.to
      markedDates[fromDate] = { startingDay: true, endingDay: true, color: Colors.primaryYellow, textColor: 'white' }
      if (fromDate && toDate) {
        let mFromDate = new XDate(fromDate)
        let mToDate = new XDate(toDate)
        let range = mFromDate.diffDays(mToDate)
        if (range >= 0) {
          if (range == 0) {
            markedDates[toDate] = { startingDay: true, endingDay: true, color: Colors.primaryYellow, textColor: 'white' }
          } else {
            for (var i = 1; i <= range; i++) {
              let tempDate = mFromDate.addDays(1).toString('yyyy-MM-dd')
              if (i < range) {
                markedDates[tempDate] = { color: Colors.primaryYellow, textColor: 'white' }
              } else {
                markedDates[fromDate] = { startingDay: true, endingDay: false, color: Colors.primaryYellow, textColor: 'white' }
                markedDates[tempDate] = { endingDay: true, color: Colors.primaryYellow, textColor: 'white' }
              }
            }
          }
        }
      }
      console.log('@marked', markedDates)
      const finalMarked = {
        ...markedDates
      }
      setMarked(finalMarked)
      setTempMarked(finalMarked)
    })
  }

  const setupMarkedDates = (fromDate, toDate, update) => {
    let markedDates = {
      [fromDate]: { startingDay: true, endingDay: true, color: Colors.primaryYellow, textColor: 'white' }
    }

    if (fromDate && toDate) {
      let mFromDate = new XDate(fromDate)
      let mToDate = new XDate(toDate)
      let range = mFromDate.diffDays(mToDate)
      if (range >= 0) {
        if (range == 0) {
          markedDates[toDate] = { startingDay: true, endingDay: true, color: Colors.primaryYellow, textColor: 'white' }
        } else {
          for (var i = 1; i <= range; i++) {
            let tempDate = mFromDate.addDays(1).toString('yyyy-MM-dd')
            if (i < range) {
              markedDates[tempDate] = { color: Colors.primaryYellow, textColor: 'white' }
            } else {
              markedDates[fromDate] = { startingDay: true, endingDay: false, color: Colors.primaryYellow, textColor: 'white' }
              markedDates[tempDate] = { endingDay: true, color: Colors.primaryYellow, textColor: 'white' }
            }
          }
        }
      }
    }

    console.log('@marked', markedDates)
    const finalMarked = {
      ...marked,
      ...markedDates
    }
    setMarked(finalMarked)
    if (update) setTempMarked(finalMarked)
  }

  useEffect(() => {
    console.log('@SPRICES', sPrices)
    // setMarked(markedDates)
  }, [sPrices])

  const _onChangeInput = (value, index, type = 1) => {
    if (type == 1) {
      const data = [...weekdaysData]
      data[index].value = value
      setWeekDaysData(data)
    } else {
      const data = [...weekendData]
      data[index].value = value
      setWeekendData(data)
    }

    // console.log('onChange', weekdaysData, weekendData)
  }

  const finalizeMarker = () => {
    let markedDates = {
    }
    if (sPrices) {
      const items = [...sPrices]
      items.forEach(i => {
        let mFromDate = new XDate(i.from)
        let mToDate = new XDate(i.to)
        let range = mFromDate.diffDays(mToDate)
        console.log('@CONVERTED DATES', mFromDate, i.from)
        markedDates[i.from] = { startingDay: true, color: Colors.primaryYellow, textColor: 'white' }
        if (range >= 0) {
          if (range == 0) {
            markedDates[i.to] = { startingDay: true, endingDay: true, color: Colors.primaryYellow, textColor: 'white' }
          } else {
            for (var i = 1; i <= range; i++) {
              let tempDate = mFromDate.addDays(1).toString('yyyy-MM-dd')
              if (i < range) {
                markedDates[tempDate] = { color: Colors.primaryYellow, textColor: 'white' }
              } else {
                // markedDates[mFromDate] = { startingDay: true, endingDay: false, color: Colors.primaryYellow, textColor: 'white' }
                markedDates[tempDate] = { endingDay: true, color: Colors.primaryYellow, textColor: 'white' }
              }
            }
          }
        }
      })
    }
    console.log('@MARKED FINALIZE', markedDates)
    setMarked(markedDates)
  }

  const onFinalizeData = () => {

    if (seasonal) {
      console.log('@FINALPRICE', sPrices)
      props.setPrice(sPrices)
      onClose()
      return
    }
    // finalizeMarker()
    const data = {}
    let validate = true

    weekendData.forEach(i => {
      if (!i.value || i.value == 0) validate = false
      data[i.en] = i.value || "0"
    })

    weekdaysData.forEach(i => {
      if (!i.value || i.value == 0) validate = false
      data[i.en] = i.value || "0"
    })

    if (!general) {
      //ADD DATE
    }

    if (!validate) {
      console.log(weekendData, weekdaysData)
      Toast.show({
        text: `يرجى ادخال الاسعار العامة`,
        buttonText: 'OK',
        type: "danger",
        duration: 3000,
      })
      return
    }

    console.log('@pricedata', data)
    props.setPrice(data)
    setFinal(false)
    onClose()
  }

  // useEffect(() => {
  //   console.log('@values', weekdaysData, weekendData)
  // }, [weekendData, weekdaysData])


  const renderInput = (item, index, type) => {
    // if (props.data) {
    //   let value = props.data[item.en]
    //   return (
    //     <View key={index} style={{ alignSelf: 'flex-end', width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8, }}>
    //       <View />
    //       <TextInput value={value} onChangeText={(e) => _onChangeInput(e, index, type)} style={{ height: 33, width: 103, borderRadius: 25, borderWidth: 1, padding: 8, textAlign: 'right', borderColor: Colors.gray }} placeholder={`ر.س`} />
    //       <Text style={{ ...Fonts.fontLight, width: 50 }}>{item.label || 'text'}</Text>
    //       <View />
    //     </View>
    //   )
    // }

    return (
      <View key={index} style={{ alignSelf: 'flex-end', width: '80%', flexDirection: global.isAndroid ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8, }}>
        <View />
        <TextInput value={item.value} onChangeText={(e) => _onChangeInput(e, index, type)} style={{ height: 33, width: 103, borderRadius: 25, borderWidth: 1, padding: 8, textAlign: 'right', borderColor: Colors.gray }} placeholder={`ر.س`} />
        <Text style={{ ...Fonts.fontLight, width: 50 }}>{item.label || 'text'}</Text>
        <View />
      </View>
    )
  }

  const renderWeekDays = () => {
    return (
      <View style={{ marginBottom: 20, }}>
        <Text style={{ ...Fonts.fontRegular, fontSize: 18 }}>{`أيام الأسبوع`}</Text>
        {weekdaysData && weekdaysData.map((i, index) => renderInput(i, index, 1))}
      </View>
    )
  }

  const renderWeekEnds = () => {
    return (
      <View style={{ marginBottom: 20, }}>
        <Text style={{ ...Fonts.fontRegular, fontSize: 18 }}>{`أيام العطلة  الأسبوعية`}</Text>
        {weekendData && weekendData.map((i, index) => renderInput(i, index, 2))}
      </View>
    )
  }

  const renderDateSection = () => {
    return (
      <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
        <TouchableOpacity onPress={() => {
          // if (fdate) {
          setShowCalendar(true)
          setfDate(true)
          // } else {
          //   Toast.show({
          //     type: 'danger',
          //     text: 'Add From Date First'
          //   })
          // }
        }
        }>
          <Text style={{ ...Fonts.fontRegular, textAlign: 'center', }}>{`إلى`}</Text>
          <Text style={{ color: Colors.primaryBlue, padding: 2 }}>{toDate}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          setShowCalendar(true)
          setfDate(true)
        }
        }>
          <Text style={{ ...Fonts.fontRegular, textAlign: 'center', }}>{`من`}</Text>
          <Text style={{ color: Colors.primaryBlue, padding: 2 }}>{fromDate}</Text>
        </TouchableOpacity>
        <Text style={{ ...Fonts.FontMed, fontSize: 18, textAlign: 'center' }}>{`التاريخ`}</Text>
      </View>
    )
  }

  const renderMain = () => {
    // console.log('@GENERAL/MAIN', data)
    return (
      <Modal isVisible={isVisible} style={{ alignItems: 'flex-end' }}>
        <View style={{ width: '100%', height: '80%', alignSelf: 'flex-end', backgroundColor: 'white', borderRadius: 20, padding: 12, paddingHorizontal: 24, }}>
          <ScrollView>
            <Text style={{ ...Fonts.FontMed, textAlign: 'center', marginVertical: 12, fontSize: 19 }}>{`ﺗﺤﺪﻳﺪ اﻷﺳﻌﺎر العامة `}</Text>
            {/* DATE SECTION */}
            {!general && renderDateSection()}
            <View style={{ ...Styles.lineDividerHorizontal, marginVertical: 12 }} />
            {renderWeekDays()}
            {renderWeekEnds()}
            <TouchableOpacity onPress={() => onFinalizeData()} style={{ ...styles.button, ...style, alignSelf: 'center', marginTop: 24 }}>
              <Text style={{ ...styles.text, ...textStyle, fontSize: 18 }}>{`حفظ` || `Close`}</Text>
            </TouchableOpacity >
            <TouchableOpacity onPress={() => onClose()} style={{ position: 'absolute', top: 10, right: 10 }}>
              <MaterialIcons size={25} color={Colors.primaryBlue} name={'close'} />
            </TouchableOpacity >
          </ScrollView>
        </View>
      </Modal>
    )
  }

  const onSelectDate = () => {

  }

  const renderCalendar = () => {
    return (
      <Modal isVisible={isVisible} style={{ alignItems: 'flex-end' }}>
        <View style={{ width: '100%', alignSelf: 'flex-end', backgroundColor: 'white', borderRadius: 20, paddingTop: 40, justifyContent: 'space-between' }}>
          <Calendar
            // Collection of dates that have to be marked. Default = {}
            minDate={moment().format("YYYY-MM-DD")}
            onDayPress={(day) => {
              console.log('selected day', moment(day.dateString).format("YYYY-MM-DD"))
              const selectedDay = moment(day.dateString).format("YYYY-MM-DD")

              if (seasonal && !final) {
                if (marked[selectedDay]) {
                  Alert.alert('Error', 'هذا التاريخ غير متوفر')
                  return
                }
                if (fdate) {
                  // setToDate(moment(day.dateString).format("YYYY-MM-DD"))
                  setFromDate(selectedDay)
                  console.log('onselect today')
                  setfDate(false)
                } else {
                  console.log('onselect ffromday')
                  setToDate(selectedDay)
                  setFinal(true)
                  // setFromDate(selectedDay)
                }
              }

              if (!final) {
                if (fdate) {
                  // setToDate(selectedDay)
                  setFromDate(selectedDay)
                  console.log('onselect today')
                  setfDate(false)
                } else {
                  console.log('onselect ffromday')
                  setToDate(selectedDay)
                  setFinal(true)
                  // setFromDate(selectedDay)
                }
              }

              // setShowCalendar(false)
            }}
            markedDates={marked}
            markingType={'period'}
          />
          <View style={{ ...Styles.lineDividerHorizontal, marginVertical: 8 }} />
          <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24 }}>
            <TouchableOpacity onPress={() => {
              if (calendar) {
                onClose()
              }
              setFromDate(null)
              setToDate(null)
              setFinal(false)
              finalizeMarker()
              setShowCalendar(false)
            }} style={{ ...styles.button, alignSelf: 'center', marginBottom: 40 }}>
              <Text style={{ ...styles.text, ...textStyle, fontSize: 18, color: 'white' }}>{`إلغاء` || `Calendar`}</Text>
            </TouchableOpacity >
            <TouchableOpacity onPress={() => {
              if (calendar) onClose()
              setShowCalendar(false)
            }} style={{ ...styles.button, ...style, alignSelf: 'center', marginBottom: 40 }}>
              <Text style={{ ...styles.text, ...textStyle, fontSize: 18, color: 'white' }}>{`تحديد` || `Calendar`}</Text>
            </TouchableOpacity >
          </View>
        </View>
      </Modal>
    )
  }

  const renderSeasonal = () => {
    var sitem = {}
    return (
      <Modal isVisible={isVisible} style={{ alignItems: 'flex-end' }}>
        <View style={{ width: '100%', alignSelf: 'flex-end', backgroundColor: 'white', borderRadius: 20, padding: 12, paddingHorizontal: 24, }}>
          <ScrollView>
            <Text style={{ ...Fonts.FontMed, textAlign: 'center', marginVertical: 12, fontSize: 19 }}>{`تحديد اسعار ايام المواسم `}</Text>
            {renderDateSection()}
            <View style={{ ...Styles.lineDividerHorizontal, marginVertical: 12 }} />
            <View style={{ alignSelf: 'flex-end', width: '80%', flexDirection: global.isAndroid ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8, }}>
              <View />
              <TextInput value={String(current_price)} onChangeText={(e) => {
                // sitem.price = e
                setCurrentPrice(e)
              }} style={{ height: 33, width: 103, borderRadius: 25, borderWidth: 1, padding: 8, textAlign: 'right', borderColor: Colors.gray }} placeholder={`ر.س`} />
              <Text style={{ ...Fonts.fontLight, width: 50 }}>{`السعر`}</Text>
              <View />
            </View>
            {/* renderPrices */}
            <View style={{ minHeight: 100, marginTop: 12 }}>
              {sPrices && sPrices.map(i => {
                return (
                  <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', justifyContent: 'space-around', borderWidth: 1, borderColor: Colors.gray, padding: 4, paddingTop: 8, }}>
                    <Text style={{ ...Fonts.fontRegular, fontSize: 16 }}>{i.from}</Text>
                    <Text style={{ ...Fonts.fontRegular, fontSize: 16 }}>{i.to}</Text>
                    <Text style={{ ...Fonts.fontRegular, fontSize: 16 }}>{i.price}</Text>
                  </View>
                )
              })}
            </View>
            {sPrices?.length ==  0 && <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', justifyContent: 'center', width: '70%', alignSelf: 'center', marginBottom: 12 }}>
              <TouchableOpacity onPress={() => {
                if (!fromDate || !toDate) {
                  Toast.show({
                    text: 'يرجى إدخال التاريخ الصحيح.',
                    type: 'danger'
                  })
                  return
                }
                if (isNaN(current_price)) {
                  Toast.show({
                    text: 'الاسعار يجب ان تكون ارقام ولا تحتوي على حروف.',
                    type: 'danger'
                  })
                  return
                }
                if (current_price == 0) {
                  Toast.show({
                    text: 'الرجاء إضافة الأسعار العامة.',
                    type: 'danger'
                  })
                  return
                }
                var items = [...sPrices]
                sitem.from = fromDate
                sitem.to = toDate
                sitem.price = current_price
                items.push(sitem)
                console.log('@SESONAL', items)
                setsPrices(items)
                setFromDate(null)
                setCurrentPrice(0)
                setFinal(false)
                setToDate(null)
              }} style={{ ...styles.button, ...style, alignSelf: 'center', marginTop: 24 }}>
                <Text style={{ ...styles.text, ...textStyle, fontSize: 18 }}>{`إضافة`}</Text>
              </TouchableOpacity >
            </View>}
            {sPrices?.length > 0 && <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', justifyContent: 'space-between', width: '70%', alignSelf: 'center', marginBottom: 12 }}>
              <TouchableOpacity onPress={() => onFinalizeData()} style={{ ...styles.button, ...style, alignSelf: 'center', marginTop: 24 }}>
                <Text style={{ ...styles.text, ...textStyle, fontSize: 18 }}>{`حفظ` || `Close`}</Text>
              </TouchableOpacity >
              <TouchableOpacity onPress={() => {
                if (!fromDate || !toDate) {
                  Toast.show({
                    text: 'يرجى إدخال التاريخ الصحيح.',
                    type: 'danger'
                  })
                  return
                }
                if (isNaN(current_price)) {
                  Toast.show({
                    text: 'الاسعار يجب ان تكون ارقام ولا تحتوي على حروف.',
                    type: 'danger'
                  })
                  return
                }
                if (current_price == 0) {
                  Toast.show({
                    text: 'الرجاء إضافة الأسعار العامة.',
                    type: 'danger'
                  })
                  return
                }
                var items = [...sPrices]
                sitem.from = fromDate
                sitem.to = toDate
                sitem.price = current_price
                items.push(sitem)
                console.log('@SESONAL', items)
                setsPrices(items)
                setFromDate(null)
                setCurrentPrice(0)
                setFinal(false)
                setToDate(null)
              }} style={{ ...styles.button, ...style, alignSelf: 'center', marginTop: 24 }}>
                <Text style={{ ...styles.text, ...textStyle, fontSize: 18 }}>{`إضافة`}</Text>
              </TouchableOpacity >
            </View>}
            <TouchableOpacity onPress={() => onClose()} style={{ position: 'absolute', top: 10, right: 10 }}>
              <MaterialIcons size={25} color={Colors.primaryBlue} name={'close'} />
            </TouchableOpacity >
          </ScrollView>
        </View>
      </Modal>
    )
  }

  const onAddAvailabilities = () => {
    if (fromDate || toDate)
      Alert.alert(
        'يرجى التحقق من جميع البيانات?',
        !toDate ? `${fromDate} ` : `${fromDate} - ${toDate}`,
        [
          {
            text: "الغاء",
            onPress: () => {
              setMarked(tempMarked)
              setFromDate(null)
              setToDate(null)
              setFinal(false)
              setfDate(true)
            },
            style: "cancel"
          },
          {
            text: "تأكيد",
            onPress: () => {
              const arr = availabilitiesData ? [...availabilitiesData] : []
              const item = {
                to: toDate || fromDate,
                from: fromDate
              }
              arr.push(item)
              setAvailabilitiesData(arr)
              setTempMarked(marked)
              initAvailabilities()
            },
          },
        ],
        {
          cancelable: false
        }
      )
  }

  const onSubmitAvailabilities = () => {
    console.log(availabilitiesData)
    //finalizedata
    initAvailabilities()
    onClose()
  }

  const initAvailabilities = () => {
    // onClose()
    setFromDate(null)
    setToDate(null)
    setFinal(false)
    setfDate(true)
  }

  const renderAvailabilities = () => {
    return (
      <Modal isVisible={isVisible} style={{ alignItems: 'flex-end' }}>
        <View style={{ width: '100%', alignSelf: 'flex-end', backgroundColor: 'white', borderRadius: 20, paddingTop: 40, justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={() => {
              onClose()
              setFromDate(null)
              setToDate(null)
              setFinal(false)
              setfDate(true)
              setMarked(tempMarked)
              setShowCalendar(false)
            }}
            style={{ position: 'absolute', right: 10, top: 10 }}>
            <MaterialIcons color={'black'} size={20} name={'close'} />
          </TouchableOpacity>
          <Calendar
            // Collection of dates that have to be marked. Default = {}
            minDate={moment().format("YYYY-MM-DD")}
            onDayPress={(day) => {
              const selectedDay = moment(day.dateString).format("YYYY-MM-DD")
              if (!final) {
                if (fdate) {
                  if (marked[selectedDay]) {
                    Alert.alert('Error', 'هذا التاريخ غير متوفر')
                    return
                  }
                  setFromDate(selectedDay)
                  console.log('onselect today')
                  setfDate(false)
                } else {
                  if (marked[selectedDay] && selectedDay != fromDate) {
                    Alert.alert('Error', 'هذا التاريخ غير متوفر')
                    return
                  }
                  console.log('onselect ffromday')
                  setToDate(selectedDay)
                  setFinal(true)
                  setfDate(true)
                }
              }
            }}
            markedDates={marked}
            markingType={'period'}
          />
          <View style={{ ...Styles.lineDividerHorizontal, marginVertical: 8 }} />
          <View style={{ flexDirection: global.isAndroid ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24 }}>
            <TouchableOpacity onPress={() => {
              setFromDate(null)
              setToDate(null)
              setFinal(false)
              setfDate(true)
              setMarked(tempMarked)
            }} style={{ ...styles.button, alignSelf: 'center', marginBottom: 40 }}>
              <Text style={{ ...styles.text, ...textStyle, fontSize: 18, color: 'white' }}>{`إلغاء` || `Calendar`}</Text>
            </TouchableOpacity >
            <TouchableOpacity onPress={() => onSubmitAvailabilities()} style={{ ...styles.button, ...style, alignSelf: 'center', marginBottom: 40 }}>
              <Text style={{ ...styles.text, ...textStyle, fontSize: 18, color: 'white' }}>{`تحديد` || `Calendar`}</Text>
            </TouchableOpacity >
            <TouchableOpacity onPress={() => onAddAvailabilities()} style={{ ...styles.button, ...style, alignSelf: 'center', marginBottom: 40 }}>
              <Text style={{ ...styles.text, ...textStyle, fontSize: 18, color: 'white' }}>{`إضافة`}</Text>
            </TouchableOpacity >
          </View>
        </View>
      </Modal>
    )
  }

  const renderDateRange = () => {
    return (
      <Modal isVisible={isVisible} style={{ alignItems: "flex-end" }}>
        <View
          style={{
            width: "100%",
            height: "80%",
            alignSelf: "flex-end",
            backgroundColor: "white",
            borderRadius: 20,
            padding: 25,
            paddingHorizontal: 12,
            paddingTop: 50,
          }}
        >
          <TouchableOpacity
            onPress={() => onClose()}
            style={{
              position: "absolute",
              alignSelf: "flex-end",
              right: 10,
              top: 10,
            }}
          >
            <MaterialIcons
              size={30}
              color={Colors.primaryBlue}
              name={"chevron-right"}
            />
          </TouchableOpacity>
          {/* <View style={{ flexDirection: "row" }}>
            <Text style={{}}>{"CheckIn Date"}</Text>
            <Text
              style={{
                ...Fonts.FontMed,
                fontSize: 18,
                color: Colors.primaryYellow,
                marginHorizontal: 10,
              }}
            >
              1,500ر.س/ لليلة
            </Text>
            <Text>{"CheckOut Date"}</Text>
          </View> */}

          <DateRangePicker
            // initialRange={['2020-07-03', '2012-07-12']}
            onSuccess={(s, e) => {
              global.startday_reserv = s;
              global.endday_reserv = e;
              console.log(s + "||" + e);
            }}
            style={{ borderRadius: 15 }}
            theme={{ markColor: Colors.primaryYellow, markTextColor: "white" }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              borderBottomColor: Colors.gray,
              borderBottomWidth: 1,
            }}
          ></View>
          <Button
            text={'asdasdasd'}
            style={{
              width: 145,
              height: 40,
              alignSelf: "flex-end",
              marginTop: 30,
              paddingTop: 3,
            }}
            textStyle={{ marginTop: -5, color: Colors.white }}
            onPress={() => {
              console.log("Reservation");
              console.log(global.startday_reserv, global.endday_reserv);
              if (
                global.startday_reserv != null &&
                global.endday_reserv != null
              ) {
                onClose();
                // props.navigate("Booking");
              }
            }}
          ></Button>
        </View>
      </Modal>
    );
  };

  if (showCalendar || calendar) return renderCalendar()

  if (availabilities) return renderAvailabilities()

  if (seasonal != null) return renderSeasonal()

  return renderMain()
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    paddingHorizontal: 16,
    minWidth: 93,
    minHeight: 33,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryYellow,
  },
  text: {
    color: Colors.primaryBlue,
    textAlign: 'center',
    fontSize: 22
  }
})
