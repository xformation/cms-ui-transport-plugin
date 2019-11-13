import * as React from "react";

const withLoadingHandler = (TheComponent: any) => {
    const LoadingHandlerWrapper = (props: any) => (props.data.loading ? <h1>Loading</h1> : <TheComponent {...props} />);
    return LoadingHandlerWrapper;
};

export default withLoadingHandler;