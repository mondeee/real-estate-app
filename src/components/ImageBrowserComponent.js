import React, { useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import Modal from 'react-native-modal';

import Colors from '../styles/Colors';
import { SafeAreaView } from 'react-navigation';
import Fonts from '../styles/Fonts';
import Styles from '../styles/Styles';
import ImageTile from './ImageTile'
import Button from './Button'
import { REGISTER } from '../services/graphql/queries'
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useStoreActions, useStoreState } from 'easy-peasy';

import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

import * as Permissions from "expo-permissions";
import { ReactNativeFile } from 'apollo-upload-client'
const width = Dimensions.get('window').width * 0.9;


export default function ImageBrowser(props) {
  const {
    style,
    textStyle,
    onPress,
    child,
    text,
    update,
    onClose,
    multiple,
    isVisible,
    photos: propPhotos,
    requestPermission,
  } = props

  // const GALLERY_PERMISSION = useStoreState(state => state.auth.isMediaAllowed)
  // const ALLOW_MEDIA = useStoreActions(actions => actions.auth.setAllowMedia)
  const container = useRef(null)
  const [isMediaAllowed, setAllowMedia] = useState(true)
  const [photos, setPhotos] = useState([])
  const [selected, setSelected] = useState([])
  // const [selectedPhotos, setSeelectedPhotos] = useState([])
  const [isEmpty, setEmpty] = useState(false)
  const [after, setAfter] = useState(null)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [loading, setLoading] = useState(false)
  const [finalPhotos, setFinalPhotos] = useState([])
  var timer = null

  useEffect(() => {
    if (requestPermission) {
      _requestPermission()
      _fetchGallery()
    }
    // _requestPermission()
  }, [])

  useEffect(() => {
    console.log('@SELECTED', selected, finalPhotos)
    if (selected) {
      processSelectedPhotos()
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        processSelectedPhotos()
      }, 1500)
    }
  }, [selected])

  const closeModal = () => {
    setSelected([])
    onClose()
  }

  useEffect(() => {
    if (isMediaAllowed) {
      _fetchGallery()
    }
  }, [isMediaAllowed])

  const _requestPermission = async () => {
    // const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    if (status === 'granted') {
      // console.log('@GRANED call fetch')
      setAllowMedia(true)
    } else {
      setAllowMedia(false)
    }
  }

  const _fetchGallery = () => {
    // console.log('@fetching gallery')
    const params = {
      first: 50,
      mediaType: [MediaLibrary.MediaType.photo],
      sortBy: [MediaLibrary.SortBy.creationTime]
    };
    if (after) params.after = after;
    if (!hasNextPage) return;
    MediaLibrary
      .getAssetsAsync(params)
      .then(data => processPhotos(data))
      .catch(e => console.log(e))
  }

  const processPhotos = (data) => {
    if (data.totalCount) {
      if (after === data.endCursor) return;
      const uris = data.assets;
      setPhotos([...photos, ...uris])
      setHasNextPage(data.hasNextPage)
      setAfter(data.endCursor)
    } else {
      setEmpty(true)
    }
  }

  const getItemLayout = (data, index) => {
    const length = width / 4;
    return { length, offset: length * index, index }
  }


  const selectImage = (index) => {
    let newSelected = []
    console.log(index)
    if (multiple) {
      newSelected = Array.from(selected);
    }
    let chosenPhotos = []
    if (newSelected.indexOf(index) === -1) {
      newSelected.push(index)
    } else {
      const deleteIndex = newSelected.indexOf(index)
      console.log(selected, deleteIndex)
      newSelected.splice(deleteIndex, 1)
    }
    if (newSelected.length > props.max) return;
    if (!newSelected) newSelected = [];

    setSelected(newSelected)

  }

  const processSelectedPhotos = async () => {
    const items = []
    const resizedPhotos = []
    selected.forEach(i => items.push(photos[i]))
    await items.forEach(async i => {
      const resizedPhoto = await ImageManipulator.manipulateAsync(
        i.uri,
        [{ resize: { width: 300 } }], // resize to width of 300 and preserve aspect ratio 
        { compress: 0.7, format: 'jpeg' },
      )
      // console.log(i, resizedPhotos)
      const imageFile = await new ReactNativeFile({
        uri: resizedPhoto.uri,
        type: 'image/png',
        name: i.filename,
      })
      resizedPhotos.push(imageFile)
      setFinalPhotos(resizedPhotos)
    })
  }

  const onSubmitPhotos = async () => {
    if (selected) {
      setLoading(true)
      await processSelectedPhotos()
      // console.log('@IMAGES', finalPhotos)
      await props.setPhotos(finalPhotos)
      setLoading(false)
      onClose()
      // setTimeout(() => {
      //   props.setPhotos(finalPhotos)
      //   onClose()
      //   // props.navigation.goBack()
      //   setLoading(false)
      // }, 3000)
    } else {
      props.setPhotos([])
    }
  }

  const renderImageTile = ({ item, index }) => {
    const selectedItems = selected.indexOf(index) !== -1;
    const selectedItemNumber = selected.indexOf(index) + 1;
    return (
      <ImageTile
        selectedItemNumber={selectedItemNumber}
        item={item}
        index={index}
        selected={selectedItems}
        selectImage={selectImage}
        renderSelectedComponent={props.renderSelectedComponent}
      />
    )
  }

  const _renderGallery = () => {
    return (
      <FlatList
        data={photos}
        numColumns={3}
        renderItem={(data => renderImageTile(data))}
        keyExtractor={(_, index) => index}
        onEndReached={() => { _fetchGallery() }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={isEmpty ? renderEmptyStay() : renderPreloader()}
        initialNumToRender={24}
        style={{ alignSelf: 'center' }}
        getItemLayout={getItemLayout}
      />
    )
  }

  const renderPreloader = () => {
    return <ActivityIndicator size="large" />
  }

  const renderEmptyStay = () => {
    return <Text style={{ textAlign: 'center' }}>Empty =(</Text>
  }

  return (
    <Modal ref={container} isVisible={isVisible}>
      <View style={{ maxHeight: '65%', width: '100%', backgroundColor: 'white', borderRadius: 15, paddingVertical: 8, }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', wdith: '100%', justifyContent: 'space-between' }}>
          <Text style={{ ...Fonts.FontMed, marginLeft: 10 }}>{`Gallery`}</Text>
          <TouchableOpacity style={{ alignSelf: 'flex-end', marginRight: 10, }} onPress={() => closeModal()}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
        {_renderGallery()}
        {!loading ? <Button onPress={() => onSubmitPhotos()} style={{ alignSelf: 'center', marginVertical: 10 }} text={`Next`} /> : <ActivityIndicator />}
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
