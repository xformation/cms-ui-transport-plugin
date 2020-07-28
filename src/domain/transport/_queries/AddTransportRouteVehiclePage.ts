import gql from 'graphql-tag';

export const ADD_TRANSPORTROUTE_VEHICLE_MUTATION = gql`
  mutation saveTransportRouteVehicleLink($input: AddTransportRouteVehicleLinkInput) {
    saveTransportRouteVehicleLink(input: $input) {
      cmsTransportRouteVehicleLinkVo {
        exitCode
        exitDescription
        dataList {
          id
          vehicleId
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
          vehicle {
            id
            vehicleNumber
            vehicleType
            capacity
            ownerShip
            yearOfManufacturing
            manufacturingCompany
            model
            chasisNo
            rcNo
            status
            strDateOfRegistration
            strOnBoardingDate
            branchId
          }
        }
      }
    }
  }
`;
