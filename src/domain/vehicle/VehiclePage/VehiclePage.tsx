import * as React from 'react';
import {RouteComponentProps} from 'react-router';
import {gql, graphql, QueryProps} from 'react-apollo';

import * as VehicleQueryGql from './VehicleQuery.graphql';
import {VehicleDetailsFragment} from '../../types';
import withVehicleFromRouteParams from '../withVehicleFromRouteParams';

import VehicleDetailsTable from './VehicleDetailsTable';

const VehiclePage = ({vehicle}: {vehicle: VehicleDetailsFragment}) => (
  <span>
    <VehicleDetailsTable vehicle={vehicle} />
  </span>
);

export default withVehicleFromRouteParams(VehiclePage);