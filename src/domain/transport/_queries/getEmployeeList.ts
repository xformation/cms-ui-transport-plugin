import gql from 'graphql-tag';

export const EMPLOYEE_LIST = gql`
  mutation getEmployeeList($filter: EmployeeListFilterInput!) {
    getEmployeeList(filter: $filter) {
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
      status
      maritalStatus
      strjoiningDate
      strjobEndDate
      strresignationDate
      strresignationAcceptanceDate
      strdrivingLicenceValidity
      transportRoute {
        id
      }
      branch {
        id
      }
      branchId
      transportRouteId
    }
  }
`;
