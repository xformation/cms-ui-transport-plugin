import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { ApolloProvider } from 'react-apollo';

import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { createGraphQLClient } from '../../../createGraphQLClient';
import AddVehiclePage from './AddVehiclePage';

const graphQLClient = createGraphQLClient();

export default function init() {
  setTimeout(function () {
    ReactDOM.render(
      <ApolloProvider client={graphQLClient}>
        <BrowserRouter>
          <Switch>
            <Route
              path="/plugins/ems-transpot/page/addvehicle"
              component={AddVehiclePage}
            />
          </Switch>
        </BrowserRouter>
      </ApolloProvider>,
      document.getElementById('mountAddVehicle')
    );
  }, 100);
}