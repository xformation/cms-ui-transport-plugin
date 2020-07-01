import gql from 'graphql-tag';

export const GET_CONTRACT_LIST = gql`\
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
