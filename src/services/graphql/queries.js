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

export const GET_USER_DETAILS = gql(`
query{
  me {
     id
     avatar
     name
     verified
     phone
     email
     notifications{
       message
       created_at
     }
     favorites{
       id
       owner{
           id
           name
           role{
               en
           }
       }
       created_at
     }
     role {
       id
       en
     }
     gender {
       id
       en
     }
     city {
       id
       en
     }
   }
}
`)

export const GET_CATEGORIES = gql(`
query{
  allCategories{
    id
    en
    ar
  }
}
`)

export const GET_TYPE = id => gql(
  `query{
    allTypes(category_id:${id}){
      id
      en
      ar
    }
  }`
)

export const GET_CITIES = gql(`
{
  allCities {
    id,
    en,
    ar,
  }
}`)

export const GET_GENDER = gql(`
query{
  allGenders{
    id
    en
    ar
  }
}
`)

export const GET_QUESTIONS = gql(`
query{
  allQuestions{
    question
    answer
  }
}
`)

export const GET_SUBS = gql(`
query{
  allSubscriptions{
    id
    name
    description
    duration
    limit
    price
    unli
  }
}`)



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

export const UPDATE_USER = gql(`
mutation($input: UpdateUserInput!){
  updateUser(input:$input){
    name
    email
    avatar
  }
}
`)
