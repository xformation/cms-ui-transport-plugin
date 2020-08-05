import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { commonFunctions } from '../../_utilites/common.functions';
import "../../../css/custom.css"
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
import { ADD_VEHICLE_MUTATION, ADD_VEHICLE_CONTRACT_MUTATION, GET_VEHICLE_CONTRACT_LIST  } from '../_queries';
import moment = require('moment');
import wsCmsBackendServiceSingletonClient from '../../../wsCmsBackendServiceClient';

export interface VehicleProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    vehicleList?: any;
    vehicleContractList?: any;
    vehicleFilterCacheList?: any;
    vehicle: any;
    contract:any;
    onSaveUpdate?: any;
    user?:any;
}

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in vehiclecontract service, vehiclecontract could not be saved. Please check vehiclecontract service logs";
const SUCCESS_MESSAGE_VEHICLECONTRACT_ADDED = "New VehicleContract saved successfully";
const SUCCESS_MESSAGE_VEHICLECONTRACT_UPDATED = "vehiclecontract updated successfully";
// const ERROR_MESSAGE_INSURANCE_FIELD = "select one insurance for one vehicle only"

class VehicleContractList<T = {[data: string]: any}> extends React.Component<VehicleProps, any> {
    constructor(props: VehicleProps) {
        super(props);
        this.state = {
          list: this.props.data,

            contractList: this.props.contractList,
            vehicleList: this.props.vehicleList,
            vehicleRouteList: this.props.vehicleRouteList,
            vehicleContractList: this.props.vehicleContractList,
            vehicleFilterCacheList: this.props.vehicleFilterCacheList,
            isModalOpen: false,
            vehicleObj: {
                contract:{
                    id:""
                },
                vehicle:{
                    id:""
                },
                vehicleNumber:"",          
	              vehicleType:"",             
	              capacity:"",               
	              ownerShip:"",             
	            // dateOfRegistration:"",     
	              yearOfManufacturing:"",    
                manufacturingCompany:"", 
                vendorName:"",
                typeOfOwnerShip:"",
                durationOfContract:"",
              // onBoardingDate: "",
                contractId:"",
                vehicleId:"",
            },
            errorMessage: "",
            successMessage: "",
            modelHeader: ""
        };
        this.createVehicle = this.createVehicle.bind(this);
        this.createContract = this.createContract.bind(this);  
        this.checkAllVehicleContracts = this.checkAllVehicleContracts.bind(this);
        this.createVehicleContractRow = this.createVehicleContractRow.bind(this);
        this.onClickCheckbox = this.onClickCheckbox.bind(this);
        this.onChange = this.onChange.bind(this);

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

    createVehicleContractRow(objAry: any){
      const {source} = this.state;
        console.log("VEHICLE -------->> ", objAry);  
        console.log("createVehicleContractRow() - VehicleContract list on AddVehicleContractPage page:  ", objAry);
        if(objAry === undefined || objAry === null) {
            return;
        }
        const mutateResLength = objAry.length;
        const retVal = [];
        for (let i = 0; i < mutateResLength; i++) {
            const vehicleObj = objAry[i];
            retVal.push(
              <tr>
             <td>{vehicleObj.id}</td>
             <td>{vehicleObj.vehicle.vehicleNumber}</td>
             <td>{vehicleObj.vehicle.vehicleType}</td>
             <td>{vehicleObj.vehicle.ownerShip}</td>
             <td>{vehicleObj.vehicle.yearOfManufacturing}</td>
             <td>{vehicleObj.vehicle.manufacturingCompany}</td>
             <td>{vehicleObj.contract.vendorName}</td>
            <td>{vehicleObj.contract.typeOfOwnerShip}</td>
            <td>{vehicleObj.contract.durationOfContract}</td>
            <td>      
          <button className="btn btn-primary" onClick={e => this.showDetail(e, true, vehicleObj, "Edit VehicleContract")}>Edit</button>

{/* <button className="btn btn-primary" onClick={e => this.editTransportRouteStopage(k)}>Edit</button> */}
</td>
</tr>
            );
        }
        return retVal;
}

    editVehicleContract(obj: any) {
      const { vehicleObj } = this.state;
      let txtVn: any = document.querySelector("#vehicleNumber");
      let txtVt: any = document.querySelector("#vehicleType");
      let txtOs: any = document.querySelector("#ownerShip");
      let txtYs: any = document.querySelector("#yearOfManufacturing");
      let txtMc: any = document.querySelector("#manufacturingCompany");
      let txtVe: any = document.querySelector("#vendorName");
      let txtTo: any = document.querySelector("#typeOfOwnerShip");
      let txtDc: any = document.querySelector("#durationOfContract");
      
      txtVn.value = obj.vehicleNumber;
      txtVt.value = obj.vehicleType;
      txtOs.value = obj.ownerShip;
      txtYs.value = obj.yearOfManufacturing;
      txtMc.value = obj.manufacturingCompany;
      txtVe.value = obj.vendorName;
      txtTo.value = obj.typeOfOwnerShip;
      txtDc.value = obj.durationOfContract;
  
      vehicleObj.vehicleRoute.id = obj.id;
      vehicleObj.vehicle.vehicleNumber = obj.vehicleNumber;
      vehicleObj.vehicle.vehicleType = obj.vehicleType;
      vehicleObj.vehicle.ownerShip = obj.ownerShip;
      vehicleObj.vehicle.yearOfManufacturing = obj.yearOfManufacturing;
      vehicleObj.vehicle.manufacturingCompany = obj.manufacturingCompany;
      vehicleObj.contract.vendorName = obj.vendorName;
      // vehicleObj.transportroute.noOfStops = obj.noOfStops;
      vehicleObj.contract.typeOfOwnerShip = obj.typeOfOwnerShip;
      vehicleObj.contract.durationOfContract = obj.durationOfContract;
  
      this.setState({
        
        vehicleObj: vehicleObj
      });
    }

  showDetail(e: any, bShow: boolean, vehicleObj: any, modelHeader: any) {
      e && e.preventDefault();
      this.setState(() => ({
          isModalOpen: bShow,
          vehicleObj: vehicleObj,
          source: this.props.source,
          sourceOfApplication: this.props.sourceOfApplication,
          modelHeader: modelHeader,
          errorMessage: "",
          successMessage: "",
      }));
  }
  showModal(e: any, bShow: boolean, headerLabel: any) {
      e && e.preventDefault();
      this.setState(() => ({
          isModalOpen: bShow,
          vehicleObj: {},
          modelHeader: headerLabel,
          errorMessage: "",
          successMessage: "",
      }));
  }
   getAddVehicleContractInput(vehicleObj: any, modelHeader: any){
        let id = null;
        if(modelHeader === "Edit VehicleContract"){
          id = vehicleObj.id;
      }
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
                vehicleContractList: temp
            });
        }).catch((error: any) => {
            exitCode = 1;
            console.log('Error in saveVehicleContractLink : ', error);
        });
        btn && btn.removeAttribute("disabled");
        
        let errorMessage = "";
        let successMessage = "";
        if(exitCode === 0 ){
            successMessage = SUCCESS_MESSAGE_VEHICLECONTRACT_ADDED;
            if(inp.id !== null){
                successMessage = SUCCESS_MESSAGE_VEHICLECONTRACT_UPDATED;
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
        const input = this.getAddVehicleContractInput(vehicleObj, modelHeader);
        this.doSave(input, id);
    }

  checkAllVehicleContracts(e: any){
    const { vehicleObj } = this.state;
    const mutateResLength = vehicleObj.mutateResult.length;
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
    render() {
        const {vehicleContractList, vehicleFilterCacheList,  isModalOpen, vehicleObj, modelHeader, errorMessage, successMessage} = this.state;
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
                            <button className="btn btn-primary mr-1" id="btnSaveFeeCategory" name="btnSaveFeeCategory" onClick={this.addVehicle} style={{ width: '170px' }}>Add VehicleContract</button>
                            <button className="btn btn-primary mr-1" id="btnUpdateFeeCategory" name="btnUpdateFeeCategory" onClick={this.addVehicle} style={{ width: '170px' }}>Update VehicleContract</button>
                            </div>
                            </div>
                            <div id="feeCategoryDiv" className="b-1">
                            <div className="b1 row m-1 j-between">

                                <div className="mdflex modal-fwidth"> 
                                  <div className="fwidth-modal-text m-r-1">
                                <label htmlFor="">
                                  Vehicle<span style={{ color: 'red' }}> * </span>
                                </label>
                                 <select required name="vehicleId" 
                                 id="vehicleId" 
                                 onChange={this.onChange} 
                                  value={vehicleObj.vehicleId} 
                                 className="gf-form-input fwidth">
                                    {this.createVehicle(vehicleFilterCacheList.vehicle)}
                                </select>
                                 </div>
                                  <div className="fwidth-modal-text m-r-1">
                                <label htmlFor="">
                                  Contract<span style={{ color: 'red' }}> * </span>
                                  </label>
                                 <select required name="contractId" 
                                 id="contractId" 
                                 onChange={this.onChange}  
                                 value={vehicleObj.contractId} 
                                 className="gf-form-input fwidth">
                                    {this.createContract(vehicleFilterCacheList.contract)}
                                </select>
                                 </div>
                                 </div>
                                 </div>
                                 <div className="b1 row m-1">
                           </div> 
                      </div>

          <p></p>
    <div>
    <table id="studentlistpage" className="striped-table fwidth bg-white">
            <thead >
              <tr>
                <th>Id</th>
                <th>vehicle Number</th>
                <th>Vehicle Type</th>
                <th>Ownership</th>
                <th>YearOfManufacturing</th>
                <th>ManufacturingCompany</th>
                <th>Vendor Name</th>
                <th>TypeOfOwnerShip</th>
                <th>DurationOfContract</th>
                <th>Edit</th>
              </tr>
            </thead>

            <tbody>
               { this.createVehicleContractRow(vehicleContractList) }
            </tbody> 
           </table>
          {/* {
              this.createNoRecordMessage(this.state.transportRouteObj.mutateResult)
            } */}
        </div>

         </section>
 
        );
    }
}

export default withApollo(VehicleContractList);