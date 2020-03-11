import gql from 'graphql-tag';

export const VEHICLE_DATA_CACHE = gql`
  query {
    createVehicleDataCache {
      transportRoute {
        id
        routeName
        routeDetails
        routeMapUrl
        noOfStops
        routeFrequency
      }
      insurance {
        id
        insuranceCompany
        typeOfInsurance
        dateOfInsurance
        validTill
        strDateOfInsurance
        strValidTill
      }
      vehicle {
        id
        vehicleNumber
        vehicleType
      }
      employee {
        id
        employeeName
        designation
      }
      branches {
        id
        branchName
        college {
          id
        }
      }
    }
  }
`;
