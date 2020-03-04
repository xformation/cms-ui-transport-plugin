import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { commonFunctions } from '../../_utilites/common.functions';
import "../../../css/custom.css"
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
import { ADD_VEHICLE_MUTATION  } from '../_queries';
import moment = require('moment');


export interface VehicleProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    vehicleList?: any;

}

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in vehicle service, vehicle could not be saved. Please check preferences service logs";
const SUCCESS_MESSAGE_VEHICLE_ADDED = "New Vehicle saved successfully";
const SUCCESS_MESSAGE_VEHICLE_UPDATED = "vehicle updated successfully";

class Vehicle<T = {[data: string]: any}> extends React.Component<VehicleProps, any> {
    constructor(props: VehicleProps) {
        super(props);
        this.state = {
            vehicleList: this.props.vehicleList,
            isModalOpen: false,
            vehicleObj: {
                vehicleNumber:"",
                vehicleType:"",
                capacity:"",
                ownerShip:"",
                dateOfRegistration:"",
                yearOfManufacturing:"",
                manufacturingCompany:"",
                model:"",
                chasisNo:"",
                rcNo:"",
                contactNumber:"",
                status:"",
            },
            errorMessage: "",
            successMessage: "",
            modelHeader: ""
        };
        
    }
    
    showDetail(e: any, bShow: boolean, editObj: any, modelHeader: any) {
        e && e.preventDefault();
        const { vehicleObj } = this.state;
        vehicleObj.id = editObj.id;
        vehicleObj.vehicleNumber = editObj.vehicleNumber;
        vehicleObj.vehicleType = editObj.vehicleType;
        vehicleObj.capacity = editObj.capacity;
        vehicleObj.ownerShip = editObj.ownerShip;
        vehicleObj.dateOfRegistration = moment(editObj.strDateOfRegistration,"DD-MM-YYYY").format("YYYY-MM-DD");
        vehicleObj.yearOfManufacturing = editObj.yearOfManufacturing;
        vehicleObj.manufacturingCompany = editObj.manufacturingCompany;
        vehicleObj.model = editObj.model;
        vehicleObj.chasisNo = editObj.chasisNo;
        vehicleObj.rcNo = editObj.rcNo;
        vehicleObj.contactNumber = editObj.contactNumber;
        vehicleObj.status = editObj.status;
        
        this.setState(() => ({
            isModalOpen: bShow,
            vehicleObj: vehicleObj,
            modelHeader: modelHeader,
            errorMessage: "",
            successMessage: "",
        }));
    }

