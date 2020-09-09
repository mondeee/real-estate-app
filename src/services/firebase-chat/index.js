import * as firebase from 'firebase';

export const firebaseListener = async (dir) => {
  if (!dir) {
    console.log('dir param not found')
    return
  }
  return await firebase.database().ref(dir)
  // .on('value', (snapshot) => {
  //   const chat_list = []
  //   console.log('SNAPSHOT', snapshot.val())
  //   return snapshot.val()

  //   // if (!obj || obj.length == 0) {
  //   //   this.setState({ loading: false })
  //   //   return
  //   // }

  //   //CONVERSION DATA TO OBJECT
  //   // for (const [key, value] of Object.entries(obj)) {

  //   // }
  //   // Object.keys(snapshot.val()).forEach((e) => {console.log(e)})
  //   // return obj
  // });
  // return messages
}

//PARTIAL
export const pushToFirebase = async (dir, data) => {
  if (!dir || !data) {
    console.log('dir param not found')
    return
  }
  const message = await firebase.database().ref(dir).set({
    ...data
  })
}

export const listenToRooms = async (dir) => {
  if (!dir) {
    console.log('dir param not found')
    return
  }
  firebase.database().ref(dir).on('value', (snapshot) => {
    const msg = snapshot.val()
    console.log('@snapshot_msg', msg)
    return msg
  })
}



