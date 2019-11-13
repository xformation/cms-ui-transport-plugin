import gql from 'graphql-tag';

export const ADD_CONTRACT_MUTATION = gql`
  mutation addContract($input: AddContractInput!) {
    addContract(input: $input) {
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
