import gql from 'graphql-tag';

export const ADD_ROUTE_MUTATION = gql`
  mutation AddTransportRoute($input: TransportInput) {
    addTransportRoute(input: $input) {
      cmsTransportVo {
        exitCode
        exitDescription
        dataList {
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
