import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
} from 'react-native';

// import Modal from 'react-native-modal';

import Colors from '../styles/Colors';
import { SafeAreaView } from 'react-navigation';
import Fonts from '../styles/Fonts';
import Styles from '../styles/Styles';
import Header from '../components/Header';
import Button from '../components/Button'
import { REGISTER } from '../services/graphql/queries'
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useStoreActions, useStoreState } from 'easy-peasy';
import MapView from 'react-native-maps';


export default function MapComponent(props) {
  const {
    style,
    textStyle,
    onPress,
    child,
    text,
    isVisible,
    onClose,
  } = props

  return (
    <Modal style={styles.container} isVisible={isVisible}>
      <Header MapHeader />
      <View style={styles.viewContainer}>
        <Text>sample text</Text>
        <TouchableOpacity onPress={() => onClose()}>
          <Text>Close</Text>
        </TouchableOpacity>
        <MapView onRegionChange={e => console.log('regison', e)} style={{ flex: 1 }} />
        <View style={{ position: 'absolute', bottom: 10, width: '100%', padding: 10, alignItems: 'center', justifyContent: 'center' }}>
          <Button style={{ backgroundColor: Colors.primaryBlue }} textStyle={{ color: Colors.primaryYellow }} text={`تحديد`} />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '60%',
  },
  viewContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
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
