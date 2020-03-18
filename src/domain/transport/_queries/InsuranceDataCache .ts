import gql from 'graphql-tag';

export const INSURANCE_DATA_CACHE = gql`
  query {
    createInsuranceDataCache {
      vehicle {
        id
        vehicleNumber
        vehicleType
        capacity
      }
    }
  }
`;
