import * as React from 'react';
import * as _ from 'lodash';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import {NavItem,NavLink, TabPane, TabContent} from 'reactstrap';
import { graphql, QueryProps, MutationFunc, compose, withApollo } from "react-apollo";
import {GET_VEHICLE_LIST,VEHICLE_DATA_CACHE, INSURANCE_DATA_CACHE} from '../_queries';
import withLoadingHandler from '../withLoadingHandler';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import wsCmsBackendServiceSingletonClient from '../../../wsCmsBackendServiceClient';
// import VehicleDetails from './VehicleDetails';

const w180 = {
    width: '180px',
    marginBottom: '5px'
};

type VehicleTableStates = {
  user:any,
  vehicles: any,
  vehicleData: any,
//   transportRoute: any,
//   employee: any,
  vehicleContractLink: any,
  insurance: any,
  vehicle: any,
  pageSize: any,
  search: any,
  activeTab: any,
  vObj: any,
  vehicleFilterCacheList: any,
  insuranceFilterCacheList: any,
};

export interface VehicleListProps extends React.HTMLAttributes<HTMLElement> {
    [data: string]: any;
    user?: any;
    insuranceFilterCacheList?:any;
    vehicleFilterCacheList?: any;
  }

class VehiclesTable<T = {[data: string]: any}> extends React.Component<VehicleListProps, VehicleTableStates> {
  constructor(props: VehicleListProps) {
    super(props);
    this.state = {
      activeTab: 4,
      vObj: {},
      user: this.props.user,
      // vehicleFilterCacheList: this.props.vehicleFilterCacheList,
      insuranceFilterCacheList:this.props.insuranceFilterCacheList,
      vehicleFilterCacheList:this.props.vehicleFilterCacheList,
      vehicles: {},
      vehicleData: {
    //    transportRoute: {
    //       id: ""
    //     },
        vehicle: {
          id: ""
        },
        vehicleContractLink:{
          id:""
        },
        insurance:{
          id:""
        },
        // employee:{
        //   id:""
        // },
        mutateResult: [],
        search: ""
      },
    //   transportRoute: [],
    //   employee:[],
      vehicleContractLink: [],
      insurance: [],
      vehicle:[],
      pageSize: 5,
      search: ''

    };
    this.createVehicles = this.createVehicles.bind(this);
    // this.createDrivers = this.createDrivers.bind(this);
    // this.createTransportRoutes = this.createTransportRoutes.bind(this);
    this.createVehicleContract = this.createVehicleContract.bind(this);
    this.createInsurance = this.createInsurance.bind(this);
    this.getcreateVehicleDataCache = this.getcreateVehicleDataCache.bind(this);
    this.getcreateInsuranceDataCache = this.getcreateInsuranceDataCache.bind(this);
    this.showDetail = this.showDetail.bind(this);
    this.SetObject = this.SetObject.bind(this);

    this.checkAllVehicles = this.checkAllVehicles.bind(this);
    this.onClickCheckbox = this.onClickCheckbox.bind(this);
    this.createVehicleRows = this.createVehicleRows.bind(this);
    this.createNoRecordMessage = this.createNoRecordMessage.bind(this);
    this.toggleTab = this.toggleTab.bind(this);
    this.registerSocket = this.registerSocket.bind(this);

  }
    
  async componentDidMount(){
    await this.registerSocket();
  }
  
  async toggleTab(tabNo: any) {
    await this.setState({
      activeTab: tabNo,
    });
  }


 async registerSocket() {
    const socket = wsCmsBackendServiceSingletonClient.getInstance();
 }
  //   socket.onmessage = (response: any) => {
  //       let message = JSON.parse(response.data);
  //       console.log("Vehicle Index. message received from server ::: ", message);
  //       this.setState({
  //           branchId: message.selectedBranchId,
  //           academicYearId: message.selectedAcademicYearId,
  //           departmentId: message.selectedDepartmentId,
  //       });
  //       console.log("Vehicle Index. branchId: ",this.state.branchId);
  //       console.log("Vehicle Index. departmentId: ",this.state.departmentId);  
  //       console.log("Vehicle Index. ayId: ",this.state.academicYearId);  
  //   }

  //   socket.onopen = () => {
  //       console.log("Vehicle Index. Opening websocekt connection to cmsbackend. User : ",this.state.user.login);
  //       socket.send(this.state.user.login);
  //   }

