import gql from 'graphql-tag';

export const GET_TRANSPORT_ROUTE_LIST = gql`
  query {
    getTransportRouteList {
      id
      routeName
      routeDetails
      routeMapUrl
      noOfStops
      routeFrequency
      status
    }
  }
`;
