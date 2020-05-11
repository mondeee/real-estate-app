import { AsyncStorage } from 'react-native'
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import { HttpLink } from 'apollo-link-http';




const cache = new InMemoryCache();

await persistCache({
  cache,
  storage: AsyncStorage,
});


// Continue setting up Apollo as usual.

const apolloclient = new ApolloClient({
  cache,
  link: new HttpLink(
    {
      uri: 'http://your.graphql.url/graphql'
    })
});

export const client = apolloclient