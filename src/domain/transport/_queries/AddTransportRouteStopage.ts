import gql from 'graphql-tag';

export const ADD_TRANSPORTROUTE_STOP_MUTATION = gql`
  mutation saveTransportRouteStopageLink($input: AddTransportRouteStopageLinkInput) {
    saveTransportRouteStopageLink(input: $input) {
      cmsTransportRouteStopageLinkVo {
        exitCode
        exitDescription
        dataList {
          id
          stopageId
          transportRouteId
          transportRoute {
            id
            routeName
            routeDetails
            noOfStops
            routeMapUrl
            routeFrequency
            status
          }
          stopage {
            id
            stopageName
            status
            strCreatedOn
            strUpdatedOn
            branchId
          }
        }
      }
    }
  }
`;
