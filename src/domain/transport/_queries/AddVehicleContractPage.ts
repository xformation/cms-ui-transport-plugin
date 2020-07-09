import gql from 'graphql-tag';

export const ADD_VEHICLE_CONTRACT_MUTATION = gql`
  mutation saveVehicleContractLink($input: AddVehicleContractListInput) {
    saveVehicleContractLink(input: $input) {
      cmsVehicleContractLinkVo {
        exitCode
        exitDescription
        dataList {
          id
          vehicleId
          contractId
          vehicle {
            id
            vehicleNumber
            vehicleType
            capacity
            ownerShip
            dateOfRegistration
            yearOfManufacturing
            manufacturingCompany
            model
            chasisNo
            rcNo
            status
            onBoardingDate
            strDateOfRegistration
            strOnBoardingDate
            branchId
          }
          contract {
            id
            vendorName
            typeOfOwnerShip
            durationOfContract
            startDate
            endDate
            strStartDate
            strEndDate
          }
        }
      }
    }
  }
`;
