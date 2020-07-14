import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { commonFunctions } from '../../_utilites/common.functions';
import "../../../css/custom.css"
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
import { ADD_STOPAGE_MUTATION  } from '../_queries';
// import * as moment from 'moment';
import moment = require('moment');
import wsCmsBackendServiceSingletonClient from '../../../wsCmsBackendServiceClient';


export interface StopageProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    stopageList?:any;
    stopageData?:any;
    onSaveUpdate?: any;
    user?:any;
}

const ERROR_MESSAGE_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_ERROR = "Due to some error in stopage service, stopage could not be saved. Please check insurance service logs";
const SUCCESS_MESSAGE_STOPAGE_ADDED = "New stopage saved successfully";
const SUCCESS_MESSAGE_STOPAGE_UPDATED = "stopage updated successfully";
const ERROR_MESSAGE_DATES_OVERLAP = "End date cannot be prior or same as start date";

class Stopage<T = {[data: string]: any}> extends React.Component<StopageProps, any> {
    constructor(props: StopageProps) {
        super(props);
        this.state = { 
            stopagelist: this.props.stopageList,
            isModalOpen: false,
            stopageObj:{
                stopageName:"",
                status:"",
                createdOn :"",
                updatedOn :"",      
            },
            errorMessage: "",
            successMessage: "",
            modelHeader: "",
        };
    }

    async registerSocket() {
        const socket = wsCmsBackendServiceSingletonClient.getInstance();
    }
   

    onChange = (e: any) => {
        e.preventDefault();
        const { name, value } = e.nativeEvent.target;
        const { stopageObj } = this.state;
        this.setState({    
            stopageObj: {
                ...stopageObj,
                [name]: value
            },
            errorMessage: "",
            successMessage: "",
        });   
        commonFunctions.restoreTextBoxBorderToNormal(name);
    }
    validateDates(issueDate: any, dueDate: any){
        let id = moment(issueDate, "YYYY-MM-DD");
        let dd = moment(dueDate, "YYYY-MM-DD");
        if (dd.isSameOrBefore(id) || id.isSameOrAfter(dd)) {
            return false;
        }
        return true;
    }
    getAddStopageInput(stopageObj: any, modelHeader: any){
        let id = null;
        if(modelHeader === "Edit Stopage"){
            id = stopageObj.id;
        }
        let inputObj = {
            id: id,
            stopageName: stopageObj.stopageName,
            status: stopageObj.status,
            strCreatedOn: moment(stopageObj.createdOn).format("DD-MM-YYYY"),
            strUpdatedOn: moment(stopageObj.updatedOn).format("DD-MM-YYYY"),    
        };
        return inputObj;
    }
    
    validateField(obj: any){
        let isValid = true;
        let errorMessage = ""
        if(obj.stopageName === undefined || obj.stopageName === null || obj.stopageName === "")
        {
            commonFunctions.changeTextBoxBorderToError((obj.stopageName === undefined || obj.stopageName === null) ? "" : obj.stopageName, "stopageName");
            errorMessage = ERROR_MESSAGE_FIELD_MISSING;
            isValid = false;
        }
        if(isValid){
            isValid = this.validateDates(obj.createdOn, obj.updatedOn);
            if(isValid === false){
                errorMessage = ERROR_MESSAGE_DATES_OVERLAP;
            }
         }
        this.setState({
            errorMessage: errorMessage
        });
        return isValid; 
    }


    async doSave(inputObj: any, id: any){
        let btn = document.querySelector("#"+id);
        btn && btn.setAttribute("disabled", "true");
        let exitCode = 0;
        
        await this.props.client.mutate({
            mutation: ADD_STOPAGE_MUTATION,
            variables: { 
                input: inputObj
            },
        }).then((resp: any) => {
            console.log("Success in addStopage Mutation. Exit code : ",resp.data.addStopage.cmsStopageVo.exitCode);
            exitCode = resp.data.addStopage.cmsStopageVo.exitCode;
            let temp = resp.data.addStopage.cmsStopageVo.dataList; 
            console.log("New stopage list : ", temp);
            this.setState({
                stopageList: temp
            });
        }).catch((error: any) => {
            exitCode = 1;
            console.log('Error in addStopage : ', error);
        });
        btn && btn.removeAttribute("disabled");
        let errorMessage = "";
        let successMessage = "";
        if(exitCode === 0 ){
            successMessage = SUCCESS_MESSAGE_STOPAGE_ADDED;
            if(inputObj.id !== null){
                successMessage = SUCCESS_MESSAGE_STOPAGE_UPDATED;
            }
        }else {
            errorMessage = ERROR_MESSAGE_SERVER_ERROR;
        }
        this.setState({
            successMessage: successMessage,
            errorMessage: errorMessage
        });
    }

    addStopage = (e: any) => {
        const { id } = e.nativeEvent.target;
        const {stopageObj, modelHeader} = this.state;
        let isValid = this.validateField(stopageObj);
        if(isValid === false){
            return;
        }
        const inputObj = this.getAddStopageInput(stopageObj, modelHeader);
        this.doSave(inputObj, id);   
    }
    render() {
        const {stopageList, isModalOpen,stopageObj, modelHeader, errorMessage, successMessage} = this.state;
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
                                <h5 className="mtf-8 dark-gray">Stopage Details</h5>
                                </div>
                                <div id="headerRowDiv" className="b-1 h5-fee-bg j-between">
                                <div className="m-1 fwidth">Add Stopage Data</div>
                                <div id="saveRouteCatDiv" className="fee-flex">
                                <button className="btn btn-primary mr-1" id="btnSaveFeeCategory" name="btnSaveFeeCategory" onClick={this.addStopage} style={{ width: '140px' }}>Add Stopage</button>
                                </div>
                                </div>
                                <div id="feeCategoryDiv" className="b-1">
                                <div className="b1 row m-1 j-between">
                                
                                <div>
                                        <label className="gf-form-label b-0 bg-transparent">Stopage Name</label>
                                        <input type="text" required className="fwidth" style={{ width: '250px' }} onChange={this.onChange}  value={stopageObj.stopageName} placeholder="stopageName" name="stopageName" id="stopageName" />
                                    </div>  
                                    <div>
                                <label className="gf-form-label b-0 bg-transparent">Status<span style={{ color: 'red' }}> * </span></label>
                                <select name="status" id="status" onChange={this.onChange} value={stopageObj.status} className="fwidth" style={{ width: '250px' }}>
                                <option key={""} value={""}>Select Status</option>
                                 <option key={"ACTIVE"} value={"ACTIVE"}>ACTIVE</option>
                                <option key={"DEACTIVE"} value={"DEACTIVE"}>DEACTIVE</option>
                                <option key={"DRAFT"} value={"DRAFT"}>DRAFT</option>
                                </select>
                                </div>
                                    <div>
                                        <label className="gf-form-label b-0 bg-transparent">CreatedOn <span style={{ color: 'red' }}> * </span></label>
                                        <input type="Date" className="fwidth" style={{ width: '250px' }} onChange={this.onChange}  value={stopageObj.createdOn} placeholder="createdOn" name="createdOn" id="createdOn"  />
                                    </div>
                                    <div>
                                        <label className="gf-form-label b-0 bg-transparent">UpdatedOn <span style={{ color: 'red' }}> * </span></label>
                                        <input type="Date" className="fwidth" style={{ width: '250px' }} onChange={this.onChange}  value={stopageObj.updatedOn} placeholder="updatedOn" name="updatedOn" id="updatedOn"   />
                                    </div>
                                 </div>
                                 </div>
                                 </section>
        );
    }
}

export default withApollo(Stopage);