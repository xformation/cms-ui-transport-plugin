import gql from 'graphql-tag';

export const ADD_CONTRACT_MUTATION = gql`
  mutation addContract($input: AddContractInput) {
    addContract(input: $input) {
      cmsContractVo {
        exitCode
        dataList {
          id
          vendorName
          typeOfOwnerShip
          durationOfContract
          strStartDate
          strEndDate
        }
      }
    }
  }
`;
