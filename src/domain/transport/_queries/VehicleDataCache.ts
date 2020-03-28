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
      vehicle {
        id
        vehicleNumber
        vehicleType
        capacity
        ownerShip
      }
      employee {
        id
        employeeName
        designation
      }
      branches {
        id
        branchName
      }
      contract {
        id
        vendorName
        typeOfOwnerShip
        durationOfContract
        strStartDate
        strEndDate
        startDate
        endDate
      }
    }
  }
`;
