import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { commonFunctions } from '../../_utilites/common.functions';
import "../../../css/custom.css"
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
import { ADD_CONTRACT_MUTATION  } from '../_queries';
// import * as moment from 'moment';
import moment = require('moment');
import wsCmsBackendServiceSingletonClient from '../../../wsCmsBackendServiceClient';


export interface ContractProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    contractList?:any;
    contractData?:any;
    onSaveUpdate?: any;
    user?:any;

}

const ERROR_MESSAGE_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_ERROR = "Due to some error in contract service, contract could not be saved. Please check insurance service logs";
const SUCCESS_MESSAGE_CONTRACT_ADDED = "New contract saved successfully";
const SUCCESS_MESSAGE_CONTRACT_UPDATED = "contract updated successfully";
const ERROR_MESSAGE_DATES_OVERLAP = "End date cannot be prior or same as start date";

class Contract<T = {[data: string]: any}> extends React.Component<ContractProps, any> {
    constructor(props: ContractProps) {
        super(props);
        this.state = { 
            contractlist: this.props.contractList,
            isModalOpen: false,
            contractObj:{
                vendorName:"",
                durationOfContract:"",
                typeOfOwnerShip:"",
                startDate :"",
                endDate :"",      
            },
            errorMessage: "",
            successMessage: "",
            modelHeader: ""
        };
        
    }

