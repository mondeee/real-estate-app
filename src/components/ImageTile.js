
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import { IMAGE_URL } from '../services/api/url';
import Colors from '../styles/Colors';

const width = Dimensions.get('window').width * 0.8;

export default function ImageTile(props) {
  let { item, index, selected, selectImage } = props;
  if (!item) return null;

  if (props.delete)
    return (
      <TouchableOpacity
        style={{ margin: 4, }}
        underlayColor='transparent'
        onPress={() => selectImage(index)}
      >
        <Image
          style={{ width: width / 3, height: width / 3, borderRadius: 12, }}
          source={{ uri: IMAGE_URL + item.avatar }}
        />
        { selected && <View
          style={{
            position: 'absolute',
            width: width / 3,
            height: width / 3,
            borderRadius: 12,
            backgroundColor: Colors.red + 50
          }}
        />}
      </TouchableOpacity>
    )
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