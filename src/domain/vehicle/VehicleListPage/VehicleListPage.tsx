import * as React from 'react';
import * as _ from 'lodash';

import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { graphql, QueryProps, MutationFunc, compose } from 'react-apollo';

import * as VehicleListQueryGql from './VehicleListQuery.graphql';
import { LoadVehicleFilterDataCacheType, VehicleListQuery, VehicleFragment } from '../../types';
import '../../../css/dark.css';
import withVehicleFilterDataCacheLoader from "./withVehicleFilterDataCacheLoader";


const w180 = {
  width: '180px'
};

type VehicleRootProps = RouteComponentProps<{
}> & {
    data: QueryProps & LoadVehicleFilterDataCacheType;
  }
type VehiclePageProps = VehicleRootProps & {
  mutate: MutationFunc<VehicleListQuery>;
};

type VehicleTableStates = {
  vehicles: any,
  vehicleData: any,
  transportRoutes: any,
  pageSize: any,
  search: any
};

class VehiclesTable extends React.Component<VehiclePageProps, VehicleTableStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      vehicles: {},
      vehicleData: {
       
        transportRoute: {
          id: ""
        },
        vehicle: {
          id: ""
        },
      
        mutateResult: [],
        search: ""
      },
      transportRoutes: [],
      pageSize: 5,
      search: ''

    };
    this.createVehicles = this.createVehicles.bind(this);
    this.createTransportRoutes = this.createTransportRoutes.bind(this);
   
    // this.searchHandlers = this.searchHandlers.bind(this);

    this.checkAllVehicles = this.checkAllVehicles.bind(this);
    this.onClickCheckbox = this.onClickCheckbox.bind(this);
    this.createVehicleRows = this.createVehicleRows.bind(this);
    this.createNoRecordMessage = this.createNoRecordMessage.bind(this);
  }

  createTransportRoutes(transportRoutes: any) {
    let transportRoutesOptions = [<option key={0} value="">Select RouteId</option>];
    for (let i = 0; i < transportRoutes.length; i++) {
      transportRoutesOptions.push(
        <option key={transportRoutes[i].id} value={transportRoutes[i].id}>{transportRoutes[i].id}</option>
      );
    }
    return transportRoutesOptions;
  }

  createVehicles(vehicles: any, selectedTransportRouteId: any) {
    let vehiclesOptions = [<option key={0} value="">Select VehicleId</option>];
    for (let i = 0; i < vehicles.length; i++) {
      if (selectedTransportRouteId == vehicles[i].transportRoute.id) {
        vehiclesOptions.push(
          <option key={vehicles[i].id} value={vehicles[i].id}>{vehicles[i].id}</option>
        );
      }
    }
    return vehiclesOptions;
  }


  checkAllVehicles(e: any) {
    const { vehicleData } = this.state;
    const mutateResLength = vehicleData.mutateResult.length;
    let chkAll = e.nativeEvent.target.checked;
    let els = document.querySelectorAll("input[type=checkbox]");

    var empty = [].filter.call(els, function (el: any) {
      if (chkAll) {
        el.checked = true;
      } else {
        el.checked = false;
      }
    });
  }

  onClickCheckbox(index: any, e: any) {
    // const { target } = e;
    const { id } = e.nativeEvent.target;
    let chkBox: any = document.querySelector("#" + id);
    chkBox.checked = e.nativeEvent.target.checked;
  }
  createNoRecordMessage(objAry: any) {
    const mutateResLength = objAry.length;
    const retVal = [];
    for (let x = 0; x < mutateResLength; x++) {
      const tempObj = objAry[x];
      const vehicles = tempObj.data.getVehicleList;
      const length = vehicles.length;
      if (length === 0) {
        retVal.push(
          <h4 className="ptl-06">No Record Found</h4>
        );
      }
    }
    return retVal;
  }


  createVehicleRows(objAry: any) {
    let { search } = this.state.vehicleData;
    search = search.trim();
    const mutateResLength = objAry.length;
    const retVal = [];
    for (let x = 0; x < mutateResLength; x++) {
      const tempObj = objAry[x];
      const vehicles = tempObj.data.getVehicleList;
      const length = vehicles.length;
      for (let i = 0; i < length; i++) {
        const vehicle = vehicles[i];
        if(search){
          if(vehicle.vehicleNumber.indexOf(search) !== -1){
            retVal.push(
              <tr key={vehicle.id}>
                <td>
                  <input onClick={(e: any) => this.onClickCheckbox(i, e)} checked={vehicle.isChecked} type="checkbox" name="" id={"chk" + vehicle.id} />
                </td>
                <td>
                <Link
                  className="table-link link-color"
                  to={`/plugins/ems-transport/page/vehicle?id=${vehicle.id}`}
                >
                  {vehicle.vehicleNumber}
                </Link>
              </td>
                <td>{vehicle.vehicleType}</td>
                <td>{vehicle.capacity}</td>
                <td>{vehicle.id}</td>
                <td>{vehicle.strValidTill}</td>
                <td>{vehicle.transportRoute.routeName}</td>
                <td>{vehicle.employee.employeeName}</td>
                <td>{vehicle.employee.primaryContactNo}</td>
              </tr>
            );
          }
        } else{
          retVal.push(
            <tr key={vehicle.id}>
              <td>
                <input onClick={(e: any) => this.onClickCheckbox(i, e)} checked={vehicle.isChecked} type="checkbox" name="" id={"chk" + vehicle.id} />
              </td>
              <td>
              <Link
                  className="table-link link-color"
                  to={`/plugins/ems-transport/page/vehicle?id=${vehicle.id}`}
                >
                  {vehicle.vehicleNumber}
                </Link>
                </td>
                <td>{vehicle.vehicleType}</td>
                <td>{vehicle.capacity}</td>
                <td>{vehicle.id}</td>
                <td>{vehicle.strValidTill}</td>
                <td>{vehicle.transportRoute.routeName}</td>
                <td>{vehicle.employee.employeeName}</td>
                <td>{vehicle.employee.primaryContactNo}</td>
            </tr>
          );
        }
      }
    }

    return retVal;
  }

  onChange = (e: any) => {
    const { search } = e.nativeEvent.target;
    const { name, value } = e.nativeEvent.target;
    const { vehicleData } = this.state;
    if (name === "transportRoute") {
      this.setState({
        vehicleData: {
          ...vehicleData,
          transportRoute: {
            id: value
          },
          vehicle: {
            id: ""
          },
        }
      });
    } else if (name === "vehicle") {
      this.setState({
        vehicleData: {
          ...vehicleData,
          vehicle: {
            id: value
          }
        }
      });
    } else {
      this.setState({
        vehicleData: {
          ...vehicleData,
          [name]: value
        }
      });
    }
  }
 

  onClick = (e: any) => {
    const { name, value } = e.nativeEvent.target;
    const { mutate } = this.props;
    const { vehicleData } = this.state;
    e.preventDefault();

    let vehicleFilterInputObject = {
      transportRouteId: vehicleData.transportRoute.id,
      vehicleId: vehicleData.vehicle.id
    };


    return mutate({
      variables: { filter: vehicleFilterInputObject },
    }).then(data => {
      const vdt = data;
      vehicleData.mutateResult = [];
      vehicleData.mutateResult.push(vdt);
      this.setState({
        vehicleData: vehicleData
      });
      console.log('Vehicle filter mutation result ::::: ', vehicleData.mutateResult);
    }).catch((error: any) => {
      console.log('there was an error sending the query result', error);
      return Promise.reject(`Could not retrieve vehicle data: ${error}`);
    });

  }

  render() {
    const { data: { createVehicleDataCache, refetch }, mutate } = this.props;
    const { vehicleData } = this.state;
    // { studentData.filter((this.state.search)).map() }
    return (
      <section className="customCss">
        <h3 className="bg-heading-bgStudent p-1 mb-1">
          <i className="fa fa-university stroke-transparent mr-1" aria-hidden="true" />{' '}
          Transport Management
        </h3>
        <div className="container-fluid p-1 ">
          <div className="m-b-1 bg-heading-bgStudent studentListFlex">
            <div className="">
              <h4 className="ptl-06">Vehicle Details</h4>
            </div>
          </div>

          <div>
            <div className="student-flex">
              <div>
                <label htmlFor="">Route ID</label>
                <select name="transportRoute" id="transportRoute" onChange={this.onChange} value={vehicleData.transportRoute.id} className="gf-form-input max-width-22">
                  {this.createTransportRoutes(this.props.data.createVehicleDataCache.transportRoutes)}
                </select>
              </div>
              <div>
                <label htmlFor="">Vehicle ID</label>
                <select required name="vehicle" id="vehicle" onChange={this.onChange} value={vehicleData.vehicle.id} className="gf-form-input max-width-22">
                  {this.createVehicles(this.props.data.createVehicleDataCache.vehicles, vehicleData.transportRoute.id)}
                </select>
              </div>
             

              <div className="margin-bott max-width-22">
                <label htmlFor="">Vehicle Number</label>
                <input type="text" name="search" value={vehicleData.search} onChange={this.onChange} />
              </div>
            <div className="m-b-1 bg-heading-bg studentSearch">
              {/* <h4 className="ptl-06"></h4> */}
              <button className="btn btn-primary max-width-13" id="btnFind" name="btnFind" onClick={this.onClick} style={w180}>Search Vehicles</button>
            </div>
            </div>
            <table id="vehiclelistpage" className="striped-table fwidth bg-white">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" onClick={(e: any) => this.checkAllVehicles(e)} value="checkedall" name="" id="chkCheckedAll" />
                  </th>
                  <th>Vehicle Number</th>
                  <th>Vehicle Type</th>
                  <th>No Of Seats</th>
                  <th>Vehicle ID</th>
                  <th>Insurance Validity</th>
                  <th>Route Assigned</th>
                  <th>Driver Name</th>
                  <th>Contact No</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.createVehicleRows(this.state.vehicleData.mutateResult)
                }
              </tbody>
            </table>
            {/* <Pagination /> */}
            {
              this.createNoRecordMessage(this.state.vehicleData.mutateResult)
            }
          </div>
        </div>
      </section>

    );
  }
}
export default withVehicleFilterDataCacheLoader(

  compose(
    graphql<VehicleListQuery, VehicleRootProps>(VehicleListQueryGql, {
      name: "mutate"
    })

  )
    (VehiclesTable) as any
);