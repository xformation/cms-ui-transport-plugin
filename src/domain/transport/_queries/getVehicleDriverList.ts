import gql from 'graphql-tag';

export const GET_VEHICLE_DRIVER_LIST = gql`
  query {
    getVehicleDriverList {
      id
      vehicleId
      employeeId
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
      }
      employee {
        id
        employeeName
        designation
      }
    }
  }
`;
