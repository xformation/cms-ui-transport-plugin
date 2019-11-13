import gql from 'graphql-tag';

export const ADD_DOCUMENT_MUTATION = gql`
  mutation addDocuments($input: AddDocumentsInput!) {
    addDocuments(input: $input) {
      documents {
        id
        documentName
        documentFilePath
      }
    }
  }
`;
