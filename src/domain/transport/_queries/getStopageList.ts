import gql from 'graphql-tag';

export const GET_STOPAGE_LIST = gql`\
query {
    getStopageList {
      id
	  stopageName
      status
      createdBy
      createdOn
      strCreatedOn
      updatedBy
      updatedOn
      strUpdatedOn
      branchId
    }
  }
  `;
