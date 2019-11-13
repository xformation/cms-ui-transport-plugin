import gql from 'graphql-tag';

export const VEHICLE_LIST_QUERY = gql`
  mutation getVehicleList($filter: VehicleListFilterInput!) {
    getVehicleList(filter: $filter) {
      id
      vehicleNumber
      vehicleType
      capacity
      ownerShip
      strDateOfRegistration
      yearOfManufacturing
      manufacturingCompany
      model
      chasisNo
      rcNo
      contactNumber
      status
      employee {
        id
        employeeName
        primaryContactNo
      }
      transportRoute {
        id
        routeName
      }
      insurance {
        id
      }
      strValidTill
    }
  }
`;
