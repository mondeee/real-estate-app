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

export const GET_OWNED_PROPERTIES = gql(`
query($first: Int!, $page: Int!, $userId: ID!){
  allOwnerProperties(first:$first, page: $page, user_id: $userId){
    paginatorInfo{
      hasMorePages
    }
    data{
      id,
      name,
      sections {
        id,
        name,
        type {
          id
          ar
          en
          category {
            id
            en
          }
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
      images{
        id
        avatar
      }
      category{
        id
        ar
        en
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
      facilities{
        id,
        value,
        facility {
          id
        }
      }
      district
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
      district
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

export const GET_SECTIONS = gql(`
query($property_id: Int!, $page: Int, $orderBy: [OrderByClause!]){
  allSection(property_id: $property_id, first: 30, page: $page, orderBy: $orderBy) {
    paginatorInfo{
      hasMorePages
    }
    data {
      id,
        name,
        type {
          id
          en
          ar
        }
        description
        images {
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
        type {
          id
          category {
            id
            en
          }
        }
        images {
          avatar
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
      district
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
