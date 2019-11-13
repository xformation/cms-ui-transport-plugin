import gql from 'graphql-tag';

export const VEHICLE_QUERY = gql`
  query vehicle($vehicleId: Long!) {
    vehicle(id: $vehicleId) {
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
      employee {
        id
      }
      transportRoute {
        id
      }
      contract {
        id
      }
      insurance {
        id
      }
      branch {
        id
      }
      college {
        id
      }
      strDateOfRegistration
      dateOfInsurance
      strDateOfInsurance
      validTill
      strValidTill
      startDate
      endDate
      strStartDate
      strEndDate
      insuranceId
      employeeId
      transportRouteId
      collegeId
      branchId
      contractId
    }
  }
`;
