import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { commonFunctions } from '../../_utilites/common.functions';
import "../../../css/custom.css"
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
import { ADD_VEHICLE_MUTATION, ADD_VEHICLE_CONTRACT_MUTATION  } from '../_queries';
import moment = require('moment');
import wsCmsBackendServiceSingletonClient from '../../../wsCmsBackendServiceClient';

export interface VehicleProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    vehicleList?: any;
    vehicleFilterCacheList?: any;
    vehicle: any;
    contract:any;
    onSaveUpdate?: any;
    user?:any;
}

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in vehiclecontract service, vehiclecontract could not be saved. Please check vehiclecontract service logs";
const SUCCESS_MESSAGE_VEHICLE_ADDED = "New VehicleContract saved successfully";
const SUCCESS_MESSAGE_VEHICLE_UPDATED = "vehiclecontract updated successfully";
// const ERROR_MESSAGE_INSURANCE_FIELD = "select one insurance for one vehicle only"

class VehicleContractList<T = {[data: string]: any}> extends React.Component<VehicleProps, any> {
    constructor(props: VehicleProps) {
        super(props);
        this.state = {
            vehicleList: this.props.vehicleList,
            vehicleFilterCacheList: this.props.vehicleFilterCacheList,
            isModalOpen: false,
            vehicleObj: {
                contract:{
                    id:""
                },
                vehicle:{
                    id:""
                },
                contractId:"",
                vehicleId:"",
            },
            errorMessage: "",
            successMessage: "",
            modelHeader: ""
        };
        this.createVehicle = this.createVehicle.bind(this);
        this.createContract = this.createContract.bind(this);  
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
  createContract(contract: any) {
    let contractOptions = [
      <option key={0} value="">
        Select TypeOfContract
      </option>,
    ];
    for (let i = 0; i < contract.length; i++) {
        contractOptions.push(
        <option key={contract[i].id} value={contract[i].id}>
          {contract[i].vendorName}
        </option>
      );
    }
    return contractOptions;
  }
    onChange = (e: any) => {
        e.preventDefault();
        const { name, value } = e.nativeEvent.target;
        const { vehicleObj } = this.state;
        this.setState({
            vehicleObj: {
                ...vehicleObj,
                [name]: value
            },
            errorMessage: "",
            successMessage: "",
        });
        
        commonFunctions.restoreTextBoxBorderToNormal(name);
    }

   getAddVehicleInput(vehicleObj: any, modelHeader: any){
        let id = null;
        let input = {
            id: id,
            vehicleId: vehicleObj.vehicleId,
            contractId:vehicleObj.contractId,
        };
        return input;
    }
    validateFields(obj: any){
        let isValid = true;
        let errorMessage = ""
        if(obj.vehicleId === undefined || obj.vehicleId === null || obj.vehicleId === ""){
            commonFunctions.changeTextBoxBorderToError((obj.vehicleId === undefined || obj.vehicleId === null) ? "" : obj.vehicleId, "vehicleId");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.contractId === undefined || obj.contractId === null || obj.contractId === ""){
          commonFunctions.changeTextBoxBorderToError((obj.contractId === undefined || obj.contractId === null) ? "" : obj.contractId, "contractId");
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
            mutation: ADD_VEHICLE_CONTRACT_MUTATION,
            variables: { 
                input: inp
            },
        }).then((resp: any) => {
            console.log("Success in saveVehicleContractLink Mutation. Exit code : ",resp.data.saveVehicleContractLink.cmsVehicleContractLinkVo.exitCode);
            exitCode = resp.data.saveVehicleContractLink.cmsVehicleContractLinkVo.exitCode;
            let temp = resp.data.saveVehicleContractLink.cmsVehicleContractLinkVo.dataList; 
            console.log("New VehicleContract list : ", temp);
            this.setState({
                vehicleList: temp
            });
        }).catch((error: any) => {
            exitCode = 1;
            console.log('Error in saveVehicleContractLink : ', error);
        });
        btn && btn.removeAttribute("disabled");
        
        let errorMessage = "";
        let successMessage = "";
        if(exitCode === 0 ){
            successMessage = SUCCESS_MESSAGE_VEHICLE_ADDED;
            if(inp.id !== null){
                successMessage = SUCCESS_MESSAGE_VEHICLE_UPDATED;
            }
        }else {
            errorMessage = ERROR_MESSAGE_SERVER_SIDE_ERROR;
        }
        this.setState({
            successMessage: successMessage,
            errorMessage: errorMessage
        });
    }
    addVehicle = (e: any) => {
        const { id } = e.nativeEvent.target;
        const {vehicleObj, modelHeader} = this.state;
        let isValid = this.validateFields(vehicleObj);
        if(isValid === false){
            return;
        }
        const inputObj = this.getAddVehicleInput(vehicleObj, modelHeader);
        this.doSave(inputObj, id);
    }

    render() {
        const {vehicleList, vehicleFilterCacheList,  isModalOpen, vehicleObj, modelHeader, errorMessage, successMessage} = this.state;
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
                             <h5 className="mtf-8 dark-gray">Vehicle Contract Details</h5>
                            </div>
                            <div id="headerRowDiv" className="b-1 h5-fee-bg j-between">
                            <div className="m-1 fwidth">Add Vehicle Contract Data</div>
                            <div id="saveRouteCatDiv" className="fee-flex">
                            <button className="btn btn-primary mr-1" id="btnSaveFeeCategory" name="btnSaveFeeCategory" onClick={this.addVehicle} style={{ width: '140px' }}>Add Vehicle</button>
                            {/* <button className="btn btn-primary mr-1" id="btnUpdateFeeCategory" name="btnUpdateFeeCategory" onClick={this.addLibrary} style={{ width: '170px' }}>Update Book</button> */}
                            </div>
                            </div>
                                <div className="mdflex modal-fwidth"> 
                                  <div className="fwidth-modal-text m-r-1">
                                <label htmlFor="">Vehicle<span style={{ color: 'red' }}> * </span></label>
                                 <select required name="vehicleId" id="vehicleId" onChange={this.onChange}  value={vehicleObj.vehicleId} className="gf-form-label b-0 bg-transparent">
                                    {this.createVehicle(vehicleFilterCacheList.vehicle)}
                                </select>
                                 </div>
                                 </div>
                                <div className="mdflex modal-fwidth"> 
                                  <div className="fwidth-modal-text m-r-1">
                                <label htmlFor="">Contract<span style={{ color: 'red' }}> * </span></label>
                                 <select required name="contractId" id="contractId" onChange={this.onChange}  value={vehicleObj.contractId} className="gf-form-label b-0 bg-transparent">
                                    {this.createContract(vehicleFilterCacheList.contract)}
                                </select>
                                 </div>
                                 </div> 
                          </section>
 
        );
    }
}

export default withApollo(VehicleContractList);