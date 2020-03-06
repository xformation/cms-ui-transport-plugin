import * as React from 'react';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import {NavItem,NavLink} from 'reactstrap';
import { graphql, QueryProps, MutationFunc, compose, withApollo } from "react-apollo";
import {GET_VEHICLE_LIST} from '../_queries';
import withLoadingHandler from '../withLoadingHandler';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import wsCmsBackendServiceSingletonClient from '../../../wsCmsBackendServiceClient';

const w180 = {
    width: '180px'
};

type VehicleTableStates = {
  user:any,
  vehicle: any,
  vehicleData: any,
  transportRoute: any,
  pageSize: any,
  search: any,
  vehicleFilterCacheList: any,
  branchId: any,
  academicYearId: any,
  departmentId: any,
};

export interface VehicleListProps extends React.HTMLAttributes<HTMLElement> {
    [data: string]: any;
    vehicleFilterCacheList?: any;
  }

class VehiclesTable<T = {[data: string]: any}> extends React.Component<VehicleListProps, VehicleTableStates> {
  constructor(props: VehicleListProps) {
    super(props);
    this.state = {
       user: this.props.user,
      vehicleFilterCacheList: this.props.vehicleFilterCacheList,
      branchId: null,
      academicYearId: null,
      departmentId: null,
      vehicle: {},
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
      transportRoute: [],
      pageSize: 5,
      search: ''

    };
    this.createVehicles = this.createVehicles.bind(this);
    this.createTransportRoutes = this.createTransportRoutes.bind(this);
    this.checkAllVehicles = this.checkAllVehicles.bind(this);
    this.onClickCheckbox = this.onClickCheckbox.bind(this);
    this.createVehicleRows = this.createVehicleRows.bind(this);
    this.createNoRecordMessage = this.createNoRecordMessage.bind(this);
  }
    
  async componentDidMount(){
    await this.registerSocket();
  }

  registerSocket() {
    const socket = wsCmsBackendServiceSingletonClient.getInstance();

    socket.onmessage = (response: any) => {
        let message = JSON.parse(response.data);
        console.log("Vehicle Index. message received from server ::: ", message);
        this.setState({
            branchId: message.selectedBranchId,
            academicYearId: message.selectedAcademicYearId,
            departmentId: message.selectedDepartmentId,
        });
        console.log("Vehicle Index. branchId: ",this.state.branchId);
        console.log("Vehicle Index. departmentId: ",this.state.departmentId);  
        console.log("Vehicle Index. ayId: ",this.state.academicYearId);  
    }

    socket.onopen = () => {
        console.log("Vehicle Index. Opening websocekt connection to cmsbackend. User : ",this.state.user.login);
        socket.send(this.state.user.login);
    }

    window.onbeforeunload = () => {
        console.log("Vehicle. Closing websocket connection with cms backend service");
    }
  }
  createTransportRoutes(transportRoute: any) {
    let transportRoutesOptions = [<option key={0} value="">Select RouteId</option>];
    for (let i = 0; i < transportRoute.length; i++) {
      // let transportRoute = transportRoutes[i]
      transportRoutesOptions.push(
        <option key={transportRoute[i].id} value={transportRoute[i].id}>{transportRoute[i].id}</option>
      );
    }
    return transportRoutesOptions;
  }

  
  createVehicles(vehicle: any) {
    let vehiclesOptions = [<option key={0} value="">Select VehicleId</option>];
    for (let i = 0; i < vehicle.length; i++) {
      // let vehicle = vehicles[i]
      vehiclesOptions.push(
        <option key={vehicle[i].id} value={vehicle[i].id}>{vehicle[i].id}</option>
      );
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

  showDetail(obj: any, e: any) {
    console.log('object details:', obj);
    const {vehicleData} = this.state;
    vehicleData.id = obj.id;
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
                <a onClick={(e: any) => this.showDetail(vehicle, e)}>
                  {vehicle.vehicleNumber}
                </a>
              </td>
                <td>{vehicle.vehicleType}</td>
                <td>{vehicle.capacity}</td>
                <td>{vehicle.id}</td>
                <td>{vehicle.status}</td>
                {/* <td>{vehicle.insurance.insuranceCompany}</td> */}
                <td>{vehicle.transportRoute.routeName}</td>
                <td>{vehicle.transportRoute.noOfStops}</td>
                <td>{vehicle.transportRoute.routeFrequency}</td>
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
              <a onClick={(e: any) => this.showDetail(vehicle, e)}>
                  {vehicle.vehicleNumber}
                </a>
               </td>
               <td>{vehicle.vehicleType}</td>
                <td>{vehicle.capacity}</td>
                <td>{vehicle.id}</td>
                <td>{vehicle.status}</td>
                {/* <td>{vehicle.insurance.insuranceCompany}</td> */}
                <td>{vehicle.transportRoute.routeName}</td>
                <td>{vehicle.transportRoute.noOfStops}</td>
                <td>{vehicle.transportRoute.routeFrequency}</td>
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
          },
        }
      });
    } 
    else {
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
    const { getVehicleList } = this.props;
    const { vehicleData } = this.state;
    e.preventDefault();

    let vehicleFilterInputObject = {
      transportRouteId: vehicleData.transportRoute.id,
      vehicleId: vehicleData.vehicle.id
    };
    this.props.client
      .mutate({
        mutation: GET_VEHICLE_LIST,
        variables: {
          filter: vehicleFilterInputObject,
        },
      })
      .then((data: any) => {
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
    const { vehicleFilterCacheList,  vehicleData  }= this.state;
  
    return (
      <section className="customCss">
        <div className="container-fluid p-1 ">
          <div className="m-b-1 bg-heading-bgStudent studentListFlex">
            <div className="">
              <h4 className="ptl-06">Vehicle Details</h4>
            </div>
          </div>
          <div>
            <div className="student-flex">
            <div>
                <label htmlFor="">Route Id</label>
                <select
                  required
                  name="transportRoute"
                  id="transportRoute"
                  onChange={this.onChange}
                  value={vehicleData.transportRoute.id}
                  className="gf-form-input max-width-22"
                >
                  {vehicleFilterCacheList !== null &&
                  vehicleFilterCacheList !== undefined &&
                  vehicleFilterCacheList.transportRoute !== null &&
                  vehicleFilterCacheList.transportRoute !== undefined
                    ? this.createTransportRoutes(
                        vehicleFilterCacheList.transportRoute
                      )
                    : null}
                </select>
              </div>
              <div>
                <label htmlFor="">Vehicle Id</label>
                <select
                  required
                  name="vehicle"
                  id="vehicle"
                  onChange={this.onChange}
                  value={vehicleData.vehicle.id}
                  className="gf-form-input max-width-22"
                >
                  {vehicleFilterCacheList !== null &&
                  vehicleFilterCacheList !== undefined &&
                  vehicleFilterCacheList.vehicle !== null &&
                  vehicleFilterCacheList.vehicle !== undefined
                    ? this.createVehicles(
                        vehicleFilterCacheList.vehicle
                      )
                    : null}
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
                  <th>Vehicle ID</th>
                  <th>Vehicle Number</th>
                  <th>Vehicle Type</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Route Name</th>
                  <th>No Of Seats</th> 
                  <th>Route Frequency</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.createVehicleRows(this.state.vehicleData.mutateResult)
                }
              </tbody>
            </table>
            {
              this.createNoRecordMessage(this.state.vehicleData.mutateResult)
            }
          </div>
        </div>
      </section>

    );
  }
}
export default withApollo(VehiclesTable);