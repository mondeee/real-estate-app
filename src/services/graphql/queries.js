import gql from 'graphql-tag';
import { Alert, AsyncStorage } from 'react-native'
import * as Updates from "expo-updates";
import { NavigationActions, StackActions } from "react-navigation";

export const onError = async (error, pass) => {
  let error_msg = ''
  let relog = false
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

  console.log('@ERROR MESSAGE STRINGIFY ====\n', JSON.stringify(error_msg))
  Alert.alert('', error_msg, [
    {
      text: 'OK', onPress: async () => {
        // await Updates.reloadAsync()
        // pass()
      }
    }
  ])
}

export const ADD_FFEDBACK = gql(`
mutation($input: AddFeedbackInput!) {
  addFeedback(input:$input) {
    status
    message
  }
}
`)

export const DELETE_IMAGES = gql(`
mutation($input: DeleteMultipleImageInput!) {
  deleteMultipleImage(input:$input) {
    status
    message
  }
}
`)


export const CREATE_ROOM = gql(`
query($id:ID!){
  checkConversationID(receiver_id: $id){
    conversation_id,
    status
  }
}
`)

export const GET_PROPERTY_DETAILS = gql(`
query($id:ID!){
  viewProperty(id: $id){
    id
    name
    facilities {
      id
    }
    sections {
      lowest_price
      price_average
      id
      name
      images {
        id
        avatar
      }
      facilities {
        id
        value
        facility {
          id
          en
        }
      }
    }
  }
}
`)

export const FORGET_PASSWORD = gql(`
mutation($input: ForgotViaPhoneInput!){
  forgotViaPhone(input: $input){
    code
    token
  }
}
`)

export const CHANGE_PASS = gql(`
mutation($input: ChangePasswordInput!){
  changePassword(input: $input){
    status
    message
  }
}
`)

export const GET_SETTINGS = gql(`
query{
  allSettings {
    owner_terms_and_conditions
    about_us
    contact_us
    instructions
    cancellation_policy
    is_subscription
  }
}
`)

export const COMMON_QUESTIONS = gql(`
query{
  ownerQuestions(first:10){
    data{
      question
      answer
    }
  }
}
`)

export const GET_OWNED_PROPERTIES = gql(`
query($first: Int!, $page: Int!){
  ownerProperties(first: $first, page: $page) {
      paginatorInfo{
        hasMorePages
      }
      data{
        id,
        name,
        latitude,
        longitude
        contact_name
        contact_no
        sections {
          id,
          name,
          type {
            id
            en
            ar
          }
          description
          images {
            id
            avatar
          }
          facilities {
            id,
            value
          }
          availablities {
            from
            to
          }
        general_price{
          monday
          tuesday
          wednesday
          thursday
          saturday
          friday
          sunday
        }
          type {
            id
            category {
              id
              en
            }
          }
          images {
            id
            avatar
          }
        }
        description,
        district {
          id,
          en,
          ar
        }
        city {
          id,
          ar,
          en
        }
        type {
          id,
          en,
          ar,
        }
        images{
          id
          avatar
        }
        category{
          id
          ar
          en
        }
        facilities{
          id,
          value,
          facility {
            id
          }
        }
        general_price{
          monday
          tuesday
          wednesday
          thursday
          saturday
          friday
          sunday
        }
        proof_of_ownership
        seasonal_prices{
          price
          to
          from
        }
        availablities{
          to
          from
        },
        reviews {
          star,
          comment,
          user {
            name
          }
        },
        review_average
        price_average
        is_favorite
        lowest_price
        owner {
          id
          avatar
          name
          phone
          email
        }
      }
    }
}
`)


export const GET_ALL_PROPERTIES = gql(`
query($first: Int!, $page: Int!, $orderBy: [OrderByClause!]){
  allProperties(first:$first, page: $page, orderBy: $orderBy){
    paginatorInfo{
      hasMorePages
    }
    data{
      id,
      name,
      sections {
        lowest_price
        price_average
        id,
        name,
        description
        type {
          id
          en
          ar
        }
        images {
          id
          avatar
        }
        facilities {
        	id,
          value
          facility {
            id
          }
        }
        availablities {
          from
          to
        }
        type {
          id
          ar
          en
          category {
            id
            en
          }
        }
        images {
          id
          avatar
        }
      }
      description,
      city {
        id
        ar
        en
      }
      type {
        id
        en
        ar
      }
      images{
        id
        avatar
      }
      category{
        id
        ar
        en
      }
      facilities{
        id,
        value,
        facility {
          id
        }
      }
      district {
        id
        en,
        ar
      }
      general_price{
        monday
        tuesday
        wednesday
        thursday
        saturday
        friday
        sunday
      }
      proof_of_ownership
      seasonal_prices{
        price
        to
        from
      }
      availablities{
        to
        from
      },
      reviews {
        star,
        comment,
        user {
          name
        }
      },
      review_average
      price_average
      is_favorite
      lowest_price
      contact_name
      contact_no
      latitude
      longitude
      owner {
        id
        avatar
        name
        phone
        email
      }
    }
  }
}
`)

