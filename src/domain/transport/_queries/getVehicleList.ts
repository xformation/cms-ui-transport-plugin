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
        typeOfOwnerShip
        durationOfContract
        startDate
        endDate
      }
      transportRoute {
        id
        routeName
        routeDetails
        noOfStops
        routeFrequency
      }
      insurance {
        id
        insuranceCompany
        typeOfInsurance
        vehicle {
          id
        }
      }
      vehicle {
        id
        vehicleNumber
        vehicleType
        capacity
        ownerShip
        rcNo
        yearOfManufacturing
      }
      vehicleContractLink {
        id
        vehicle {
          id
          vehicleNumber
          vehicleType
          capacity
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
          vehicleType
          capacity
        }
        employee {
          id
          employeeName
          designation
          drivingLicenceNo
        }
      }
      transportRouteVehicleLink {
        id
        transportRoute {
          id
          routeName
          routeDetails
          routeMapUrl
          noOfStops
          routeFrequency
        }
        vehicle {
          id
          vehicleNumber
          vehicleType
          capacity
        }
      }
      transportRouteStopageLink {
        id
        transportRoute {
          id
          routeName
          routeDetails
          noOfStops
          routeFrequency
        }
        stopage {
          id
          stopageName
        }
      }
      transportRouteList {
        id
        routeName
        routeDetails
        routeMapUrl
        noOfStops
        routeFrequency
      }
      transportRouteVehicleLinkList {
        id
        transportRoute {
          id
          routeName
          routeDetails
          routeMapUrl
          noOfStops
          routeFrequency
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
          routeDetails
          routeMapUrl
          noOfStops
          routeFrequency
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
