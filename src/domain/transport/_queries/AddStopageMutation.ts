import gql from 'graphql-tag';

export const ADD_STOPAGE_MUTATION = gql`
  mutation addStopage($input: AddStopageInput) {
    addStopage(input: $input) {
      cmsStopageVo {
        exitCode
        exitDescription
        dataList {
          id
          stopageName
          status
          strCreatedOn
          strUpdatedOn
          branchId
        }
      }
    }
  }
`;
