import gql from 'graphql-tag';

export const ADD_VEHICLE_MUTATION = gql`
  mutation addVehicle($input: AddVehicleInput) {
    addVehicle(input: $input) {
      cmsVehicleVo {
        exitCode
        exitDescription
        dataList {
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
          contactNumber
          status
          strDateOfRegistration
          transportRouteId
          collegeId
          branchId
          contractId
          employeeId
          transportRoute {
            id
            routeName
            routeDetails
            noOfStops
            routeFrequency
          }
          cmsContractVo {
            id
            vendorName
            durationOfContract
            strStartDate
            strEndDate
            startDate
            endDate
          }
          employee {
            id
            employeeName
            designation
          }
          startDate
          endDate
          strStartDate
          strEndDate
        }
      }
    }
  }
`;
