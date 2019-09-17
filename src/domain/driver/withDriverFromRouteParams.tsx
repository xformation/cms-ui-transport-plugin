import * as React from "react";
import { RouteComponentProps } from "react-router";
import { gql, graphql, QueryProps } from "react-apollo";

import * as DriverQueryGql from "./DriverQuery.graphql";
import { ReactFunctionOrComponentClass, DriverQuery, DriverDetailsFragment } from "../types";
import withLoadingHandler from "../../components/withLoadingHandler";

var queryString = require('query-string');

// Specifies the parameters taken from the route definition (/.../:studentId)
type DriverPageRouteParams = {
  employeeId: any
};

// Specifies the Properties that are passed to
type DriverPageProps = RouteComponentProps<DriverPageRouteParams>;

// The "full set" of properties passed to the target component
// (that is with the properties from GraphQL including the loaded student)
type DriverPageFullProps = DriverPageProps & {
  data: QueryProps & DriverQuery;
  employee: DriverDetailsFragment;
};

// this function takes a Component, that must have StudentPageProps-compatible properties.
// The function loads the Student with the studentId specified in the route params
// and passes the loaded student to the specified Component
const withDriverFromRouteParams = (
  TheDriverComponent: ReactFunctionOrComponentClass<{
    employee: DriverDetailsFragment;
  }>
) => {
  const withDriverFromRouteParamsWrapper = (props: DriverPageFullProps) => <TheDriverComponent employee={props.data.employee} />;
  return graphql<DriverQuery, DriverPageProps, DriverPageFullProps>(DriverQueryGql, {
    options: ({ match }) => (
      {
        variables: {
          employeeId: queryString.parse(location.search).id
        }
      })
  })(withLoadingHandler(withDriverFromRouteParamsWrapper));
};

export default withDriverFromRouteParams;