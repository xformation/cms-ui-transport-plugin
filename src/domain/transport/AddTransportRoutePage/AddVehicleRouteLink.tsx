import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { commonFunctions } from '../../_utilites/common.functions';
import "../../../css/custom.css"
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
import { ADD_VEHICLE_MUTATION, ADD_ROUTE_MUTATION, ADD_TRANSPORTROUTE_VEHICLE_MUTATION  } from '../_queries';
import moment = require('moment');
import wsCmsBackendServiceSingletonClient from '../../../wsCmsBackendServiceClient';

export interface VehicleProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    transportRouteList?: any;
    vehicleFilterCacheList?: any;
    transportRoute: any;
    vehicle: any;
    onSaveUpdate?: any;
    user?:any;
}

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in Transportroutevehicle service, Transportroutevehicle could not be saved. Please check Transportroutevehicle service logs";
const SUCCESS_MESSAGE_TRANSPORTROUTEVEHICLE_ADDED = "New TransportRouteStopage saved successfully";
const SUCCESS_MESSAGE_TRANSPORTROUTEVEHICLE_UPDATED = "Transportroutevehicle updated successfully";
// const ERROR_MESSAGE_INSURANCE_FIELD = "select one insurance for one vehicle only"

class TransportRouteStopageList<T = {[data: string]: any}> extends React.Component<VehicleProps, any> {
    constructor(props: VehicleProps) {
        super(props);
        this.state = {
            transportRouteList: this.props.transportRouteList,
            vehicleFilterCacheList: this.props.vehicleFilterCacheList,
            isModalOpen: false,
            transportRouteObj: {
                vehicle:{
                    id:""
                },
                transportRoute:{
                    id:""
                },
                vehicleId:"",
                transportRouteId:"",
            },
            errorMessage: "",
            successMessage: "",
            modelHeader: ""
        };
        this.createTransportRoute = this.createTransportRoute.bind(this);
        this.createVehicle = this.createVehicle.bind(this);
    }

  async registerSocket() {
    const socket = wsCmsBackendServiceSingletonClient.getInstance();
  }
//     socket.onmessage = (response: any) => {
//         let message = JSON.parse(response.data);
//         console.log("Vehicle Index. message received from server ::: ", message);
//         this.setState({
//             branchId: message.selectedBranchId,
//             academicYearId: message.selectedAcademicYearId,
//             departmentId: message.selectedDepartmentId,
//         });
//         console.log("Vehicle Index. branchId: ",this.state.branchId);
//         console.log("Vehicle Index. departmentId: ",this.state.departmentId);  
//         console.log("Vehicle Index. ayId: ",this.state.academicYearId);  
//     }

//     socket.onopen = () => {
//         console.log("Vehicle Index. Opening websocekt connection to cmsbackend. User : ",this.state.user.login);
//         socket.send(this.state.user.login);
//     }

//     window.onbeforeunload = () => {
//         console.log("Vehicle. Closing websocket connection with cms backend service");
//     }
//   }

  createTransportRoute(transportRoute: any) {
    let transportRouteOptions = [
      <option key={0} value="">
        Select TransportRoute
      </option>,
    ];
    for (let i = 0; i < transportRoute.length; i++) {
        transportRouteOptions.push(
        <option key={transportRoute[i].id} value={transportRoute[i].id}>
          {transportRoute[i].routeName}
        </option>
      );
    }
    return transportRouteOptions;
  }
  createVehicle(vehicle: any) {
    let vehicleOptions = [
      <option key={0} value="">
        Select Vehicle
      </option>,
    ];
    for (let i = 0; i < vehicle.length; i++) {
      vehicleOptions.push(
        <option key={vehicle[i].id} value={vehicle[i].id}>
          {vehicle[i].vehicleNumber}
        </option>
      );
    }
    return vehicleOptions;
  }
    onChange = (e: any) => {
        e.preventDefault();
        const { name, value } = e.nativeEvent.target;
        const { transportRouteObj } = this.state;
        this.setState({
            transportRouteObj: {
                ...transportRouteObj,
                [name]: value
            },
            errorMessage: "",
            successMessage: "",
        });
        
        commonFunctions.restoreTextBoxBorderToNormal(name);
    }

