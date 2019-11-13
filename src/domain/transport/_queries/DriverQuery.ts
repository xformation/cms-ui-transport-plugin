import gql from 'graphql-tag';

export const DRIVER_QUERY = gql`
  query employee($employeeId: Long!) {
    employee(id: $employeeId) {
      id
      employeeName
      designation
      joiningDate
      jobEndDate
      resignationDate
      resignationAcceptanceDate
      aadharNo
      panNo
      passportNo
      primaryContactNo
      secondaryContactNo
      employeeFatherName
      employeeMotherName
      primaryAddress
      secondaryAddress
      employeeAddress
      personalMailId
      officialMailId
      disability
      drivingLicenceNo
      drivingLicenceValidity
      gender
      typeOfEmployment
      managerId
      status
      maritalStatus
      branch {
        id
      }
      transportRoute {
        id
      }
      vehicle {
        id
      }
    }
  }
`;
