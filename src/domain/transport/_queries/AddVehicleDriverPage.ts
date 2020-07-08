import gql from 'graphql-tag';

export const ADD_VEHICLE_DRIVER_MUTATION = gql`
  mutation saveVehicleDriverLink($input: AddVehicleDriverListInput) {
    saveVehicleDriverLink(input: $input) {
      cmsVehicleDriverLinkVo {
        exitCode
        exitDescription
        dataList {
          vehicleId
          employeeId
          vehicle {
            id
            vehicleNumber
            vehicleType
            capacity
            ownerShip
            dateOfRegistration
            yearOfManufacturing
            manufacturingCompany
            onBoardingDate
            model
            chasisNo
            rcNo
            status
            branchId
          }
          employee {
            id
            employeeName
            designation
            joiningDate
            jobEndDate
            resignationDate
            resignationAcceptanceDate
            aadharNo
            panNo
            primaryContactNo
            primaryAddress
            typeOfEmployment
            gender
            employeeAddress
            drivingLicenceNo
            drivingLicenceValidity
          }
        }
      }
    }
  }
`;
