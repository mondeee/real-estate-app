import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Header from '../components/Header';
import {
  Bubble,
  GiftedChat,
  Message,
  MessageText,
  MessageImage,
  Time,
  utils
} from 'react-native-gifted-chat'
import Colors from '../styles/Colors';
import { firebaseListener, pushToFirebase } from '../services/firebase-chat';
import { useStoreState } from 'easy-peasy';
import * as firebase from 'firebase';
import { v4 as uuid } from 'uuid';
import { IMAGE_URL } from '../services/api/url';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { VIEW_USER_DETAILS } from '../services/graphql/queries';


export default function ChatScreen(props) {
  const { goBack, navigate, state: { params } } = props.navigation;
  const item = params.item
  const username = item.isOwner ? item.participants.receiver.name : item.participants.creator.name
  const userData = useStoreState(state => state.auth.user)
  // const [receiver, setReceiver] = useState()
  const [messages, setMessages] = useState(item.messages && item.messages.length > 0 ? item.messages : [])
  const { data, error } = useQuery(VIEW_USER_DETAILS, {
    variables: {
      id: item.isOwner ? item.participants.receiver.id : item.participants.creator.id
    },
  })

  useEffect(() => {
    if (data) {
      console.log('@DATA', data)
      delete data.viewUser.__typename
      updateUser(data.viewUser)
    }
  }, [data, error])

  useEffect(() => {
    console.log('@after', item)
    if (item.messages && item.messages.length > 0) {
      setMessages(item.messages)
    }
  }, [])

  const updateUser = user => {
    const data = item.participants
    if (item.isOwner) {
      data.receiver = user
    } else {
      data.creator = user
    }
    pushToFirebase(`conversations/${item.key}/participants`, data)
  }

  const createMessageObj = () => {
    return {
      _id: uuid(),
      createdAt: new Date(),
      text: 'You can now chat with each other.',
      system: true,
    }
  }

  const pushMessage = async msgs => {
    const message = await firebase.database().ref(dir).set({
      ...msgs
    })
  }

  useEffect(() => {

  }, [messages])

  const renderBubble = props => {
    // let username = props.currentMessage.user.name

    const color = Colors.primaryBlue
    // if (props.currentMessage.user.name != username) {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: 'white',
          },
          left: {
            color: color,
          }
        }}
        wrapperStyle={{
          left: {
            backgroundColor: `#F1F0F0`,
          },
          right: {
            backgroundColor: `${color}`
          }
        }}
      />
    )
    // }

    return (
      <View>
        <Text>{username}</Text>
        <Bubble
          {...props}
          textStyle={{
            right: {
              color: 'white',
            },
            left: {
              color: color,
            }
          }}
          wrapperStyle={{
            left: {
              backgroundColor: `#F1F0F0`,
            },
            right: {
              backgroundColor: `${color}`
            }
          }}
        />
      </View>
    )
  }

  const renderMessage = props => {
    const {
      currentMessage: { text: currText },
    } = props
    let messageTextStyle = {
      // position: 'left'
    }
    // props.position = 'right'
    // console.log(props.currentMessage)
    // if (props.user._id == props.currentMessage.user._id) props.position = 'left'

    return <Message {...props} messageTextStyle={messageTextStyle} />
  }

  const onSend = async (msgs = []) => {
    const newset = messages.concat(msgs)
    setMessages(newset)
    pushToFirebase(`conversations/${item.key}/messages`, newset)
  }

  const renderAvatar = () => {
    const avatar = item.isOwner ? item.participants.creator : item.participants.receiver
    if (!item.avatar || item.avatar.includes('profile'))
      return (
        <View style={{
          height: 46,
          width: 46,
          borderRadius: 100,
          backgroundColor: Colors.primaryBlue,
          marginLeft: 8,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Text style={{ fontWeight: '500', color: Colors.primaryYellow, fontSize: 20 }}>{(avatar.name.charAt(0)).toUpperCase()}</Text>
        </View>
      )

    return <Image source={{ uri: IMAGE_URL + avatar.avatar }} style={{ height: 46, width: 46, borderRadius: 100, marginLeft: 8, backgroundColor: Colors.primaryBlue, }} />
  }

  return (
    <View style={{ flex: 1 }}>
      <Header name={username} onPressBack={() => { goBack() }} />
      <View style={styles.container}>
        <Text></Text>
        <GiftedChat
          inverted={false}
          renderBubble={renderBubble}
          renderMessage={renderMessage}
          messages={messages}
          onSend={messages => onSend(messages)}
          renderAvatar={() => renderAvatar()}
          user={{
            _id: userData.id,
            name: userData.name,
            // avatar: userData.avatar
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: '10%',
    padding: 12,
    backgroundColor: 'white',
  },
});
