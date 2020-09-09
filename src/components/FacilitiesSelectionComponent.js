import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import Modal from 'react-native-modal';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import Colors from '../styles/Colors';
import { SafeAreaView } from 'react-navigation';
import Fonts from '../styles/Fonts';
import Styles from '../styles/Styles';
import Header from '../components/Header';
import { REGISTER } from '../services/graphql/queries'
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { ScrollView } from 'react-native-gesture-handler';
import Button from './Button';


export default function FacilitiesSelectionComponent(props) {
  const {
    style,
    textStyle,
    onPress,
    child,
    text,
    setSelected,
    data,
    onClose,
    isVisible,
  } = props

  const [selection, setSelection] = useState(data || [])
  const [isSubmitted, setSubmittted] = useState(false)

  useEffect(() => {
    if (!isVisible && !isSubmitted) {
      const items = [...selection]
      items.forEach(i => i.value = 0)
      setSelection(items)
    }
  }, [isVisible])

  const onSelect = index => {
    const items = [...selection]
    if (items[index].value) {
      items[index].value = 0
    } else {
      items[index].value = 1
    }
    setSelection(items)
  }

  const renderItem = (i, index) => {
    return (
      <TouchableOpacity onPress={() => onSelect(index)} key={index} style={{ flexDirection: 'row', alignItems: 'center', height: 40, width: '100%', justifyContent: 'flex-end', padding: 8, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: Colors.lightestGray }}>
        {i.value > 0 ? <MaterialIcons name={'check'} size={20} color={Colors.primaryBlue} /> : <View style={{ width: '10%' }} />}
        <View style={{ width: '10%' }} />
        < Text style={{ ...Fonts.fontRegular, width: '30%' }}>{i.name || `faciname`}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <Modal isVisible={isVisible}>
      <View style={{ width: '100%', height: '60%', alignSelf: 'flex-end', backgroundColor: 'white', borderRadius: 20, paddingTop: 24, padding: 16, justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={() => onClose()} style={{ position: 'absolute', top: 10, right: 10 }}>
          <MaterialIcons name={'close'} size={20} color={Colors.primaryBlue} />
        </TouchableOpacity>
        <Text style={{ ...Fonts.FontMed, textAlign: 'center', fontSize: 18 }}>Selection</Text>
        <ScrollView style={{ flex: 1, }} contentContainerStyle={{ alignItems: 'center', paddingBottom: 100, }}>
          {selection && selection.map((i, index) => renderItem(i, index))}
        </ScrollView>
        <View>
          <Button onPress={() => {
            const items = [...selection]
            const filtered = items.filter(i => i.value != 0)
            filtered.forEach(i => {
              delete i.name
              delete i.image
            })
            setSelected(filtered)
            console.log('filter', filtered)
            setSubmittted(true)
            onClose()
          }} style={{ alignSelf: 'center', }} />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    paddingHorizontal: 16,
    minWidth: 177,
    minHeight: 40,
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
