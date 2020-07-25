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
            yearOfManufacturing
            manufacturingCompany
            model
            chasisNo
            rcNo
            status
            strDateOfRegistration
            strOnBoardingDate
            branchId
          }
          employee {
            id
            employeeName
            designation
            aadharNo
            panNo
            primaryContactNo
            primaryAddress
            typeOfEmployment
            gender
            employeeAddress
            drivingLicenceNo
          }
        }
      }
    }
  }
`;
