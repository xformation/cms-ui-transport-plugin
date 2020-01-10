

import * as React from 'react';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import {NavItem,NavLink} from 'reactstrap';
import { graphql, QueryProps, MutationFunc, compose } from "react-apollo";
import { LOAD_VEHICLE_FILTER_DATA_CACHE_QUERY, VEHICLE_LIST_QUERY,ADD_ROUTE_MUTATION } from '../_queries';
import withLoadingHandler from '../withLoadingHandler';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import AddVehiclePage from './AddVehiclePage';
//import '../../../css/college-settings.css';
//import '../../../css/tabs.css'; 

const w180 = {
    width: '180px'
};

type VehicleTableStates = {
  vehicles: any,
  vehicleData: any,
  transportRoutes: any,
  pageSize: any,
  isModalOpen: any,
  isModalOpen1: any,
  routeFrequencies: any,
  search: any
};

class VehiclesTable extends React.Component<any, VehicleTableStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      isModalOpen: false,
      isModalOpen1: false,
      vehicles: {},
      vehicleData: {
        routeName:"",
        routeDetails:"",
        routeMapUrl:"",
        noOfStops:"",
        transportRoute: {
          id: ""
        },
        vehicle: {
          id: ""
        },
        routeFrequency: {
          id:""
        },
        mutateResult: [],
        search: ""
      },
      transportRoutes: [],
      routeFrequencies: [],
      pageSize: 5,
      search: ''

    };
    this.createVehicles = this.createVehicles.bind(this);
    this.createTransportRoutes = this.createTransportRoutes.bind(this);
    this.createRouteFrequencies =  this.createRouteFrequencies.bind(this);
    this.showModal = this.showModal.bind(this);
    this.showModal1 = this.showModal1.bind(this);
    // this.searchHandlers = this.searchHandlers.bind(this);
    this.saveRoute = this.saveRoute.bind(this);
    this.checkAllVehicles = this.checkAllVehicles.bind(this);
    this.onClickCheckbox = this.onClickCheckbox.bind(this);
    this.createVehicleRows = this.createVehicleRows.bind(this);
    this.createNoRecordMessage = this.createNoRecordMessage.bind(this);
  }
  // createRouteFrequencies(routeFrequencies: any) {
  //   let routeFrequenciesOptions = [<option key={""} value="">Select Route Frequency</option>];
  //   for (let i = 0; i < routeFrequencies.length; i++) {
  //       let routeFrequency = routeFrequencies[i];
  //       routeFrequenciesOptions.push(
  //           <option key={routeFrequencies[i].description} value={routeFrequencies[i].description}>{routeFrequencies[i].description}</option>
  //       );
  //   }
  //   return routeFrequenciesOptions;
  //   }
    
    createRouteFrequencies(routeFrequencies: any) {
    let routeFrequenciesOptions = [<option key={""} value="">Select Type Of Insurance</option>];
    for (let i = 0; i < routeFrequencies.length; i++) {
        let typeOfInsurance = routeFrequencies[i];
        routeFrequenciesOptions.push(
            <option key={routeFrequencies[i].description} value={routeFrequencies[i].description}>{routeFrequencies[i].description}</option>
        );
    }
    return routeFrequenciesOptions;
    }

  // createTransportRoutes(transportRoutes: any) {
  //   let transportRoutesOptions = [<option key={0} value="">Select RouteId</option>];
  //   for (let i = 0; i < transportRoutes.length; i++) {
  //     transportRoutesOptions.push(
  //       <option key={transportRoutes[i].id} value={transportRoutes[i].id}>{transportRoutes[i].id}</option>
  //     );
  //   }
  //   return transportRoutesOptions;
  // }

  createTransportRoutes(transportRoutes: any) {
    let transportRoutesOptions = [<option key={0} value="">Select RouteId</option>];
    for (let i = 0; i < transportRoutes.length; i++) {
      let transportRoute = transportRoutes[i]
      transportRoutesOptions.push(
        <option key={transportRoutes[i].id} value={transportRoutes[i].id}>{transportRoutes[i].routeName}</option>
      );
    }
    return transportRoutesOptions;
  }

  
  createVehicles(vehicles: any) {
    let vehiclesOptions = [<option key={0} value="">Select VehicleId</option>];
    for (let i = 0; i < vehicles.length; i++) {
      let vehicle = vehicles[i]
      vehiclesOptions.push(
        <option key={vehicles[i].id} value={vehicles[i].id}>{vehicles[i].vehicleNumber}</option>
      );
    }
    return vehiclesOptions;
  }
  
  // createVehicles(vehicles: any, selectedTransportRouteId: any) {
  //   let vehiclesOptions = [<option key={0} value="">Select VehicleId</option>];
  //   for (let i = 0; i < vehicles.length; i++) {
  //     if (selectedTransportRouteId == vehicles[i].transportRoute.id) {
  //       vehiclesOptions.push(
  //         <option key={vehicles[i].id} value={vehicles[i].id}>{vehicles[i].id}</option>
  //       );
  //     }
  //   }
  //   return vehiclesOptions;
  // }


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
  
                  {vehicle.vehicleNumber}
                
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
                  {vehicle.vehicleNumber}
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
          routeFrequency: {
            id:""
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
          routeFrequency: {
            id:""
          },
        }
      });
    }
    else if (name === "routeFrequency") {
      this.setState({
        vehicleData: {
          ...vehicleData,
          routeFrequency: {
            id:value
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


    return getVehicleList({
      variables: { filter: vehicleFilterInputObject },
    }).then((data: any) => {
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
  // toggleTab(tabNo: any) {
  //   this.setState({
  //     activeTab: tabNo,
  //   });
  // }

  saveRoute(e: any) {
    const { id, value } = e.nativeEvent.target;
    const { addTransportRoute } = this.props;
    const { vehicleData } = this.state;
    e.preventDefault();
  
    let txtRn: any = document.querySelector("#routeName");
    if (txtRn.value.trim() === "") {
      alert("Please provide some value in Route Name");
      return;
    }
    let txtRd: any = document.querySelector("#routeDetails");
    if (txtRd.value.trim() === "") {
      alert("Please provide some value in Route Details");
      return;
    }
    let txtRmu: any = document.querySelector("#routeMapUrl");
    if (txtRmu.value.trim() === "") {
      alert("Please provide some value in Route Map Url");
      return;
    }
    let txtNop: any = document.querySelector("#noOfStops");
    if (txtNop.value.trim() === "") {
      alert("Please provide some value in No Of Stops");
      return;
    }
    let txtRf: any = document.querySelector("#routeFrequency");
    if (txtRf.value.trim() === "") {
      alert("Please provide some value in Route Frequency");
      return;
    }
    let addTransportRouteInput = {
      routeName: vehicleData.routeName,
      routeDetails: vehicleData.routeDetails,
      routeMapUrl: vehicleData.routeMapUrl,
      noOfStops: vehicleData.noOfStops,
      routeFrequency: vehicleData.routeFrequency.id,
      
    };
    console.log("form data : ", vehicleData);
    return addTransportRoute({
      variables: { input: addTransportRouteInput }
    }).then((data:any) => {
      console.log('Add Route ::::: ', data);
      alert("Route added successfully!");
      const sdt = data;
      vehicleData.vehicleData = [];
      vehicleData.vehicleData.push(sdt);
      this.setState({
        vehicleData: vehicleData
      });
  
    }).catch((error: any) => {
      alert("Due to some error Route could not be added");
      console.log('there was an error sending the add Route mutation result', error);
      return Promise.reject(`Could not retrieve add Route data: ${error}`);
    });
  }

  showModal(e: any, bShow: boolean) {
    e && e.preventDefault();
    this.setState(() => ({
        isModalOpen: bShow
    }));
  }

  showModal1(e: any, bShow: boolean) {
    e && e.preventDefault();
    this.setState(() => ({
        isModalOpen1: bShow
    }));
  }
 



  render() {
    const { data: { createVehicleDataCache, refetch }, mutate } = this.props;
    const { vehicleData,isModalOpen,isModalOpen1 } = this.state;
    // { studentData.filter((this.state.search)).map() }
    return (
      <section className="customCss">
        <button className="btn btn-primary pull-right" onClick={e => this.showModal(e, true)}>ADDVEHICLE</button>
        <Modal isOpen={isModalOpen} className="react-strap-modal-container">
                <ModalHeader>Add New Vehicle</ModalHeader>
                <ModalBody className="modal-content">
                  <div className="m-t-1 text-center">
                      <AddVehiclePage/>
                      <button className="btn btn-danger pull-right" onClick={(e) => this.showModal(e, false)}>Cancel</button>
                  </div>
                </ModalBody>
         </Modal>
         
          <section>
            <button className="btn btn-primary pull-right" onClick={e => this.showModal1(e, true)}>Add Route</button>
            <Modal isOpen={isModalOpen1} className="react-strap-modal-container">
                <ModalHeader>Add New Route</ModalHeader>
                <ModalBody className="modal-content">
                  <div className="m-t-1 text-center">      
                      <div className="border ThirdRow  p-1">
                        <div className="Srow">
                         <div className="firstColumn">
						               <div>
                             <label htmlFor="">Route Name</label>
                             <input type="text"  className="fwidth" style={{ width: '150px' }} id="routeName" name="routeName" onChange={this.onChange} value={vehicleData.routeName} />
						               </div>
						               <div>
                              <label htmlFor="">Route Details</label>
							                <input type="text"  className="fwidth" style={{ width: '150px' }} id="routeDetails" name="routeDetails" onChange={this.onChange} value={vehicleData.routeDetails} />
                           </div>
						               <div>
							                <label htmlFor="">Route Map Url</label>
                              <input type="text" className="fwidth" style={{ width: '150px' }} id="routeMapUrl" name="routeMapUrl" onChange={this.onChange} value={vehicleData.routeMapUrl} />
                           </div>
                           </div>
							             <div className="secondColumn">
						                <div>
							                 <label htmlFor="">No Of Stops</label>
                               <input type="text"  className="fwidth" style={{ width: '150px' }} id="noOfStops" name="noOfStops" onChange={this.onChange} value={vehicleData.noOfStops} />
                           </div>
						               <div>
							               <label htmlFor="">Route Frequency</label>
                             <select required name="routeFrequency" id="routeFrequency" onChange={this.onChange} value={vehicleData.routeFrequency.id} >
                              {this.createRouteFrequencies(this.props.data.createVehicleDataCache.routeFrequencies)}
                            </select>
						              </div>
                        </div>
                        </div>
                        </div>
                <button className="btn btn-primary pull-right" type="button" id="btnSaveContract" name="btnSaveContract" onClick={this.saveRoute} style={{width: '120px'}}>Save Route</button>
                <button className="btn btn-danger pull-right" onClick={(e) => this.showModal1(e, false)}>Cancel</button>
              </div>
            </ModalBody>
            </Modal>
          </section>
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
                  {this.createVehicles(this.props.data.createVehicleDataCache.vehicles)}
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

export default graphql(LOAD_VEHICLE_FILTER_DATA_CACHE_QUERY, {
    options: ({ }) => ({
      variables: {
       
      }
    })
  })(withLoadingHandler(
    compose(
      graphql(VEHICLE_LIST_QUERY, { name: "getVehicleList" }),
      graphql(ADD_ROUTE_MUTATION, { name: "addTransportRoute" }),
    )
      (VehiclesTable) as any
  ));