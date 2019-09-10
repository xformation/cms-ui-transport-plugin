import * as React from "react";
import { RouteComponentProps } from "react-router";
import { gql, graphql, QueryProps } from "react-apollo";

import * as VehicleQueryGql from "./VehicleQuery.graphql";
import { ReactFunctionOrComponentClass, VehicleQuery, VehicleDetailsFragment } from "../types";
import withLoadingHandler from "../../components/withLoadingHandler";

var queryString = require('query-string');

// Specifies the parameters taken from the route definition (/.../:studentId)
type VehiclePageRouteParams = {
  vehicleId: any
};

// Specifies the Properties that are passed to
type VehiclePageProps = RouteComponentProps<VehiclePageRouteParams>;

// The "full set" of properties passed to the target component
// (that is with the properties from GraphQL including the loaded student)
type VehiclePageFullProps = VehiclePageProps & {
  data: QueryProps & VehicleQuery;
  vehicle: VehicleDetailsFragment;
};

// this function takes a Component, that must have StudentPageProps-compatible properties.
// The function loads the Student with the studentId specified in the route params
// and passes the loaded student to the specified Component
const withVehicleFromRouteParams = (
  TheVehicleComponent: ReactFunctionOrComponentClass<{
    vehicle: VehicleDetailsFragment;
  }>
) => {
  const withVehicleFromRouteParamsWrapper = (props: VehiclePageFullProps) => <TheVehicleComponent vehicle={props.data.vehicle} />;
  return graphql<VehicleQuery, VehiclePageProps, VehiclePageFullProps>(VehicleQueryGql, {
    options: ({ match }) => (
      {
        variables: {
          vehicleId: queryString.parse(location.search).id
        }
      })
  })(withLoadingHandler(withVehicleFromRouteParamsWrapper));
};

export default withVehicleFromRouteParams;