  //   window.onbeforeunload = () => {
  //       console.log("Vehicle. Closing websocket connection with cms backend service");
  //   }
  // }

//   createTransportRoutes(transportRoute: any) {
//     let transportRoutesOptions = [<option key={0} value="">Select RouteId</option>];
//     for (let i = 0; i < transportRoute.length; i++) {
//       // let transportRoute = transportRoutes[i]
//       transportRoutesOptions.push(
//         <option key={transportRoute[i].id} value={transportRoute[i].id}>{transportRoute[i].id}</option>
//       );
//     }
//     return transportRoutesOptions;
//   }

async getcreateVehicleDataCache(){
  console.log("Refreshing vehicle list");
  const {data} = await this.props.client.query({
    query: VEHICLE_DATA_CACHE,
      variables: {
      },
    
    fetchPolicy: 'no-cache',
  });
  this.setState({
    vehicleFilterCacheList: data,
  });
}
  async getcreateInsuranceDataCache() {
    console.log("Refreshing vehicle list");
    const {data} = await this.props.client.query({
      query: INSURANCE_DATA_CACHE,
        variables: {
        },
      
      fetchPolicy: 'no-cache',
    });
    this.setState({
        insuranceFilterCacheList: data,
    });
  }
  
  createVehicles(vehicle: any) {
    let vehiclesOptions = [
    <option key={0} value="">
      Select VehicleId
      </option>];
    for (let i = 0; i < vehicle.length; i++) {
      // let vehicle = vehicles[i]
      vehiclesOptions.push(
        <option key={vehicle[i].id} value={vehicle[i].id}>{vehicle[i].id}</option>
      );
    }
    return vehiclesOptions;
  }
    createVehicleContract(vehicleContractLink: any) {
      let vehicleContractLinkOptions = [
        <option key={0} value="">
          Select VehicleContract
        </option>,
      ];
      for (let i = 0; i < vehicleContractLink.length; i++) {
        vehicleContractLinkOptions.push(
          <option key={vehicleContractLink[i].id} value={vehicleContractLink[i].id}>
            {vehicleContractLink[i].id}
          </option>
        );
      }
      return vehicleContractLinkOptions;
    }

