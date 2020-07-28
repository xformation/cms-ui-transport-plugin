import gql from 'graphql-tag';

export const GET_VEHICLE_LIST = gql`
  mutation getVehicleList($filter: VehicleListFilterInput!) {
    getVehicleList(filter: $filter) {
      id
      transportRouteId
      contractId
      insuranceId
      stopageId
      employeeId
      vehicleId
      branchId
      vehicleContractLinkId
      vehicleDriverLinkId
      transportRouteVehicleLinkId
      transportRouteStopageLinkId
      employee {
        id
        employeeName
      }
      stopage {
        id
        stopageName
      }
      contract {
        id
        vendorName
      }
      transportRoute {
        id
        routeName
      }
      insurance {
        id
        insuranceCompany
        vehicle {
          id
        }
      }
      vehicle {
        id
        vehicleNumber
      }
      vehicleContractLink {
        id
        vehicle {
          id
          vehicleNumber
        }
        contract {
          id
          vendorName
        }
      }
      vehicleDriverLink {
        id
        employeeId
        vehicle {
          id
          vehicleNumber
        }
      }
      transportRouteVehicleLink {
        id
        transportRoute {
          id
          routeName
          routeDetails
          noOfStops
          routeFrequency
        }
        vehicle {
          id
          vehicleNumber
          capacity
        }
      }
      transportRouteStopageLink {
        id
        transportRoute {
          id
          routeName
        }
        stopage {
          id
          stopageName
        }
      }
      transportRouteList {
        id
        routeName
      }
      transportRouteVehicleLinkList {
        id
        transportRoute {
          id
          routeName
        }
        vehicle {
          id
          vehicleNumber
        }
      }
      transportRouteStopageLinkList {
        id
        transportRoute {
          id
          routeName
        }
        stopage {
          id
          stopageName
        }
      }
      vehicleContractLinkList {
        id
        vehicle {
          id
          vehicleNumber
        }
        contract {
          id
          vendorName
        }
      }
      vehicleDriverLinkList {
        id
        employeeId
        vehicle {
          id
          vehicleNumber
        }
      }
    }
  }
`;