    createRows(objAry: any) {
        const { source } = this.state;
        console.log("createRows() - vehicle list on vehicle page:  ", objAry);
        if(objAry === undefined || objAry === null) {
            return;
        }
        const aryLength = objAry.length;
        const retVal = [];
        for (let i = 0; i < aryLength; i++) {
            const obj = objAry[i];
            retVal.push(
              <tr >
                <td>{obj.id}</td>
                <td>{obj.vehicleNumber}</td>
                <td>{obj.vehicleType}</td>
                <td>{obj.capacity}</td>
                <td>{obj.contactNumber}</td>
                <td>{obj.strDateOfRegistration}</td>
                <td>
                    {
                        <button className="btn btn-primary" onClick={e => this.showDetail(e, true, obj, "Edit Vehicle")}>Edit</button>
                    }
                </td>
              </tr>
            );
        }
        return retVal;
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

    
    validateFields(obj: any){
        let isValid = true;
        let errorMessage = ""
        if(obj.vehicleNumber === undefined || obj.vehicleNumber === null || obj.vehicleNumber === ""){
            commonFunctions.changeTextBoxBorderToError((obj.vehicleNumber === undefined || obj.vehicleNumber === null) ? "" : obj.vehicleNumber, "vehicleNumber");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.vehicleType === undefined || obj.vehicleType === null || obj.vehicleType === ""){
            commonFunctions.changeTextBoxBorderToError((obj.vehicleType === undefined || obj.vehicleType === null) ? "" : obj.vehicleType, "vehicleType");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }

        this.setState({
            errorMessage: errorMessage
        });
        return isValid; 

    }

    getAddVehicleInput(vehicleObj: any, modelHeader: any){
        let id = null;
        if(modelHeader === "Edit Vehicle"){
            id = vehicleObj.id;
        }
        let input = {
            id: id,
            vehicleNumber: vehicleObj.vehicleNumber,
            vehicleType: vehicleObj.vehicleType,
            capacity: vehicleObj.capacity, 
            ownerShip: vehicleObj.ownerShip,
            strDateOfRegistration: moment(vehicleObj.dateOfRegistration).format("DD-MM-YYYY"),
            yearOfManufacturing: vehicleObj.yearOfManufacturing,
            manufacturingCompany: vehicleObj.manufacturingCompany,
            model: vehicleObj.model,
            chasisNo: vehicleObj.chasisNo,
            rcNo: vehicleObj.rcNo,
            contactNumber: vehicleObj.contactNumber,
            status: vehicleObj.status,
        };
        return input;
    }
    
    async doSave(inp: any, id: any){
        let btn = document.querySelector("#"+id);
        btn && btn.setAttribute("disabled", "true");
        let exitCode = 0;
        
        await this.props.client.mutate({
            mutation: ADD_VEHICLE_MUTATION,
            variables: { 
                input: inp
            },
        }).then((resp: any) => {
            console.log("Success in addVehicle Mutation. Exit code : ",resp.data.addVehicle.cmsVehicleVo.exitCode);
            exitCode = resp.data.addVehicle.cmsVehicleVo.exitCode;
            let temp = resp.data.addVehicle.cmsVehicleVo.dataList; 
            console.log("New Vehicle list : ", temp);
            this.setState({
                vehicleList: temp
            });
        }).catch((error: any) => {
            exitCode = 1;
            console.log('Error in addVehicle : ', error);
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

    save = (e: any) => {
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
        const {vehicleList, collegeList, branchList, isModalOpen, vehicleObj, modelHeader, errorMessage, successMessage} = this.state;
        return (
            <main>
                <Modal isOpen={isModalOpen} className="react-strap-modal-container" style={{height:"500px", overflow:"auto"}}>
                    <ModalHeader>{modelHeader}</ModalHeader>
                    <ModalBody className="modal-content">
                        

                        <form className="gf-form-group section m-0 dflex">
                            <div className="modal-fwidth">
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
                                {/* <div className="mdflex modal-fwidth"> */}
                                    {/* <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Branch<span style={{ color: 'red' }}> * </span></label>
                                        <select name="branchId" id="branchId" onChange={this.onChange} value={vehicleObj.branchId} className="gf-form-input">
                                        <option value="">Select Branch</option>
                                        {
                                            commonFunctions.createSelectbox(branchList, "id", "id", "branchName")
                                        }
                                        </select>
                                    </div> 
                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">College<span style={{ color: 'red' }}> * </span></label>
                                        <select name="collegeId" id="collegeId" onChange={this.onChange} value={vehicleObj.departmentId} className="gf-form-input">
                                        <option value="">Select Department</option>
                                        {
                                            commonFunctions.createSelectbox(collegeList, "id", "id", "name")
                                        }
                                        </select>
                                    </div> */}
                                {/* </div> */}

                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Vehicle Number <span style={{ color: 'red' }}> * </span></label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={vehicleObj.vehicleNumber} placeholder="Vehicle Number" name="vehicleNumber" id="vehicleNumber" maxLength={255} />
                                    </div> 

                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Vehicle Type<span style={{ color: 'red' }}> * </span></label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={vehicleObj.vehicleType} placeholder="Vehicle Type" name="vehicleType" id="vehicleType" maxLength={255} />
                                    </div>
                                </div>
                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Capacity <span style={{ color: 'red' }}> * </span></label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={vehicleObj.capacity} placeholder="Capacity" name="capacity" id="capacity" maxLength={255} />
                                    </div> 
                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Ownership<span style={{ color: 'red' }}> * </span></label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={vehicleObj.ownerShip} placeholder="ownerShip" name="ownerShip" id="ownerShip" maxLength={255} />
                                    </div>
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Date OF Registration <span style={{ color: 'red' }}> * </span></label>
                                        <input type="Date" className="gf-form-input" onChange={this.onChange}  value={vehicleObj.dateOfRegistration} placeholder="dateOfRegistration" name="dateOfRegistration" id="dateOfRegistration" maxLength={255} />
                                    </div> 
                                </div>
                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Year Of ManuFfacturing</label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={vehicleObj.yearOfManufacturing} placeholder="yearOfManufacturing" name="yearOfManufacturing" id="yearOfManufacturing" maxLength={10} />
                                    </div>
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Manufacturing Company</label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={vehicleObj.manufacturingCompany} placeholder="Manufacturing Company" name="manufacturingCompany" id="manufacturingCompany" maxLength={10} />
                                    </div> 
                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Model</label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={vehicleObj.model} placeholder="Model" name="model" id="model" maxLength={255} />
                                    </div>
                                </div>

                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1 ">
                                        <label className="gf-form-label b-0 bg-transparent">Chasis No</label>
                                        <input type="text" required className="gf-form-input" onChange={this.onChange}  value={vehicleObj.chasisNo} placeholder="chasisNo" name="chasisNo" id="chasisNo" maxLength={255}/>
                                    </div>
                                    <div className="fwidth-modal-text m-r-1 ">
                                        <label className="gf-form-label b-0 bg-transparent">Rc No</label>
                                        <input type="text" required className="gf-form-input" onChange={this.onChange}  value={vehicleObj.rcNo} placeholder="rcNo" name="rcNo" id="rcNo" maxLength={255}/>
                                    </div>
                                </div> 
                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1 ">
                                        <label className="gf-form-label b-0 bg-transparent">Contact Number</label>
                                        <input type="text" required className="gf-form-input" onChange={this.onChange}  value={vehicleObj.contactNumber} placeholder="contactNumber" name="contactNumber" id="contactNumber" maxLength={255}/>
                                    </div>
                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Status<span style={{ color: 'red' }}> * </span></label>
                                        <select name="status" id="status" onChange={this.onChange} value={vehicleObj.status} className="gf-form-input">
                                            <option key={""} value={""}>Select Status</option>
                                            <option key={"ACTIVE"} value={"ACTIVE"}>ACTIVE</option>
                                            <option key={"DEACTIVE"} value={"DEACTIVE"}>DEACTIVE</option>
                                            <option key={"DRAFT"} value={"DRAFT"}>DRAFT</option>
                                        </select>
                                    </div> 
                                </div>
                                <div className="m-t-1 text-center">
                                    {
                                        modelHeader === "Add New Vehicle" ?
                                        <button type="button" id="btnAdd" className="btn btn-primary border-bottom" onClick={this.save} >Save</button>
                                        :
                                        <button type="button" id="btnUpdate" className="btn btn-primary border-bottom" onClick={this.save}>Update</button>
                                    }
                                    &nbsp;<button className="btn btn-danger border-bottom" onClick={(e) => this.showModal(e, false, modelHeader)}>Cancel</button>
                                    
                                </div>
                            </div>
                        </form>
                        
                        
                    </ModalBody>
                </Modal>
                <button className="btn btn-primary" style={{width:'200px'}} onClick={e => this.showModal(e, true, "Add New Vehicle")}>
                    <i className="fa fa-plus-circle"></i> Add New Vehicle
                </button>
                {
                    vehicleList !== null && vehicleList !== undefined && vehicleList.length > 0 ?
                        <div style={{width:'100%', height:'250px', overflow:'auto'}}>
                            <table id="ayTable" className="striped-table fwidth bg-white p-2 m-t-1">
                                <thead>
                                    <tr>
                                    <th> ID</th>
                                    <th>Vehicle Number</th>
                                    <th>Vehicle Type</th>
                                    <th>Capacity</th>
                                    <th>Contact No</th>
                                    <th>Date Of Registration</th>
                                    <th>Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.createRows(vehicleList) }
                                </tbody>
                            </table>
                        </div>
                    : null
                }
                
            </main>
        );
    }
}

export default withApollo(Vehicle);