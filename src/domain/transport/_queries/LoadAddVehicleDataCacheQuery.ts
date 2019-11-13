import gql from 'graphql-tag';

export const LOAD_ADD_VEHICLE_DATA_CACHE_QUERY = gql`
  query createAddVehicleDataCache($collegeId: String!, $branchId: String!) {
    createAddVehicleDataCache(collegeId: $collegeId, branchId: $branchId) {
      branches {
        id
        branchName
        address1
      }
      colleges {
        id
        shortName
        logoPath
      }
      typeOfInsurances {
        id
        description
      }
      typeOfOwnerships {
        id
        description
      }
    }
  }
`;
