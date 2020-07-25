import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { commonFunctions } from '../../_utilites/common.functions';
import "../../../css/custom.css"
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
import { ADD_CONTRACT_MUTATION, ADD_VEHICLE_DRIVER_MUTATION  } from '../_queries';
import moment = require('moment');
import wsCmsBackendServiceSingletonClient from '../../../wsCmsBackendServiceClient';

export interface VehicleProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    vehicleList?: any;
    vehicleFilterCacheList?: any;
    vehicle: any;
    employee:any;
    onSaveUpdate?: any;
    user?:any;
}

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in vehiclecontract service, vehiclecontract could not be saved. Please check vehiclecontract service logs";
const SUCCESS_MESSAGE_VEHICLE_ADDED = "New VehicleContract saved successfully";
const SUCCESS_MESSAGE_VEHICLE_UPDATED = "vehiclecontract updated successfully";
// const ERROR_MESSAGE_INSURANCE_FIELD = "select one insurance for one vehicle only"

class VehicleDriverList<T = {[data: string]: any}> extends React.Component<VehicleProps, any> {
    constructor(props: VehicleProps) {
        super(props);
        this.state = {
            vehicleList: this.props.vehicleList,
            vehicleFilterCacheList: this.props.vehicleFilterCacheList,
            isModalOpen: false,
            vehicleObj: {
                employee:{
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
                employeeName:"",
                employeeId:"",
                vehicleId:"",
            },
            errorMessage: "",
            successMessage: "",
            modelHeader: ""
        };
        this.createVehicle = this.createVehicle.bind(this);
        this.createEmployee = this.createEmployee.bind(this);  
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
  createEmployee(employee: any) {
    let employeeOptions = [
      <option key={0} value="">
        Select Driver
      </option>,
    ];
    for (let i = 0; i < employee.length; i++) {
        employeeOptions.push(
        <option key={employee[i].id} value={employee[i].id}>
          {employee[i].employeeName}
        </option>
      );
    }
    return employeeOptions;
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

    
    createVehicleDriverRow(objAry: any){
        const {source} = this.state;
        //   console.log("VEHICLE-->> ", objAry);  
          console.log("createVehicleDriverRow() - VehicleDriver list on AddVehicleDriverPage page:  ", objAry);
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
               {/* <td>{vehicleObj.employee.employeeName}</td> */}
              <td>      
            <button className="btn btn-primary" onClick={e => this.showDetail(e, true, vehicleObj, "Edit VehicleDriver")}>Edit</button>
             {/* <button className="btn btn-primary" onClick={e => this.editTransportRouteStopage(k)}>Edit</button> */}
        </td>
         </tr>
              );
          }
          return retVal;
  }
    
  showDetail(e: any, bShow: boolean, transportRouteObj: any, modelHeader: any) {
    e && e.preventDefault();
    this.setState(() => ({
        isModalOpen: bShow,
        transportRouteObj: transportRouteObj,
        source: this.props.source,
        sourceOfApplication: this.props.sourceOfApplication,
        modelHeader: modelHeader,
        errorMessage: "",
        successMessage: "",
    }));
}
   getAddVehicleDriverInput(vehicleObj: any, modelHeader: any){
        let id = null;
        if(modelHeader === "Edit VehicleDriver"){
            id = vehicleObj.id;
        }
        let input = {
            id: id,
            vehicleId: vehicleObj.vehicleId,
            employeeId:vehicleObj.employeeId,
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
        if(obj.employeeId === undefined || obj.employeeId === null || obj.employeeId === ""){
          commonFunctions.changeTextBoxBorderToError((obj.employeeId === undefined || obj.employeeId === null) ? "" : obj.employeeId, "employeeId");
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
            mutation: ADD_VEHICLE_DRIVER_MUTATION,
            variables: { 
                input: inp
            },
        }).then((resp: any) => {
            console.log("Success in saveVehicleDriverLink Mutation. Exit code : ",resp.data.saveVehicleDriverLink.cmsVehicleDriverLinkVo.exitCode);
            exitCode = resp.data.saveVehicleDriverLink.cmsVehicleDriverLinkVo.exitCode;
            let temp = resp.data.saveVehicleDriverLink.cmsVehicleDriverLinkVo.dataList; 
            console.log("New VehicleDriver list : ", temp);
            this.setState({
                vehicleList: temp
            });
        }).catch((error: any) => {
            exitCode = 1;
            console.log('Error in saveVehicleDriverLink : ', error);
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
        const inputObj = this.getAddVehicleDriverInput(vehicleObj, modelHeader);
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
             <h5 className="mtf-8 dark-gray">TransportRoute Stopage Details</h5>
            </div>
            <div id="headerRowDiv" className="b-1 h5-fee-bg j-between">
            <div className="m-1 fwidth">Add TransportRoute Stopage Data</div>
            <div id="saveRouteCatDiv" className="fee-flex">
            <button className="btn btn-primary mr-1" id="btnSaveFeeCategory" name="btnSaveFeeCategory" onClick={this.addVehicle} style={{ width: '140px' }}>Add Route Stopage</button>
            <button className="btn btn-primary mr-1" id="btnUpdateFeeCategory" name="btnUpdateFeeCategory" onClick={this.addVehicle} style={{ width: '170px' }}>Update Route Stopage</button>
            </div>
            </div>
<div id="feeCategoryDiv" className="b-1">
<div className="b1 row m-1 j-between">

<div className="mdflex modal-fwidth"> 
<div className="fwidth-modal-text m-r-1">
<label htmlFor="">Vehicle
<span style={{ color: 'red' }}> * </span>
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
<label htmlFor="">Driver<span style={{ color: 'red' }}> * </span></label>
<select required name="employeeId" id="employeeId" onChange={this.onChange}  value={vehicleObj.employeeId} className="gf-form-input fwidth">
 {this.createEmployee(vehicleFilterCacheList.employee)}
</select>
</div>
</div>
</div>
<div className="b1 row m-1">
</div> 
                 </div>

<p></p>
<div id="feeCatagoryGrid" className="b-1">
<table className="fwidth" id="feetable">
<thead >
<tr>
  <th>Id</th>
  <th>vehicle Number</th>
  <th>Vehicle Type</th>
  <th>Ownership</th>
  <th>YearOfManufacturing</th>
  <th>ManufacturingCompany</th>
  <th>Driver Name</th>
  <th>Edit</th>
</tr>
</thead>

<tbody>
{ this.createVehicleDriverRow(vehicleList) }
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

export default withApollo(VehicleDriverList);