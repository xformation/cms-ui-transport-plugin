import { ApolloClient, createNetworkInterface } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:9098/graphql'
});
export const gQLClient = new ApolloClient({
  networkInterface: networkInterface
});