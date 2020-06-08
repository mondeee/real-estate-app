import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native';

import Modal from 'react-native-modal';

import Colors from '../styles/Colors';
import { SafeAreaView } from 'react-navigation';
import Fonts from '../styles/Fonts';
import Styles from '../styles/Styles';
import Header from '../components/Header';
import { REGISTER } from '../services/graphql/queries'
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useStoreActions, useStoreState } from 'easy-peasy';
import Input from './Input';


import { Calendar, CalendarList, Agenda } from 'react-native-calendars';


const WEEK_DAYS = [
  {
    value: null,
    label: `الأحد`
  },
  {
    value: null,
    label: `الأثنين`
  },
  {
    value: null,
    label: `الثلاثاء`
  },
  {
    value: null,
    label: `الإربعاء`
  },
  {
    value: null,
    label: `الخميس`
  },
]

const WEEK_ENDS = [
  {
    value: null,
    label: `الجمعة`
  },
  {
    value: null,
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
    general,
    isVisible,
    onClose,
  } = props

  const [showCalendar, setShowCalendar] = useState(false)
  const [toDate, setToDate] = useState(`2020/5/11`)
  const [fromDate, setFromDate] = useState(`2020/5/1`)
  const [weekdaysData, setWeekDaysData] = useState(WEEK_DAYS)
  const [weekendData, setWeekendData] = useState(WEEK_ENDS)

  useEffect(() => {
    if (!isVisible) setShowCalendar(false)
  }, [isVisible])


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
        <TouchableOpacity onPress={() => setShowCalendar(true)}>
          <Text style={{ ...Fonts.fontRegular, textAlign: 'center', }}>{`إلى`}</Text>
          <Text style={{ color: Colors.primaryBlue, padding: 2 }}>{toDate}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowCalendar(true)}>
          <Text style={{ ...Fonts.fontRegular, textAlign: 'center', }}>{`من`}</Text>
          <Text style={{ color: Colors.primaryBlue, padding: 2 }}>{toDate}</Text>
        </TouchableOpacity>
        <Text style={{ ...Fonts.FontMed, fontSize: 18, textAlign: 'center' }}>{`التاريخ`}</Text>
      </View>
    )
  }

  const renderMain = () => {
    return (
      <Modal isVisible={isVisible} style={{ alignItems: 'flex-end' }}>
        <View style={{ width: '100%', height: '80%', alignSelf: 'flex-end', backgroundColor: 'white', borderRadius: 20, padding: 12, paddingHorizontal: 24, }}>
          <Text style={{ ...Fonts.FontMed, textAlign: 'center', marginVertical: 12, fontSize: 19 }}>{`ﺗﺤﺪaﻳﺪ أﺳﻌﺎر أيام المواسم `}</Text>
          {/* DATE SECTION */}
          {!general && renderDateSection()}
          <View style={{ ...Styles.lineDividerHorizontal, marginVertical: 12 }} />
          {renderWeekDays()}
          {renderWeekEnds()}
          <TouchableOpacity onPress={() => onClose()} style={{ ...styles.button, ...style, alignSelf: 'center', marginTop: 24 }}>
            <Text style={{ ...styles.text, ...textStyle, fontSize: 18 }}>{`حفظ` || `Close`}</Text>
          </TouchableOpacity >
        </View>
      </Modal>
    )
  }

  const renderCalendar = () => {
    return (
      <Modal isVisible={isVisible} style={{ alignItems: 'flex-end' }}>
        <View style={{ width: '100%', height: '80%', alignSelf: 'flex-end', backgroundColor: 'white', borderRadius: 20, paddingTop: 40, justifyContent: 'space-between' }}>
          <Calendar
            // Collection of dates that have to be marked. Default = {}
            markedDates={{
              '2020-05-20': { textColor: Colors.primaryBlue },
              '2020-05-22': { startingDay: true, color: Colors.primaryBlue },
              '2020-05-23': { selected: true, endingDay: true, color: Colors.primaryBlue, textColor: 'gray' },
              '2020-05-04': { disabled: true, startingDay: true, color: Colors.primaryBlue, endingDay: true }
            }}
            markingType={'period'}
          />
          <View style={{ ...Styles.lineDividerHorizontal, marginVertical: 8 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24 }}>
            <TouchableOpacity onPress={() => onClose()} style={{ ...styles.button, alignSelf: 'center', marginBottom: 40 }}>
              <Text style={{ ...styles.text, ...textStyle, fontSize: 18, color: 'white' }}>{`إلغاء` || `Calendar`}</Text>
            </TouchableOpacity >
            <TouchableOpacity onPress={() => onClose()} style={{ ...styles.button, ...style, alignSelf: 'center', marginBottom: 40 }}>
              <Text style={{ ...styles.text, ...textStyle, fontSize: 18, color: 'white' }}>{`تحديد` || `Calendar`}</Text>
            </TouchableOpacity >
          </View>
        </View>
      </Modal>
    )
  }

  if (showCalendar) return renderCalendar()

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
