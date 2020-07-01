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
          startDate
          endDate
          strStartDate
          strEndDate
          strDateOfRegistration
          strOnBoardingDate
          strValidTill
          branchId
        }
      }
    }
  }
`;