    async registerSocket() {
        const socket = wsCmsBackendServiceSingletonClient.getInstance();
    }
    // showDetails(e: any, bShow: boolean, editObj: any, modelHeader: any) {
    //     e && e.preventDefault();
    //     const { contractObj } = this.state;
    //     contractObj.id = editObj.id;
    //     contractObj.vendorName = editObj.vendorName;
    //     contractObj.durationOfContract = editObj.durationOfContract;
    //     contractObj.typeOfOwnerShip = editObj.typeOfOwnerShip;
    //     contractObj.startDate = moment(editObj.strStartDate,"DD-MM-YYYY").format("YYYY-MM-DD");
    //     contractObj.endDate = moment(editObj.strEndDate,"DD-MM-YYYY").format("YYYY-MM-DD")
    //     this.setState(() => ({
    //         isModalOpen: bShow,
    //         contractObj: contractObj,
    //         modelHeader: modelHeader,
    //         errorMessage: "",
    //         successMessage: "",
    //     }));
    // }
    // createRow(objAry: any) {
    //     const { source } = this.state;
    //     console.log("createRow() - Contract list on Contract page:  ", objAry);
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
    //             <td>{obj.vendorName}</td>
    //             <td>{obj.durationOfContract}</td>
    //             <td>{obj.typeOfOwnerShip}</td>
    //             <td>{obj.strStartDate}</td>
    //             <td>{obj.strEndDate}</td>
    //             <td>
    //                 {
    //                     <button className="btn btn-primary" onClick={e => this.showDetails(e, true, obj, "Edit Contract")}>Edit</button>
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
    //         contractObj: {},
    //         modelHeader: headerLabel,
    //         errorMessage: "",
    //         successMessage: "",
    //     }));
    // }
    onChange = (e: any) => {
        e.preventDefault();
        const { name, value } = e.nativeEvent.target;
        const { contractObj } = this.state;
        this.setState({    
            contractObj: {
                ...contractObj,
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
    getAddContractInput(contractObj: any, modelHeader: any){
        let id = null;
        if(modelHeader === "Edit Contract"){
            id = contractObj.id;
        }
        let inputObj = {
            id: id,
            vendorName: contractObj.vendorName,
            durationOfContract: contractObj.durationOfContract,
            typeOfOwnerShip:contractObj.typeOfOwnerShip,
            strStartDate: moment(contractObj.startDate).format("DD-MM-YYYY"),
            strEndDate: moment(contractObj.endDate).format("DD-MM-YYYY"),    
        };
        return inputObj;
    }
    
    validateField(obj: any){
        let isValid = true;
        let errorMessage = ""
        if(obj.vendorName === undefined || obj.vendorName === null || obj.vendorName === "")
        {
            commonFunctions.changeTextBoxBorderToError((obj.vendorName === undefined || obj.vendorName === null) ? "" : obj.vendorName, "vendorName");
            errorMessage = ERROR_MESSAGE_FIELD_MISSING;
            isValid = false;
        }
        if(isValid){
            isValid = this.validateDates(obj.startDate, obj.endDate);
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
            mutation: ADD_CONTRACT_MUTATION,
            variables: { 
                input: inputObj
            },
        }).then((resp: any) => {
            console.log("Success in addContract Mutation. Exit code : ",resp.data.addContract.cmsContractVo.exitCode);
            exitCode = resp.data.addContract.cmsContractVo.exitCode;
            let temp = resp.data.addContract.cmsContractVo.dataList; 
            console.log("New contract list : ", temp);
            this.setState({
                contractList: temp
            });
        }).catch((error: any) => {
            exitCode = 1;
            console.log('Error in addContract : ', error);
        });
        btn && btn.removeAttribute("disabled");
        
        let errorMessage = "";
        let successMessage = "";
        if(exitCode === 0 ){
            successMessage = SUCCESS_MESSAGE_CONTRACT_ADDED;
            if(inputObj.id !== null){
                successMessage = SUCCESS_MESSAGE_CONTRACT_UPDATED;
            }
        }else {
            errorMessage = ERROR_MESSAGE_SERVER_ERROR;
        }
        this.setState({
            successMessage: successMessage,
            errorMessage: errorMessage
        });
    }

    addContract = (e: any) => {
        const { id } = e.nativeEvent.target;
        const {contractObj, modelHeader} = this.state;
        let isValid = this.validateField(contractObj);
        if(isValid === false){
            return;
        }
        const inputObj = this.getAddContractInput(contractObj, modelHeader);
        this.doSave(inputObj, id);   
    }
    render() {
        const {contractList, isModalOpen,contractObj, modelHeader, errorMessage, successMessage} = this.state;
        return (
            // <main>
            //     <Modal isOpen={isModalOpen} className="react-strap-modal-container" style={{height:"500px", overflow:"auto"}}>
            //         <ModalHeader>{modelHeader}</ModalHeader>
            //         <ModalBody className="modal-content">
                        

            //             <form className="gf-form-group section m-0 dflex">        
                        //    <div className="modal-fwidth">
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
                                <h5 className="mtf-8 dark-gray">Contract Details</h5>
                                </div>
                                <div id="headerRowDiv" className="b-1 h5-fee-bg j-between">
                                <div className="m-1 fwidth">Add Contract Data</div>
                                <div id="saveRouteCatDiv" className="fee-flex">
                                <button className="btn btn-primary mr-1" id="btnSaveFeeCategory" name="btnSaveFeeCategory" onClick={this.addContract} style={{ width: '140px' }}>Add Contract</button>
                                {/* <button className="btn btn-primary mr-1" id="btnUpdateFeeCategory" name="btnUpdateFeeCategory" onClick={this.addLibrary} style={{ width: '170px' }}>Update Book</button> */}
                                </div>
                                </div>
                                <div id="feeCategoryDiv" className="b-1">
                                {/* <div className="b1 row m-1 j-between"> */}
                                <div className="form-grid">

                                
                                <div>
                                        <label htmlFor="">
                                        {/* className="gf-form-label b-0 bg-transparent"> */}
                                            Vendor Name<span style={{ color: 'red' }}> * </span>
                                            </label>
                                        <input type="text"
                                         required className="gf-form-input fwidth" 
                                         maxLength={255}
                                         onChange={this.onChange}  
                                         value={contractObj.vendorName} 
                                         placeholder="vendorName" 
                                         name="vendorName" 
                                         id="vendorName" />
                                    </div> 
                                    <div>
                                        <label htmlFor="">
                                        {/* // className="gf-form-label b-0 bg-transparent"> */}
                                             Contract Duration<span style={{ color: 'red' }}> * </span>
                                            </label>
                                        <input type="text" 
                                        required className="gf-form-input fwidth" 
                                        maxLength={255}
                                        onChange={this.onChange}  
                                        value={contractObj.durationOfContract} 
                                        placeholder="durationOfContract" 
                                        name="durationOfContract" 
                                        id="durationOfContract"/>
                                    </div> 
                                    <div>
                                        <label htmlFor="">
                                        {/* className="gf-form-label b-0 bg-transparent"> */}
                                            TypeOfOwnerShip<span style={{ color: 'red' }}> * </span>
                                            </label>
                                        <select name="typeOfOwnerShip" 
                                        id="typeOfOwnerShip" 
                                        onChange={this.onChange} 
                                        value={contractObj.typeOfOwnerShip} 
                                        className="gf-form-input fwidth">
                                            <option key={""} value={""}>Select typeOfOwnerShip</option>
                                            <option key={"COMPANYOWNED"} value={"COMPANYOWNED"}>COMPANYOWNED</option>
                                            <option key={"CONTRACTUAL"} value={"CONTRACTUAL"}>CONTRACTUAL</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                        {/* // className="gf-form-label b-0 bg-transparent"> */}
                                            Start Date <span style={{ color: 'red' }}> * </span>
                                            </label>
                                        <input type="Date" 
                                        className="gf-form-input fwidth" 
                                        maxLength={255}
                                        onChange={this.onChange}  
                                        value={contractObj.startDate} 
                                        placeholder="Start date" 
                                        name="startDate" 
                                        id="startDate"  />
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                        {/* className="gf-form-label b-0 bg-transparent"> */}
                                            End Date <span style={{ color: 'red' }}> * </span>
                                            </label>
                                        <input type="Date" 
                                        className="gf-form-input fwidth" 
                                        maxLength={255}
                                        onChange={this.onChange}  
                                        value={contractObj.endDate} 
                                        placeholder="End date" 
                                        name="endDate" 
                                        id="endDate"   />
                                    </div>  
                                 </div>
                                 </div>
                                 </section>
               

        );
    }
}

export default withApollo(Contract);