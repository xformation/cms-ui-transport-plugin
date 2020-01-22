import gql from 'graphql-tag';

export const ADD_ROUTE_MUTATION = gql`
  mutation addTransportRoute($input: AddTransportRouteInput!) {
    addTransportRoute(input: $input) {
      transportRoute {
        id
        routeName
        routeDetails
        routeMapUrl
        noOfStops
        routeFrequency
      }
    }
  }
}
`;
