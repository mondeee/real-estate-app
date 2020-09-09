import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView
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


import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { Toast } from 'native-base';


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
    key,
    seasonal,
    general,
    isVisible,
    onClose,
    calendar,
  } = props

  const [showCalendar, setShowCalendar] = useState(calendar)
  const [toDate, setToDate] = useState(`2020-5-11`)
  const [fromDate, setFromDate] = useState(`2020-5-1`)
  const [addedPrice, setAddedPrice] = useState(0)
  const [fdate, setfDate] = useState(false)
  const [weekdaysData, setWeekDaysData] = useState(WEEK_DAYS)
  const [weekendData, setWeekendData] = useState(WEEK_ENDS)
  const [sPrices, setsPrices] = useState(seasonal)

  useEffect(() => {
    if (!isVisible && !calendar) setShowCalendar(false)
    if (!isVisible) setsPrices([])
  }, [isVisible])

  useEffect(() => {
    setShowCalendar(calendar)
    if (seasonal) {
      setsPrices(seasonal)
    }
  }, [])

  useEffect(() => {
    setfDate(false)
  }, [toDate, fromDate])

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
  }

  const onFinalizeData = () => {
    const data = {}

    weekendData.forEach(i => {
      data[i.en] = i.value || "0"
    })

    weekdaysData.forEach(i => {
      data[i.en] = i.value || "0"
    })

    if (!general) {
      //ADD DATE
    }

    if (seasonal) {
      console.log('@FINALPRICE', sPrices)
      props.setPrice(sPrices)
      onClose()
      return
    }

    console.log('@pricedata', data)
    props.setPrice(data)
    onClose()
  }

  // useEffect(() => {
  //   console.log('@values', weekdaysData, weekendData)
  // }, [weekendData, weekdaysData])


  const renderInput = (item, index, type) => {
    return (
      <View key={index} style={{ alignSelf: 'flex-end', width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8, }}>
        <View />
        <TextInput onChangeText={(e) => _onChangeInput(e, index, type)} style={{ height: 33, width: 103, borderRadius: 25, borderWidth: 1, padding: 8, textAlign: 'right', borderColor: Colors.gray }} placeholder={`ر.س`} />
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
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
        <TouchableOpacity onPress={() => {
          setShowCalendar(true)
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
    return (
      <Modal isVisible={isVisible} style={{ alignItems: 'flex-end' }}>
        <View style={{ width: '100%', height: '80%', alignSelf: 'flex-end', backgroundColor: 'white', borderRadius: 20, padding: 12, paddingHorizontal: 24, }}>
          <ScrollView>
            <Text style={{ ...Fonts.FontMed, textAlign: 'center', marginVertical: 12, fontSize: 19 }}>{`ﺗﺤﺪaﻳﺪ أﺳﻌﺎر أيام المواسم `}</Text>
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
            onDayPress={(day) => {
              console.log('selected day', moment(day.dateString).format("YYYY-MM-DD"))
              if (seasonal) {
                if (fdate) {
                  setFromDate(moment(day.dateString).format("YYYY-MM-DD"))
                } else {
                  setToDate(moment(day.dateString).format("YYYY-MM-DD"))
                }
              }
              // setShowCalendar(false)
            }}
            markedDates={{
              '2020-06-20': { textColor: Colors.primaryBlue },
              '2020-06-22': { startingDay: true, color: Colors.primaryBlue, textColor: 'white' },
              '2020-06-23': { selected: true, endingDay: true, color: Colors.primaryBlue, textColor: 'white' },
              '2020-06-04': { disabled: true, startingDay: true, color: Colors.primaryBlue, endingDay: true }
            }}
            markingType={'period'}
          />
          <View style={{ ...Styles.lineDividerHorizontal, marginVertical: 8 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24 }}>
            <TouchableOpacity onPress={() => {
              if (calendar) onClose()
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
            <Text style={{ ...Fonts.FontMed, textAlign: 'center', marginVertical: 12, fontSize: 19 }}>{`ﺗﺤﺪaﻳﺪ أﺳﻌﺎر أيام المواسم `}</Text>
            {renderDateSection()}
            <View style={{ ...Styles.lineDividerHorizontal, marginVertical: 12 }} />
            <View style={{ alignSelf: 'flex-end', width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8, }}>
              <View />
              <TextInput value={sitem.price || 0} onChangeText={(e) => {
                sitem.price = e
              }} style={{ height: 33, width: 103, borderRadius: 25, borderWidth: 1, padding: 8, textAlign: 'right', borderColor: Colors.gray }} placeholder={`ر.س`} />
              <Text style={{ ...Fonts.fontLight, width: 50 }}>{`Price`}</Text>
              <View />
            </View>
            {/* renderPrices */}
            <View style={{ minHeight: 100, marginTop: 12 }}>
              {sPrices && sPrices.map(i => {
                return (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around', borderWidth: 1, borderColor: Colors.gray, padding: 4, paddingTop: 8, }}>
                    <Text style={{ ...Fonts.fontRegular, fontSize: 16 }}>{i.from}</Text>
                    <Text style={{ ...Fonts.fontRegular, fontSize: 16 }}>{i.to}</Text>
                    <Text style={{ ...Fonts.fontRegular, fontSize: 16 }}>{i.price}</Text>
                  </View>
                )
              })}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '70%', alignSelf: 'center', marginBottom: 12 }}>
              <TouchableOpacity onPress={() => onFinalizeData()} style={{ ...styles.button, ...style, alignSelf: 'center', marginTop: 24 }}>
                <Text style={{ ...styles.text, ...textStyle, fontSize: 18 }}>{`حفظ` || `Close`}</Text>
              </TouchableOpacity >
              <TouchableOpacity onPress={() => {
                if (!sitem.price || sitem.price == 0) {
                  Toast.show({
                    text: 'Please add price',
                    type: 'danger'
                  })
                  return
                }
                var items = [...sPrices]
                sitem.from = fromDate
                sitem.to = toDate
                items.push(sitem)
                console.log('@SESONAL', items)
                setsPrices(items)
              }} style={{ ...styles.button, ...style, alignSelf: 'center', marginTop: 24 }}>
                <Text style={{ ...styles.text, ...textStyle, fontSize: 18 }}>{`Add`}</Text>
              </TouchableOpacity >
            </View>
            <TouchableOpacity onPress={() => onClose()} style={{ position: 'absolute', top: 10, right: 10 }}>
              <MaterialIcons size={25} color={Colors.primaryBlue} name={'close'} />
            </TouchableOpacity >
          </ScrollView>
        </View>
      </Modal>
    )
  }

  if (showCalendar || calendar) return renderCalendar()

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
