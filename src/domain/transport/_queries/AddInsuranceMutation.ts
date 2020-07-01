import gql from 'graphql-tag';

export const ADD_INSURANCE_MUTATION = gql`
  mutation addInsurance($input: AddInsuranceInput) {
    addInsurance(input: $input) {
      cmsInsuranceVo {
        exitCode
        exitDescription
        dataList {
          id
          insuranceCompany
          typeOfInsurance
          dateOfInsurance
          validTill
          strDateOfInsurance
          strValidTill
          strDateOfInsurance
          strValidTill
          vehicle {
            id
          }
          vehicleId
        }
      }
    }
  }
`;
