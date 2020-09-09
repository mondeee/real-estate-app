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


export default function ChatScreen(props) {
  const { goBack, navigate, state: { params } } = props.navigation;
  const item = params.item
  const userData = useStoreState(state => state.auth.user)
  // const [receiver, setReceiver] = useState()
  const [messages, setMessages] = useState(item.messages && item.messages.length > 0 ? item.messages : [])

  useEffect(() => {
    console.log('@after', item)
    if (item.messages && item.messages.length > 0) {
      setMessages(item.messages)
    }
    // setMessages([
    //   {
    //     _id: 1,
    //     text: 'You can now chat with each other.',
    //     createdAt: new Date(),
    //     system: true,
    //     // Any additional custom parameters are passed through
    //   },
    //   {
    //     _id: 1,
    //     text: 'Hello User',
    //     createdAt: new Date(),
    //     user: {
    //       _id: 2,
    //       name: 'React Native',
    //       avatar: 'https://placeimg.com/140/140/any',
    //     },
    //   },
    // ])
  }, [])

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
    const username = 'AAA'
    const color = Colors.primaryBlue
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
    return (
      <View style={{
        height: 40,
        width: 40,
        borderRadius: 30,
        backgroundColor: Colors.primaryBlue,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text style={{
          fontSize: 20,
          color: Colors.primaryYellow,
        }}>{item.isOwner ? item.participants.receiver.name.charAt(0) : item.participants.creator.name.charAt(0)}</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <Header onPressBack={() => { goBack() }} />
      <View style={styles.container}>
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
