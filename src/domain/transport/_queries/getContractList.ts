import gql from 'graphql-tag';

export const CONTRACT_LIST = gql`
  query {
    getContractList {
      id
      vendorName
      typeOfOwnerShip
      durationOfContract
      startDate
      endDate
      strStartDate
      strEndDate
    }
  }
`;