    createInsurance(insurance: any) {
      let insuranceOptions = [
        <option key={0} value="">
          Select Insurance
        </option>,
      ];
      for (let i = 0; i < insurance.length; i++) {
        insuranceOptions.push(
          <option key={insurance[i].id} value={insurance[i].id}>
            {insurance[i].id}
          </option>
        );
      }
      return insuranceOptions;
    }

//   createDrivers(employee: any) {
//     let employeesOptions = [<option key={0} value="">Select DriverId</option>];
//     for (let i = 0; i < employee.length; i++) {
//         employeesOptions.push(
//           <option key={employee[i].id} value={employee[i].id}>{employee[i].id}</option>
//         );
//       }
    
//     return employeesOptions;
//   }

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
          // if(vehicle.vehicleNumber.indexOf(search) !== -1){
            retVal.push(
              <tr key={vehicle.id}>
                <td>
                  <input onClick={(e: any) => this.onClickCheckbox(i, e)} 
                  checked={vehicle.isChecked} 
                  type="checkbox" 
                  name="chk" 
                  id={"chk" + vehicle.id} />
                </td>
                <td>{vehicle.id}</td>
                <td>  
                {/* <a onClick={(e: any) => this.showDetail(vehicle, e)}
                 style={{color: '#307dc2'}}
                > */}

                  {vehicle.vehicleContractLink.vehicle.vehicleNumber}
                {/* </a> */}
              </td>
                <td>{vehicle.vehicleContractLink.vehicle.capacity}</td>
                <td>{vehicle.vehicleContractLink.vehicle.status}</td>
                <td>{vehicle.vehicleContractLink.contract.vendorName}</td>

                <td>{vehicle.insurance.insuranceCompany}</td>
                {/* <td>{vehicle.transportRoute.routeName}</td>
                <td>{vehicle.transportRoute.noOfStops}</td>
                <td>{vehicle.transportRoute.routeFrequency}</td>
                <td>{vehicle.employee.employeeName} </td>
                <td>{vehicle.employee.designation}</td> */}
              </tr>
            );
            console.log('print vehicle obj:', vehicle);
          
        } else{
          retVal.push(
            <tr key={vehicle.id}>
              <td>
                <input onClick={(e: any) => this.onClickCheckbox(i, e)} 
                checked={vehicle.isChecked} 
                type="checkbox" 
                name="chk" 
                id={"chk" + vehicle.id} />
              </td>
              <td>{vehicle.id}</td>
              <td>
              {/* <a onClick={(e: any) => this.showDetail(vehicle, e)}>
                  {vehicle.vehicleNumber}
                </a>
               </td>
               <td>{vehicle.vehicleType}</td>
                <td>{vehicle.capacity}</td>
                <td>{vehicle.status}</td> */}
                {/* <a onClick={(e: any) => this.showDetail(vehicle, e)}
                 style={{color: '#307dc2'}}
                > */}

                  {vehicle.vehicleContractLink.vehicle.vehicleNumber}
                {/* </a> */}
              </td>
                <td>{vehicle.vehicleContractLink.vehicle.capacity}</td>
                <td>{vehicle.vehicleContractLink.vehicle.status}</td>
                <td>{vehicle.vehicleContractLink.contract.vendorName}</td>

                <td>{vehicle.insurance.insuranceCompany}</td>
                {/* <td>{vehicle.transportRoute.routeName}</td>
                <td>{vehicle.transportRoute.noOfStops}</td>
                <td>{vehicle.transportRoute.routeFrequency}</td>
                <td>{vehicle.employee.employeeName} </td>
                <td>{vehicle.employee.designation}</td> */}
            </tr>
          );
          console.log('print vehicle obj:', vehicle);
        }
      }
    }

    return retVal;
  }

  onChange = (e: any) => {
    const { search } = e.nativeEvent.target;
    const { name, value } = e.nativeEvent.target;
    const { vehicleData } = this.state;
    if (name === "vehicle") {
      this.setState({
        vehicleData: {
          ...vehicleData,
          vehicle: {
            id: value
          },
          vehicleContractLink: {
            id: value
          },
          insurance: {
            id: ""
          }
         
        }
      });
    }else if (name === "vehicleContractLink") {
        this.setState({
          vehicleData: {
            ...vehicleData,
            vehicleContractLink: {
              id: value
            },
            insurance: {
              id: ""
            }
           
          }
        });
      } else if (name === "insurance") {
        this.setState({
          vehicleData: {
            ...vehicleData,
            insurance: {
              id: value
            }
          }
        });
      } 
    // if (name === "transportRoute") {
    //   this.setState({
    //     vehicleData: {
    //       ...vehicleData,
    //       transportRoute: {
    //         id: value
    //       },
    //       vehicle: {
    //         id: ""
    //       },
    //       employee:{
    //         id:""
    //       }
    //     }
    //   });
    // if (name === "vehicle") {
    //   this.setState({
    //     vehicleData: {
    //       ...vehicleData,
    //       vehicle: {
    //         id: value
    //       },
    //       employee: {
    //         id:""
    //       }
    //     }
    //   });
    // } 
    // else if (name === "employee") {
    //   this.setState({
    //     vehicleData: {
    //       ...vehicleData,
    //       employee: {
    //         id: value
    //       },
    //     }
    //   });
    // } 
    else {
      this.setState({
        vehicleData: {
          ...vehicleData,
          [name]: value
        }
      });
    }
  }
  async getStDetail(obj: any, e: any) {
    await this.SetObject(obj);
    console.log('3. data in vObj:', this.state.vObj);
    await this.toggleTab(2);
  }

  async showDetail(obj: any, e: any) {
    await this.SetObject(obj);
    console.log('3. data in vObj:', this.state.vObj);
    await this.toggleTab(1);
  }

  async SetObject(obj: any) {
    console.log('1. setting object :', obj);
    await this.setState({
      vObj: obj,
    });
    console.log('2. data in obj:', obj);
  }

  onClick = (e: any) => {
    const { name, value } = e.nativeEvent.target;
    const {mutate} = this.props;
    // const { getVehicleList } = this.props;
    const { vehicleData } = this.state;
    e.preventDefault();

    let vehicleFilterInputObject = {
    //   transportRouteId: vehicleData.transportRoute.id,
    //   employeeId: vehicleData.employee.id,
    vehicleId: vehicleData.vehicle.id,
      vehicleContractLinkId: vehicleData.vehicleContractLink.id,
      insuranceId: vehicleData.insurance.id,
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

  };

  render() {
    const { vehicleFilterCacheList,insuranceFilterCacheList, vehicleData, activeTab, user,  }= this.state;
  
    return (
      <section className="customCss">
         <TabContent activeTab={activeTab}>
          <TabPane tabId={4}>
        <div className="container-fluid p-1 ">
          <div className="m-b-1 bg-heading-bgStudent studentListFlex">
            <div className="">
              <h4 className="ptl-06">Vehicle Details</h4>
            </div>
          </div>
          <div>
            <div className="student-flex">
            {/* <div>
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
              </div> */}
              {/* <div>
                <label htmlFor="">Employee Id</label>
                <select
                  required
                  name="employee"
                  id="employee"
                  onChange={this.onChange}
                  value={vehicleData.employee.id}
                  className="gf-form-input max-width-22"
                >
                  {vehicleFilterCacheList !== null &&
                  vehicleFilterCacheList !== undefined &&
                  vehicleFilterCacheList.employee !== null &&
                  vehicleFilterCacheList.employee !== undefined
                    ? this.createDrivers(
                      vehicleFilterCacheList.employee
                      )
                    : null}
                </select>
              </div> */}
              {/* <div>
                <label htmlFor="">VehicleContract Id</label>
                <select
                  required
                  name="vehicleContractLink"
                  id="vehicleContractLink"
                  onChange={this.onChange}
                  value={vehicleData.vehicleContractLink.id}
                  className="gf-form-input max-width-22"
                >
                  {vehicleFilterCacheList !== null &&
                  vehicleFilterCacheList !== undefined &&
                  vehicleFilterCacheList.vehicleContractLink !== null &&
                  vehicleFilterCacheList.vehicleContractLink !== undefined
                    ? this.createVehicleContract(
                      vehicleFilterCacheList.vehicleContractLink
                      )
                    : null}
                </select>
              </div> */}
              <div>
                    <label htmlFor="">Vehicle</label>
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
              <div>
                    <label htmlFor="">VehicleContract</label>
                    <select
                      required
                      name="vehicleContractLink"
                      id="vehicleContractLink"
                      onChange={this.onChange}
                      value={vehicleData.vehicleContractLink.id}
                      className="gf-form-input max-width-22"
                    >
                      {vehicleFilterCacheList !== null &&
                      vehicleFilterCacheList !== undefined &&
                      vehicleFilterCacheList.vehicleContractLink !== null &&
                      vehicleFilterCacheList.vehicleContractLink !== undefined
                        ? this.createVehicleContract(
                            vehicleFilterCacheList.vehicleContractLink
                          )
                        : null}
                      {/* {this.createBatches(createStudentFilterDataCache.batches, departmentId)} */}
                    </select>
                  </div>
              <div>
                <label htmlFor="">Insurance</label>
                <select
                  required
                  name="insurance"
                  id="insurance"
                  onChange={this.onChange}
                  value={vehicleData.insurance.id}
                  className="gf-form-input max-width-22"
                >
                  {vehicleFilterCacheList !== null &&
                  vehicleFilterCacheList !== undefined &&
                  vehicleFilterCacheList.insurance !== null &&
                  vehicleFilterCacheList.insurance !== undefined
                    ? this.createInsurance(
                      vehicleFilterCacheList.insurance
                      )
                    : null}
                </select>
              </div>
              {/* <div className="margin-bott max-width-22">
                <label htmlFor="">Vehicle Number</label>
                <input type="text" name="search" value={vehicleData.search} onChange={this.onChange} />
              </div> */}
            <div className="m-b-1 bg-heading-bg studentSearch">
              {/* <h4 className="ptl-06"></h4> */}
              <button className="btn btn-primary max-width-13" 
              id="btnFind" name="btnFind" 
              onClick={this.onClick} 
              style={w180}>Search Vehicles</button>
            </div>
            </div>
            <table id="studentlistpage" className="striped-table fwidth bg-white">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" 
                    onClick={(e: any) => this.checkAllVehicles(e)} 
                    value="checkedall"
                     name="" id="chkCheckedAll" />
                  </th>
                  <th>Vehicle ID</th>
                  <th>Vehicle Number</th>
                  {/* <th>Vehicle Type</th> */}
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>vendor Name</th>
                  <th>Insurance Company</th>
                 
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
        </TabPane>
        {/* <TabPane tabId={1}>
            <div className="container-fluid" style={{padding: '0px'}}> */}
              {/* <div className="m-b-1 bg-heading-bgStudent studentListFlex p-point5"> */}
                {/* <div className="">
                  <h4 className="ptl-06">Vehicle Details</h4>
                </div> */}
                {/* <div className="">
                  <a
                    className="btn btn-primary m-l-1"
                    onClick={() => {
                      this.toggleTab(4);
                    }}
                  >
                    Back
                  </a>
                  <a
                    className="btn btn-primary m-l-1"
                    onClick={(e: any) => {
                      print();
                    }}
                  >
                    Print
                  </a>
                </div> */}
              {/* </div> */}
              {/* {this.state.vObj !== null && this.state.vObj !== undefined && (
                <VehicleDetails data={this.state.vObj} />
              )} */}
            {/* </div> */}
          {/* </TabPane> */}
        </TabContent>
      </section>

    );
  }
}
export default withApollo(VehiclesTable);