export const VIEW_USER_DETAILS = gql(`
  query($id: ID!){
    viewUser(id: $id) {
      id
      name
      avatar
    }
  }`
)


export const GET_USER_DETAILS = gql(`
query{
  me {
     id
     avatar
     name
     is_verified
     is_subscription
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
      id,
      ar,
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

export const GET_DISTRICT = gql(
  `
  query($id: Int ){
    allDistrict(city_id: $id) {
      id
      ar
      en
    }
  }
  `
)

export const GET_CITIES = gql(`
query{
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

export const GET_SECTIONS = gql(`
query($property_id: Int!, $page: Int, $orderBy: [OrderByClause!]){
  allSection(property_id: $property_id, first: 30, page: $page, orderBy: $orderBy) {
    paginatorInfo{
      hasMorePages
    }
    data {
      id,
        name,
        lowest_price
        price_average
        type {
          id
          en
          ar
        }
        description
        images {
          id
          avatar
        }
        facilities {
        	id,
          value
          facility {
            id
            type
            en
          }
        }
        availablities {
          from
          to
        }
        seasonal_prices {
          to
          from
          price
        }
        general_price{
          monday
          tuesday
          wednesday
          thursday
          saturday
          friday
          sunday
        }
        type {
          id
          category {
            id
            en
          }
        }
        images {
          id
          avatar
        }
    }
  }
}
`)


export const GET_OWNER_BOOKINGS = gql(`
query($page: Int!){
  ownerBookings {
    id
    owner_bookings(first: 30, page: $page) {
      paginatorInfo {
        hasMorePages
      }
          data {
      id
      referrence_id
      detail{
        check_in
        check_out
        amount
        property{
          id
          name
          images{
            avatar
          }
        }
        section {
          id
          name
        }
      }
    }
  }
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


export const UPDATE_USER = gql(`
mutation($input: UpdateUserInput!){
  updateUser(input:$input){
     id
     avatar
     name
     is_verified
     phone
     email
     notifications{
       message
       created_at
     }
     favorites{
      id,
      name,
      sections {
        lowest_price,
        id,
        name,
        facilities {
        	id,
          value
          facility {
            id
          }
        }
        availablities {
          from
          to
        }
        type {
          id
          category {
            id
            en
          }
        }
        images {
          id
          avatar
        }
      }
      description,
      city {
        id,
        ar,
        en
      }
      type {
        id,
        en,
        ar,
      }
      owner{
        id
        name
        avatar
      }
      images{
        id
        avatar
      }
      category{
        id
        ar
        en
      }
      facilities{
        id,
        value,
        facility {
          id
        }
      }
      district{
        id,
        en,
        ar
      }
      general_price{
        monday
        tuesday
        friday
        sunday
      }
      proof_of_ownership
      seasonal_prices{
				from
        to
        price
      }
      availablities{
        to
        from
      },
      reviews {
        star,
        comment,
        user {
          name
        }
      }
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
       ar
     }
   }
}
`)

export const ADD_PRIVATE_PROPERY = gql(`
mutation($input: AddPrivatePropertyInput!){
  addPrivatePropety(input:$input){
    property_id
    status
  }
}
`)

export const UPDATE_PRIVATE_PROPERTY = gql(`
mutation($input: UpdatePrivatePropertyInput!){
  updatePrivateProperty(input:$input){
    property_id
    status
  }
}
`)

export const UPDATE_COMMERCIAL_PROPERTY = gql(`
mutation($input: UpdateCommercialPropertyInput!){
  updateCommercialProperty(input:$input){
    property_id
    status
  }
}
`)

export const UPDATE_SECTION_PROPERTY = gql(`
mutation($input: UpdateSectionPropertyInput!){
  updateSectionProperty(input:$input){
    section_id
    status
  }
}
`)

export const ADD_COMMERCIAL_PROPERTY = gql(`
mutation($input: AddCommercialPropertyInput!){
  addCommercialPropety(input:$input){
    property_id
    status
  }
}
`)

export const ADD_SECTION_PROPERTY = gql(`
mutation($input: AddSectionPropertyInput!){
  addSectionProperty(input:$input){
    section_id
    status
  }
}
`)

export const ADD_SUBSCRIPTION = gql(`
mutation($input: AddSubscriptionInput!){
  addSubscription(input:$input){
    limit
    expired_at
    package{
      id
      name
      description
      duration
      limit
      price
      unli
    }
  }
}
`)

export const VERIFY_USER = gql(`
mutation{
  verifyUser{
    status
    message
  }
}`)

export const SEND_NOTIF_TOKEN = gql(`
mutation($input: AddExpoTokenInput!){
  addExpoToken(input:$input){
		status
    message
  }
}
`)

export const SEND_VERIFICATION_CODE = gql(`
mutation($input: SendVerificationInput){
  sendVerification(input:$input){
    code
    message
  }
}`)
