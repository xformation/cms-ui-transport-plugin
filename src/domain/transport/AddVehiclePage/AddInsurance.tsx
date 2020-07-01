import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { commonFunctions } from '../../_utilites/common.functions';
import "../../../css/custom.css"
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
import { ADD_VEHICLE_MUTATION ,ADD_INSURANCE_MUTATION } from '../_queries';
import moment = require('moment');
import wsCmsBackendServiceSingletonClient from '../../../wsCmsBackendServiceClient';


export interface InsuranceProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any; 
    insuranceList?:any;
    insuranceFilterCacheList:any;
    vehicle:any;
    onSaveUpdate?: any;
    user?: any;
}
const ERROR_MESSAGE_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_ERROR = "Due to some error in insurance service, insurance could not be saved. Please check insurance service logs";
const SUCCESS_MESSAGE_INSURANCE_ADDED = "New insurance saved successfully";
const SUCCESS_MESSAGE_INSURANCE_UPDATED = "insurance updated successfully";
const ERROR_MESSAGE_DATES_OVERLAP = "End date cannot be prior or same as start date";


class Insurance<T = {[data: string]: any}> extends React.Component<InsuranceProps, any> {
    constructor(props: InsuranceProps) {
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
    
    async registerSocket() {
        const socket = wsCmsBackendServiceSingletonClient.getInstance();
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
    // showDetails(e: any, bShow: boolean, editObj: any, modelHeader: any) {
    //     e && e.preventDefault();
    //     const { insuranceObj } = this.state;
    //     insuranceObj.id = editObj.id;
    //     insuranceObj.vehicleId =editObj.vehicleId;
    //     insuranceObj.insuranceCompany = editObj.insuranceCompany;
    //     insuranceObj.typeOfInsurance = editObj.typeOfInsurance;
    //     insuranceObj.dateOfInsurance = moment(editObj.strDateOfInsurance,"DD-MM-YYYY").format("YYYY-MM-DD");
    //     insuranceObj.validTill =moment(editObj.strValidTill,"DD-MM-YYYY").format("YYYY-MM-DD")
    //     this.setState(() => ({
    //         isModalOpen: bShow,
    //         insuranceObj: insuranceObj,
    //         modelHeader: modelHeader,
    //         errorMessage: "",
    //         successMessage: "",
    //     }));
    // }
    // createRow(objAry: any) {
    //     const { source } = this.state;
    //     console.log("createRow() - insurance list on insurance page:  ", objAry);
    //     if(objAry === undefined || objAry === null) {
    //         return;
    //     }
    //     const aryLength = objAry.length;
    //     const retVal = [];
    //     for (let i = 0; i < aryLength; i++) {
    //         const obj = objAry[i];
    //         retVal.push(
    //           <tr >
    //             <td>{obj.id}</td>
    //             <td>{obj.insuranceCompany}</td>
    //             <td>{obj.typeOfInsurance}</td>
    //             <td>{obj.strDateOfInsurance}</td>
    //             <td>{obj.strValidTill}</td>
    //             {/* <td>{obj.vehicle.vehicleNumber}</td> */}
    //             <td>
    //                 {
    //                     <button className="btn btn-primary" onClick={e => this.showDetails(e, true, obj, "Edit Insurance")}>Edit</button>
    //                 }
    //             </td>
    //           </tr>
    //         );
    //     }
    //     return retVal;
    // }

    // showModals(e: any, bShow: boolean, headerLabel: any) {
    //     e && e.preventDefault();
    //     this.setState(() => ({
    //         isModalOpen: bShow,
    //         insuranceObj: {},
    //         modelHeader: headerLabel,
    //         errorMessage: "",
    //         successMessage: "",
    //     }));
    // }

    onChange = (e: any) => {
        e.preventDefault();
        const { name, value } = e.nativeEvent.target;
        const { insuranceObj } = this.state  
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
        // if(modelHeader === "Edit Insurance"){
        //     id = insuranceObj.id;
        // }
        let inputObj = {
            id:id,
            vehicleId:insuranceObj.vehicleId,
            insuranceCompany: insuranceObj.insuranceCompany,
            typeOfInsurance: insuranceObj.typeOfInsurance,
            strDateOfInsurance: moment(insuranceObj.dateOfInsurance).format("DD-MM-YYYY"),
            strValidTill: moment(insuranceObj.validTill).format("DD-MM-YYYY"),            
        };
        return inputObj;
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


    
    async doSaveIns(inputObj: any, id: any){
        let btn = document.querySelector("#"+id);
        btn && btn.setAttribute("disabled", "true");
        let exitCode = 0;
        
        await this.props.client.mutate({
            mutation: ADD_INSURANCE_MUTATION,
            variables: { 
                input: inputObj
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
            if(inputObj.id !== null){
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

    addInsurance = (e: any) => {
        const { id } = e.nativeEvent.target;
        const {insuranceObj, modelHeader} = this.state;
        let isValid = this.validateField(insuranceObj);
        if(isValid === false){
            return;
        }
        const inputObj = this.getAddInsuranceInput(insuranceObj, modelHeader);
        this.doSaveIns(inputObj, id);
    }
    render() {
        const {collegeList, insuranceFilterCacheList,insuranceList, isModalOpen, vehicleObj,insuranceObj, modelHeader, errorMessage, successMessage} = this.state;
        return (
            // <main>
            //     <Modal isOpen={isModalOpen} className="react-strap-modal-container" style={{height:"500px", overflow:"auto"}}>
            //         <ModalHeader>{modelHeader}</ModalHeader>
            //         <ModalBody className="modal-content">
                        

            //             <form className="gf-form-group section m-0 dflex">
            //                 <div className="modal-fwidth">
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
                                    <h5 className="mtf-8 dark-gray">Insurance Details</h5>
                                    </div>
                                    <div id="headerRowDiv" className="b-1 h5-fee-bg j-between">
                                    <div className="m-1 fwidth">Add Insurance Data</div>
                                     <div id="saveInsuranceCatDiv" className="fee-flex">
                                 <button className="btn btn-primary mr-1" id="btnSaveFeeCategory" name="btnSaveFeeCategory" onClick={this.addInsurance} style={{ width: '140px' }}>Add Insurance</button>
                                    {/* <button className="btn btn-primary mr-1" id="btnUpdateFeeCategory" name="btnUpdateFeeCategory" onClick={this.addLibrary} style={{ width: '170px' }}>Update Book</button> */}
                                </div>
                                </div>
                                <div id="feeCategoryDiv" className="b-1">
                                <div className="b1 row m-1 j-between">
                                
                                <div >
                                <label htmlFor="">Vehicle<span style={{ color: 'red' }}> * </span></label>
                                 <select required name="vehicleId" id="vehicleId" onChange={this.onChange}  value={insuranceObj.vehicleId} className="gf-form-label b-0 bg-transparent">
                                    {this.createVehicle(insuranceFilterCacheList.vehicle)}
                                </select>
                                </div>
                                
                                <div>
                                        <label className="gf-form-label b-0 bg-transparent">Insurance Company</label>
                                        <input type="text" required className="fwidth" style={{ width: '250px' }} onChange={this.onChange}  value={insuranceObj.insuranceCompany} placeholder="insuranceCompany" name="insuranceCompany" id="insuranceCompany" />
                                    </div> 

                                    <div>
                                        <label className="gf-form-label b-0 bg-transparent">TypeOfInsurance<span style={{ color: 'red' }}> * </span></label>
                                        <select name="typeOfInsurance" id="typeOfInsurance" onChange={this.onChange} value={insuranceObj.typeOfInsurance} className="gf-form-input">
                                            <option key={""} value={""}>Select typeOfInsurance</option>
                                            <option key={"LIABILITY"} value={"LIABILITY"}>LIABILITY</option>
                                            <option key={"COLLISION"} value={"COLLISION"}>COLLISION</option>
                                            <option key={"COMPREHENSIVE"} value={"COMPREHENSIVE"}>COMPREHENSIVE</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="gf-form-label b-0 bg-transparent">DateOfInsurance <span style={{ color: 'red' }}> * </span></label>
                                        <input type="Date" className="fwidth" style={{ width: '250px' }} onChange={this.onChange}  value={insuranceObj.dateOfInsurance} placeholder="dateOfInsurance" name="dateOfInsurance" id="dateOfInsurance"/>
                                    </div>

                                    <div>
                                        <label className="gf-form-label b-0 bg-transparent">Valid Till <span style={{ color: 'red' }}> * </span></label>
                                        <input type="Date" className="fwidth" style={{ width: '250px' }} onChange={this.onChange}  value={insuranceObj.validTill} placeholder="validTill" name="validTill" id="validTill" />
                                    </div>
                                </div>
                               </div> 
                        </section>

        );
    }
}

export default withApollo(Insurance);