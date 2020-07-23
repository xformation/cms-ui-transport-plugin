import gql from 'graphql-tag';

export const GET_TRANSPORT_ROUTE_STOPAGE_LIST = gql`
  query {
    getTransportRouteStopageList {
      id
      transportRouteId
      stopageId
      transportRoute {
        id
        routeName
        routeDetails
        routeMapUrl
        noOfStops
        routeFrequency
        status
      }
      stopage {
        id
        stopageName
      }
    }
  }
`;
