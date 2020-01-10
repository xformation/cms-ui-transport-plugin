import gql from 'graphql-tag';

export const LOAD_VEHICLE_FILTER_DATA_CACHE_QUERY = gql`
  query {
    createVehicleDataCache {
      vehicles {
        id
        vehicleNumber
        vehicleType
      }
      transportRoutes {
        id
        routeName
      }
      routeFrequencies {
        id
        description
      }
    }
  }
`;
