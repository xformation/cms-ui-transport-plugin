import gql from 'graphql-tag';

export const ADD_TRANSPORTROUTE_VEHICLE_MUTATION = gql`
  mutation saveTransportRouteVehicleLink($input: AddTransportRouteVehicleLinkInput) {
    saveTransportRouteVehicleLink(input: $input) {
      cmsTransportRouteVehicleLinkVo {
        exitCode
        exitDescription
        dataList {
          vehicleId
          transportRouteId
          transportRoute {
            id
            routeName
          }
          vehicle {
            id
            vehicleNumber
          }
        }
      }
    }
  }
`;
