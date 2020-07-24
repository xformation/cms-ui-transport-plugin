import gql from 'graphql-tag';

export const GET_VEHICLE_CONTRACT_LIST = gql`
  query {
    getVehicleContractList {
      id
      vehicleId
      contractId
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
      contract {
        id
        vendorName
        typeOfOwnerShip
        durationOfContract
        strStartDate
        strEndDate
      }
    }
  }
`;
