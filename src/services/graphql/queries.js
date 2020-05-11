import gql from 'graphql-tag';
import { Alert } from 'react-native'

export const onError = (error, pass) => {
  let error_msg = ''
  error.graphQLErrors.map(({ message, extensions }, i) => {
    console.log('Login Error', message)
    error_msg = error_msg + message + '\n'
    if (extensions && extensions.validation) {
      for (var key in extensions.validation) {
        if (extensions.validation.hasOwnProperty(key)) {
          console.log(key + " -> " + extensions.validation[key]);
          error_msg = error_msg + extensions.validation[key] + '\n'
        }
      }
    }
  })
  Alert.alert('Error', error_msg, [
    {
      text: 'OK', onPress: () => {
        // pass()
      }
    }
  ])
}


export const GET_CITIES = gql(`
{
  allCities {
    id,
    en,
    ar,
  }
}`)

export const GET_QUESTIONS = gql(`
query{
  allQuestions{
    question
    answer
  }
}
`)





//MUTATIONS

export const LOGIN = gql(
  `
  mutation($input: LoginViaPhoneInput!){
    loginViaPhone(input:$input){
      user{
        id
        name
        email
        phone
      }
      token
    }
  }
`
)

export const REGISTER = gql(
  `
  mutation($input: RegisterUserInput!){
    registerUser(input:$input){
      user{
        id
        name
        phone
        email
      }
      token
    }
  }
  `
)