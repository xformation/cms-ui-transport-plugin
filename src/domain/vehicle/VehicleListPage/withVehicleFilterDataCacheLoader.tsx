import { RouteComponentProps } from 'react-router-dom';
import { graphql, QueryProps } from "react-apollo";
import * as LoadVehicleFilterDataCacheQueryGql from './LoadVehicleFilterDataCacheQuery.graphql';
import {ReactFunctionOrComponentClass, LoadVehicleFilterDataCacheType} from '../../types';
import withLoadingHandler from '../../../components/withLoadingHandler';


type withVehicleFilterDataCachePageDataLoaderProps = RouteComponentProps<{
  
  }>;

type TargetComponentProps = {
    data: QueryProps & LoadVehicleFilterDataCacheType ;
};

const withVehicleFilterDataCacheLoader = (TargetComponent: ReactFunctionOrComponentClass<TargetComponentProps>) => {
    return graphql<LoadVehicleFilterDataCacheType, withVehicleFilterDataCachePageDataLoaderProps, TargetComponentProps>(LoadVehicleFilterDataCacheQueryGql, {
      options: ({ match }) => ({
        variables: {
          // collegeId: match.params.collegeId,
          // academicYearId: match.params.academicYearId,
        
        }
      })
    })(withLoadingHandler(TargetComponent));
};

export default withVehicleFilterDataCacheLoader; 


