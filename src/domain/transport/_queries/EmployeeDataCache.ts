import gql from 'graphql-tag';

export const EMPLOYEE_DATA_CACHE = gql`
  query {
    createEmployeeDataCache {
      employees {
        id
        employeeName
      }
      vehicles {
        id
        vehicleNumber
        ownerShip
      }
    }
  }
`;
