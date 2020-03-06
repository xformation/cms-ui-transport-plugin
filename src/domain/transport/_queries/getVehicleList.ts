import gql from 'graphql-tag';

export const GET_VEHICLE_LIST = gql`
  mutation getVehicleList($filter: VehicleListFilterInput!) {
    getVehicleList(filter: $filter) {
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
      insuranceId
      employeeId
      transportRoute {
        id
        routeName
        routeDetails
        noOfStops
        routeFrequency
      }
      cmsInsuranceVo {
        id
        insuranceCompany
        typeOfInsurance
        dateOfInsurance
        validTill
        strDateOfInsurance
        strValidTill
      }
      dateOfInsurance
      strDateOfInsurance
      validTill
      strValidTill
      startDate
      endDate
      strStartDate
      strEndDate
    }
  }
`;
