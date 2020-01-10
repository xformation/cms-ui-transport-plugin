import gql from 'graphql-tag';

export const ADD_VEHICLE_MUTATION = gql`
  mutation addVehicle($input: AddVehicleInput!) {
    addVehicle(input: $input) {
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
      branch {
        id
      }
      college {
        id
      }
    }
  }
`;
