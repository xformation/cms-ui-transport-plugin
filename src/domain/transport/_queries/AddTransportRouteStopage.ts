import gql from 'graphql-tag';

export const ADD_TRANSPORTROUTE_STOP_MUTATION = gql`
  mutation saveTransportRouteStopageLink($input: AddTransportRouteStopageLinkInput) {
    saveTransportRouteStopageLink(input: $input) {
      cmsTransportRouteStopageLinkVo {
        exitCode
        exitDescription
        dataList {
          stopageId
          transportRouteId
          transportRoute {
            id
            routeName
          }
          stopage {
            id
            stopageName
          }
        }
      }
    }
  }
`;
