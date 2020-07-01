import gql from 'graphql-tag';

export const GET_VEHICLE_LIST = gql`\
query {
    getVehicleList {
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
      onBoardingDate
      validTill
      strStartDate
      strEndDate
      strDateOfRegistration
      strOnBoardingDate
      strValidTill
      
    }
  }
  `;
