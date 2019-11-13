import gql from 'graphql-tag';

export const LOAD_VEHICLE_FILTER_DATA_CACHE_QUERY = gql`
  query {
    createVehicleDataCache {
      vehicles {
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
        employee {
          id
        }
        transportRoute {
          id
        }
        insurance {
          id
        }
      }
      transportRoutes {
        id
        routeName
        routeDetails
        routeMapUrl
        noOfStops
        routeFrequency
      }
    }
  }
`;
