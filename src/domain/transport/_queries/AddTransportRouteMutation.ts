import gql from 'graphql-tag';

export const ADD_ROUTE_MUTATION = gql`
  mutation addTransportRoute($input: AddTransportRouteInput!) {
    addTransportRoute(input: $input) {
      cmsTransportRouteVo {
        exitCode
        exitDescription
        dataList {
          id
          routeName
          routeDetails
          noOfStops
          routeMapUrl
          routeFrequency
          status
          createdBy
          createdOn
          updatedOn
          updatedBy
          strCreatedOn
          strUpdatedOn
          branchId
        }
      }
    }
  }
`;
