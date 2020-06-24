import gql from 'graphql-tag';

export const ADD_VEHICLE_MUTATION = gql`
  mutation addVehicle($input: AddVehicleInput) {
    addVehicle(input: $input) {
      cmsVehicleVo {
        exitCode
        exitDescription
        dataList {
          id
          vehicleNumber
          vehicleType
          capacity
          ownerShip
          dateOfRegistration
          yearOfManufacturing
          manufacturingCompany
          model
          chasisNo
          rcNo
          status
          strDateOfRegistration
          routeVehicleList {
            transportRoute {
              id
              routeName
              routeDetails
              routeMapUrl
              noOfStops
              routeFrequency
              status
            }
            vehicle {
              id
              vehicleNumber
              vehicleType
              capacity
              ownerShip
              dateOfRegistration
              yearOfManufacturing
            }
          }
          branchId
        }
      }
    }
  }
`;
