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
          yearOfManufacturing
          manufacturingCompany
          model
          chasisNo
          rcNo
          contactNumber
          status
          strDateOfRegistration
          transportRouteId
          collegeId
          branchId
          contractId
          insuranceId
          employeeId
        }
      }
    }
  }
`;
