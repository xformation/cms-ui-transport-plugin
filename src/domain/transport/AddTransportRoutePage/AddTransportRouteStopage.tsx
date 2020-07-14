import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { commonFunctions } from '../../_utilites/common.functions';
import "../../../css/custom.css"
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
import { ADD_ROUTE_MUTATION, ADD_STOPAGE_MUTATION, ADD_TRANSPORTROUTE_STOP_MUTATION  } from '../_queries';
import moment = require('moment');
import wsCmsBackendServiceSingletonClient from '../../../wsCmsBackendServiceClient';

export interface VehicleProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    transportRouteList?: any;
    vehicleFilterCacheList?: any;
    transportRoute: any;
    stopage: any;
    onSaveUpdate?: any;
    user?:any;
}

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in Transportroutestopage service, Transportroutestopage could not be saved. Please check Transportroutestopage service logs";
const SUCCESS_MESSAGE_TRANSPORTROUTESTOPAGE_ADDED = "New TransportRouteStopage saved successfully";
const SUCCESS_MESSAGE_TRANSPORTROUTESTOPAGE_UPDATED = "Transportroutestopage updated successfully";
// const ERROR_MESSAGE_INSURANCE_FIELD = "select one insurance for one vehicle only"

class TransportRouteStopageList<T = {[data: string]: any}> extends React.Component<VehicleProps, any> {
    constructor(props: VehicleProps) {
        super(props);
        this.state = {
            transportRouteList: this.props.transportRouteList,
            vehicleFilterCacheList: this.props.vehicleFilterCacheList,
            isModalOpen: false,
            transportRouteObj: {
                stopage:{
                    id:""
                },
                transportRoute:{
                    id:""
                },
                stopageId:"",
                transportRouteId:"",
            },
            errorMessage: "",
            successMessage: "",
            modelHeader: ""
        };
        this.createTransportRoute = this.createTransportRoute.bind(this);
        this.createStopage = this.createStopage.bind(this);  
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
  createStopage(stopage: any) {
    let stopageOptions = [
      <option key={0} value="">
        Select StopageName 
      </option>,
    ];
    for (let i = 0; i < stopage.length; i++) {
        stopageOptions.push(
        <option key={stopage[i].id} value={stopage[i].id}>
          {stopage[i].stopageName}
        </option>
      );
    }
    return stopageOptions;
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
            stopageId: transportRouteObj.stopageId,
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
        if(obj.stopageId === undefined || obj.stopageId === null || obj.stopageId === ""){
          commonFunctions.changeTextBoxBorderToError((obj.stopageId === undefined || obj.stopageId === null) ? "" : obj.stopageId, "stopageId");
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
            mutation: ADD_TRANSPORTROUTE_STOP_MUTATION,
            variables: { 
                input: inp
            },
        }).then((resp: any) => {
            console.log("Success in saveTransportRouteStopageLink Mutation. Exit code : ",resp.data.saveTransportRouteStopageLink.cmsTransportRouteStopageLinkVo.exitCode);
            exitCode = resp.data.saveTransportRouteStopageLink.cmsTransportRouteStopageLinkVo.exitCode;
            let temp = resp.data.saveTransportRouteStopageLink.cmsTransportRouteStopageLinkVo.dataList; 
            console.log("New TransportRouteStopage list : ", temp);
            this.setState({
                transportRouteList: temp
            });
        }).catch((error: any) => {
            exitCode = 1;
            console.log('Error in saveTransportRouteStopageLink : ', error);
        });
        btn && btn.removeAttribute("disabled");
        
        let errorMessage = "";
        let successMessage = "";
        if(exitCode === 0 ){
            successMessage = SUCCESS_MESSAGE_TRANSPORTROUTESTOPAGE_ADDED;
            if(inp.id !== null){
                successMessage = SUCCESS_MESSAGE_TRANSPORTROUTESTOPAGE_UPDATED;
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
                             <h5 className="mtf-8 dark-gray">TransportRoute Stopage Details</h5>
                            </div>
                            <div id="headerRowDiv" className="b-1 h5-fee-bg j-between">
                            <div className="m-1 fwidth">Add TransportRoute Stopage Data</div>
                            <div id="saveRouteCatDiv" className="fee-flex">
                            <button className="btn btn-primary mr-1" id="btnSaveFeeCategory" name="btnSaveFeeCategory" onClick={this.addTransportRoute} style={{ width: '140px' }}>Add Route Stopage</button>
                            {/* <button className="btn btn-primary mr-1" id="btnUpdateFeeCategory" name="btnUpdateFeeCategory" onClick={this.addLibrary} style={{ width: '170px' }}>Update Book</button> */}
                            </div>
                            </div>
                                <div className="mdflex modal-fwidth"> 
                                  <div className="fwidth-modal-text m-r-1">
                                <label htmlFor="">TransportRoute<span style={{ color: 'red' }}> * </span></label>
                                 <select required name="transportRouteId" id="transportRouteId" onChange={this.onChange}  value={transportRouteObj.transportRouteId} className="gf-form-label b-0 bg-transparent">
                                    {this.createTransportRoute(vehicleFilterCacheList.transportRoute)}
                                </select>
                                 </div>
                                 </div>
                                <div className="mdflex modal-fwidth"> 
                                  <div className="fwidth-modal-text m-r-1">
                                <label htmlFor="">Stopage<span style={{ color: 'red' }}> * </span></label>
                                 <select required name="stopageId" id="stopageId" onChange={this.onChange}  value={transportRouteObj.stopageId} className="gf-form-label b-0 bg-transparent">
                                    {this.createStopage(vehicleFilterCacheList.stopage)}
                                </select>
                                 </div>
                                 </div> 
                          </section>
 
        );
    }
}

export default withApollo(TransportRouteStopageList);