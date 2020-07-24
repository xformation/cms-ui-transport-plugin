import gql from 'graphql-tag';

export const GET_VEHICLE_ROUTE_LIST = gql`
  query {
    getTransportRouteVehicleList {
      id
      transportRouteId
      vehicleId
      transportRoute {
        id
        routeName
        routeDetails
        routeMapUrl
        noOfStops
        routeFrequency
        status
      }
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
      }
    }
  }
`;
