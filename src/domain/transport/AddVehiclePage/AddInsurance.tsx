import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { commonFunctions } from '../../_utilites/common.functions';
import "../../../css/custom.css"
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
import { ADD_VEHICLE_MUTATION ,ADD_INSURANCE_MUTATION } from '../_queries';
import moment = require('moment');


export interface VehicleProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any; 
    insuranceList?:any;
    insuranceFilterCacheList:any;
    vehicle:any;
}
const ERROR_MESSAGE_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_ERROR = "Due to some error in insurance service, insurance could not be saved. Please check insurance service logs";
const SUCCESS_MESSAGE_INSURANCE_ADDED = "New insurance saved successfully";
const SUCCESS_MESSAGE_INSURANCE_UPDATED = "insurance updated successfully";
const ERROR_MESSAGE_DATES_OVERLAP = "End date cannot be prior or same as start date";


class Vehicle<T = {[data: string]: any}> extends React.Component<VehicleProps, any> {
    constructor(props: VehicleProps) {
        super(props);
        this.state = {     
            insurancelist: this.props.insuranceList,
            insuranceFilterCacheList:this.props.insuranceFilterCacheList,
            isModalOpen: false,
            insuranceObj:{
                vehicleId:"",
                insuranceCompany:"",
                typeOfInsurance:"",
                dateOfInsurance :"",
                validTill :"",       
            },
            vehicle:"",
            errorMessage: "",
            successMessage: "",
            modelHeader: ""
        };  
        this.createVehicle = this.createVehicle.bind(this);  
    }
    createVehicle(vehicle: any) {
        let vehiclesOptions = [
          <option key={0} value="">
            Select Vehicle
          </option>,
        ];
        for (let i = 0; i < vehicle.length; i++) {
            vehiclesOptions.push(
            <option key={vehicle[i].id} value={vehicle[i].id}>
              {vehicle[i].vehicleNumber}
            </option>
          );
        }
        return vehiclesOptions;
      }
    showDetails(e: any, bShow: boolean, editObj: any, modelHeader: any) {
        e && e.preventDefault();
        const { insuranceObj } = this.state;
        insuranceObj.vehicleId =editObj.vehicleId;
        insuranceObj.insuranceCompany = editObj.insuranceCompany;
        insuranceObj.typeOfInsurance = editObj.typeOfInsurance;
        insuranceObj.dateOfInsurance = moment(editObj.dateOfInsurance,"DD-MM-YYYY").format("YYYY-MM-DD");
        insuranceObj.validTill =moment(editObj.validTill,"DD-MM-YYYY").format("YYYY-MM-DD")
        this.setState(() => ({
            isModalOpen: bShow,
            insuranceObj: insuranceObj,
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
    createRow(objAry: any) {
        const { source } = this.state;
        console.log("createRow() - insurance list on vehicle page:  ", objAry);
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
                <td>{obj.insuranceCompany}</td>
                <td>{obj.typeOfInsurance}</td>
                <td>{obj.strDateOfInsurance}</td>
                <td>{obj.strValidTill}</td>
                <td>
                    {
                        <button className="btn btn-primary" onClick={e => this.showDetails(e, true, obj, "Edit Insurance")}>Edit</button>
                    }
                </td>
              </tr>
            );
        }
        return retVal;
    }

    showModals(e: any, bShow: boolean, headerLabel: any) {
        e && e.preventDefault();
        this.setState(() => ({
            isModalOpen: bShow,
            insuranceObj: {},
            modelHeader: headerLabel,
            errorMessage: "",
            successMessage: "",
        }));
    }

    onChange = (e: any) => {
        e.preventDefault();
        const { name, value } = e.nativeEvent.target;

        const { insuranceObj } = this.state;
        
        this.setState({
            
            insuranceObj: {
                ...insuranceObj,
                [name]: value
            },
            errorMessage: "",
            successMessage: "",
        });
        
        commonFunctions.restoreTextBoxBorderToNormal(name);
    }
    validateField(obj: any){
        let isValid = true;
        let errorMessage = ""
        if(obj.insuranceCompany === undefined || obj.insuranceCompany === null || obj.insuranceCompany === "")
        {
            commonFunctions.changeTextBoxBorderToError((obj.insuranceCompany === undefined || obj.insuranceCompany === null) ? "" : obj.insuranceCompany, "insuranceCompany");
            errorMessage = ERROR_MESSAGE_FIELD_MISSING;
            isValid = false;
        }

        if(isValid){
            isValid = this.validateDates(obj.dateOfInsurance, obj.validTill);
            if(isValid === false){
                errorMessage = ERROR_MESSAGE_DATES_OVERLAP;
            }
         }

        this.setState({
            errorMessage: errorMessage
        });
        return isValid; 

    }  

    validateDates(dateOfInsurance: any, validTill: any){
        let doIns = moment(dateOfInsurance, "YYYY-MM-DD");
        let vdTill = moment(validTill, "YYYY-MM-DD");
        if (vdTill.isSameOrBefore(doIns) || doIns.isSameOrAfter(vdTill)) {
            return false;
        }
        return true;
    }
    
    getAddInsuranceInput(insuranceObj: any, modelHeader: any){
        let id = null;
        if(modelHeader === "edit Insurance"){
            id = insuranceObj.id;
        }
        let input = {
            id:id,
            vehicleId:insuranceObj.vehicleId,
            insuranceCompany: insuranceObj.insuranceCompany,
            typeOfInsurance: insuranceObj.typeOfInsurance,
            strDateOfInsurance: moment(insuranceObj.dateOfInsurance).format("DD-MM-YYYY"),
            strValidTill: moment(insuranceObj.validTill).format("DD-MM-YYYY"),
            
        };
        return input;
    }
    
    async doSaveIns(inp: any, id: any){
        let btn = document.querySelector("#"+id);
        btn && btn.setAttribute("disabled", "true");
        let exitCode = 0;
        
        await this.props.client.mutate({
            mutation: ADD_INSURANCE_MUTATION,
            variables: { 
                input: inp
            },
        }).then((resp: any) => {
            console.log("Success in addInsurance Mutation. Exit code : ",resp.data.addInsurance.cmsInsuranceVo.exitCode);
            exitCode = resp.data.addInsurance.cmsInsuranceVo.exitCode;
            let temp = resp.data.addInsurance.cmsInsuranceVo.dataList; 
            console.log("New insurance list : ", temp);
            this.setState({
                insuranceList: temp
            });
        }).catch((error: any) => {
            exitCode = 1;
            console.log('Error in addInsurance : ', error);
        });
        btn && btn.removeAttribute("disabled");
        
        let errorMessage = "";
        let successMessage = "";
        if(exitCode === 0 ){
            successMessage = SUCCESS_MESSAGE_INSURANCE_ADDED;
            if(inp.id !== null){
                successMessage = SUCCESS_MESSAGE_INSURANCE_UPDATED;
            }
        }else {
            errorMessage = ERROR_MESSAGE_SERVER_ERROR;
        }
        this.setState({
            successMessage: successMessage,
            errorMessage: errorMessage
        });
    }

    saveIns = (e: any) => {
        const { id } = e.nativeEvent.target;
        const {insuranceObj, modelHeader} = this.state;
        let isValid = this.validateField(insuranceObj);
        if(isValid === false){
            return;
        }
        const inputObj = this.getAddInsuranceInput(insuranceObj, modelHeader);
        this.doSaveIns(inputObj, id);
        this.saveIns(inputObj);
        
    }
    render() {
        const {collegeList, insuranceFilterCacheList,insuranceList, isModalOpen, vehicleObj,insuranceObj, modelHeader, errorMessage, successMessage} = this.state;
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
                                 <div className="mdflex modal-fwidth">
                                <div className="fwidth-modal-text m-r-1">
                                <label htmlFor="">vehicle<span style={{ color: 'red' }}> * </span></label>
                                 <select required name="vehicleId" id="vehicleId" onChange={this.onChange}  value={insuranceObj.vehicleId} className="gf-form-label b-0 bg-transparent">
                                    {this.createVehicle(insuranceFilterCacheList.vehicle)}
                                </select>
                                </div>
                                
                                <div className="fwidth-modal-text m-r-1 ">
                                        <label className="gf-form-label b-0 bg-transparent">insuranceCompany</label>
                                        <input type="text" required className="gf-form-input" onChange={this.onChange}  value={insuranceObj.insuranceCompany} placeholder="insuranceCompany" name="insuranceCompany" id="insuranceCompany" maxLength={255}/>
                                    </div> 

                                   </div>

                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">typeOfInsurance<span style={{ color: 'red' }}> * </span></label>
                                        <select name="typeOfInsurance" id="typeOfInsurance" onChange={this.onChange} value={insuranceObj.typeOfInsurance} className="gf-form-input">
                                            <option key={""} value={""}>Select typeOfInsurance</option>
                                            <option key={"LIABILITY"} value={"LIABILITY"}>LIABILITY</option>
                                            <option key={"COLLISION"} value={"COLLISION"}>COLLISION</option>
                                            <option key={"COMPREHENSIVE"} value={"COMPREHENSIVE"}>COMPREHENSIVE</option>
                                        </select>
                                    </div>

                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">dateOfInsurance <span style={{ color: 'red' }}> * </span></label>
                                        <input type="Date" className="gf-form-input" onChange={this.onChange}  value={insuranceObj.dateOfInsurance} placeholder="dateOfInsurance" name="dateOfInsurance" id="dateOfInsurance" maxLength={255} />
                                    </div>

                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">validTill <span style={{ color: 'red' }}> * </span></label>
                                        <input type="Date" className="gf-form-input" onChange={this.onChange}  value={insuranceObj.validTill} placeholder="validTill" name="validTill" id="validTill" maxLength={255} />
                                    </div>

                                <div className="m-t-1 text-center">
                                    {
                                        modelHeader === "Add New Insurance" ?
                                        <button type="button" id="btnAdd" className="btn btn-primary border-bottom" onClick={this.saveIns} >Save</button>
                                        :
                                        <button type="button" id="btnUpdate" className="btn btn-primary border-bottom" onClick={this.saveIns}>Update</button>
                                    }
                                    &nbsp;<button className="btn btn-danger border-bottom" onClick={(e) => this.showModal(e, false, modelHeader)}>Cancel</button>
                                    
                                </div> </div>
                        </form>
                        
                        
                    </ModalBody>
                </Modal>
               

<button className="btn btn-primary" style={{width:'200px'}} onClick={e => this.showModal(e, true, "Add New Insurance")}>
<i className="fa fa-plus-circle"></i> Add New insurance
</button>
{
              

insuranceList !== null && insuranceList !== undefined && insuranceList.length > 0 ?
    <div style={{width:'100%', height:'250px', overflow:'auto'}}>
        <table id="ayTable" className="striped-table fwidth bg-white p-2 m-t-1">
            <thead>
                <tr>
                <th>id</th>
                <th> insurance company</th>
                <th>type of insurance</th>
                <th>date Of insurance</th>
                <th>validTill</th>
                <th>Edit</th>
                </tr>
            </thead>
            <tbody>
                { this.createRow(insuranceList) }
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