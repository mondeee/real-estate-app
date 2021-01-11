
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableHighlight,
} from 'react-native';

const width = Dimensions.get('window').width * 0.8;

export default function ImageTile(props) {
  let { item, index, selected, selectImage } = props;
  if (!item) return null;
  return (
    <TouchableHighlight
      style={{ opacity: selected ? 0.5 : 1, margin: 4, }}
      underlayColor='transparent'
      onPress={() => selectImage(index)}
    >
      <Image
        style={{ width: width / 3, height: width / 3, borderRadius: 12, }}
        source={{ uri: item.uri }}
      />
    </TouchableHighlight>
  )
}