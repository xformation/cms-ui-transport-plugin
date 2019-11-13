import gql from 'graphql-tag';

export const ADD_VEHICLE_MUTATION = gql`
  mutation addVehicle($input: AddVehicleInput!) {
    addVehicle(input: $input) {
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
        branch {
          id
        }
        college {
          id
        }
      }
    }
  }
`;
