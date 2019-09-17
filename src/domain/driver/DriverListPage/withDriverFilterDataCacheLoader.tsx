import { RouteComponentProps } from 'react-router-dom';
import { graphql, QueryProps } from "react-apollo";
import * as LoadDriverFilterDataCacheQueryGql from './LoadDriverFilterDataCacheQuery.graphql';
import {ReactFunctionOrComponentClass, LoadDriverFilterDataCacheType} from '../../types';
import withLoadingHandler from '../../../components/withLoadingHandler';


type withDriverFilterDataCachePageDataLoaderProps = RouteComponentProps<{
  
  }>;

type TargetComponentProps = {
    data: QueryProps & LoadDriverFilterDataCacheType ;
};

const withDriverFilterDataCacheLoader = (TargetComponent: ReactFunctionOrComponentClass<TargetComponentProps>) => {
    return graphql<LoadDriverFilterDataCacheType, withDriverFilterDataCachePageDataLoaderProps, TargetComponentProps>(LoadDriverFilterDataCacheQueryGql, {
      options: ({ match }) => ({
        variables: {
          // collegeId: match.params.collegeId,
          // academicYearId: match.params.academicYearId,
        
        }
      })
    })(withLoadingHandler(TargetComponent));
};

export default withDriverFilterDataCacheLoader; 


