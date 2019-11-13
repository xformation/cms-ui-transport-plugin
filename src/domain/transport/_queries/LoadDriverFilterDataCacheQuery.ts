import gql from 'graphql-tag';

export const LOAD_DRIVER_FILTER_DATA_CACHE_QUERY = gql`
  query {
    createEmployeeDataCache {
      employees {
        id
        employeeName
        designation
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
        gender
        typeOfEmployment
        managerId
        status
        maritalStatus
        transportRoute {
          id
        }
        branch {
          id
        }
        vehicle {
          id
        }
      }
      vehicles {
        id
        vehicleNumber
        vehicleType
        capacity
        ownerShip
        yearOfManufacturing
        manufacturingCompany
        model
        chasisNo
        rcNo
        contactNumber
        status
        employee {
          id
        }
        transportRoute {
          id
        }
        insurance {
          id
        }
        contract {
          id
        }
      }
    }
  }
`;