   getAddTransportRouteInput(transportRouteObj: any, modelHeader: any){
        let id = null;
        let input = {
            id: id,
            transportRouteId: transportRouteObj.transportRouteId,
            vehicleId: transportRouteObj.vehicleId,
        };
        return input;
    }
    validateFields(obj: any){
        let isValid = true;
        let errorMessage = ""
        if(obj.transportRouteId === undefined || obj.transportRouteId === null || obj.transportRouteId === ""){
            commonFunctions.changeTextBoxBorderToError((obj.transportRouteId === undefined || obj.transportRouteId === null) ? "" : obj.transportRouteId, "transportRouteId");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.vehicleId === undefined || obj.vehicleId === null || obj.vehicleId === ""){
            commonFunctions.changeTextBoxBorderToError((obj.vehicleId === undefined || obj.vehicleId === null) ? "" : obj.vehicleId, "vehicleId");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        this.setState({
            errorMessage: errorMessage
        });
        return isValid; 

    }
    async doSave(inp: any, id: any){
        let btn = document.querySelector("#"+id);
        btn && btn.setAttribute("disabled", "true");
        let exitCode = 0;
        
        await this.props.client.mutate({
            mutation: ADD_TRANSPORTROUTE_VEHICLE_MUTATION,
            variables: { 
                input: inp
            },
        }).then((resp: any) => {
            console.log("Success in saveTransportRouteVehicleLink Mutation. Exit code : ",resp.data.saveTransportRouteVehicleLink.cmsTransportRouteVehicleLinkVo.exitCode);
            exitCode = resp.data.saveTransportRouteVehicleLink.cmsTransportRouteVehicleLinkVo.exitCode;
            let temp = resp.data.saveTransportRouteVehicleLink.cmsTransportRouteVehicleLinkVo.dataList; 
            console.log("New TransportRouteVehcile list : ", temp);
            this.setState({
                transportRouteList: temp
            });
        }).catch((error: any) => {
            exitCode = 1;
            console.log('Error in saveTransportRouteVehicleLink : ', error);
        });
        btn && btn.removeAttribute("disabled");
        
        let errorMessage = "";
        let successMessage = "";
        if(exitCode === 0 ){
            successMessage = SUCCESS_MESSAGE_TRANSPORTROUTEVEHICLE_ADDED;
            if(inp.id !== null){
                successMessage = SUCCESS_MESSAGE_TRANSPORTROUTEVEHICLE_UPDATED;
            }
        }else {
            errorMessage = ERROR_MESSAGE_SERVER_SIDE_ERROR;
        }
        this.setState({
            successMessage: successMessage,
            errorMessage: errorMessage
        });
    }
    addTransportRoute = (e: any) => {
        const { id } = e.nativeEvent.target;
        const {transportRouteObj, modelHeader} = this.state;
        let isValid = this.validateFields(transportRouteObj);
        if(isValid === false){
            return;
        }
        const inputObj = this.getAddTransportRouteInput(transportRouteObj, modelHeader);
        this.doSave(inputObj, id);
    }

    render() {
        const {transportRouteList, vehicleFilterCacheList,  isModalOpen, transportRouteObj, modelHeader, errorMessage, successMessage} = this.state;
        return (
                            <section  className="plugin-bg-white p-1">
                            {
                                errorMessage !== ""  ? 
                                    <MessageBox id="mbox" message={errorMessage} activeTab={2}/>        
                                    : null
                            }
                            {
                                successMessage !== ""  ? 
                                    <MessageBox id="mbox" message={successMessage} activeTab={1}/>        
                                    : null
                            }
                            <div className="bg-heading px-1 dfinline m-b-1">
                             <h5 className="mtf-8 dark-gray">TransportRoute Vehicle Details</h5>
                            </div>
                            <div id="headerRowDiv" className="b-1 h5-fee-bg j-between">
                            <div className="m-1 fwidth">Add TransportRoute Vehicle Data</div>
                            <div id="saveRouteCatDiv" className="fee-flex">
                            <button className="btn btn-primary mr-1" id="btnSaveFeeCategory" name="btnSaveFeeCategory" onClick={this.addTransportRoute} style={{ width: '140px' }}>Add Route Vehicle</button>
                            {/* <button className="btn btn-primary mr-1" id="btnUpdateFeeCategory" name="btnUpdateFeeCategory" onClick={this.addLibrary} style={{ width: '170px' }}>Update Book</button> */}
                            </div>
                            </div>
                            <div id="feeCategoryDiv" className="b-1">
          <div className="b1 row m-1 j-between">
                            <div className="mdflex modal-fwidth"> 
                            <div className="fwidth-modal-text m-r-1">
                            <label htmlFor="">Vehicle<span style={{ color: 'red' }}> * </span></label>
                                 <select required name="vehicleId" id="vehicleId" onChange={this.onChange}  value={transportRouteObj.vehicleId} className="gf-form-label b-0 bg-transparent">
                                    {this.createVehicle(vehicleFilterCacheList.vehicle)}
                                </select>
                            </div>
                            <div className="fwidth-modal-text m-r-1">
                            <label htmlFor="">TransportRoute<span style={{ color: 'red' }}> * </span></label>
                                 <select required name="transportRouteId" id="transportRouteId" onChange={this.onChange}  value={transportRouteObj.transportRouteId} className="gf-form-label b-0 bg-transparent">
                                    {this.createTransportRoute(vehicleFilterCacheList.transportRoute)}
                                </select>
                            </div>
                            </div> 
                            </div>
          <div className="b1 row m-1">
          </div> 
                                 </div>  
                          </section>
 
        );
    }
}

export default withApollo(TransportRouteStopageList);