import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { commonFunctions } from '../../_utilites/common.functions';
import "../../../css/custom.css"
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
import { ADD_CONTRACT_MUTATION  } from '../_queries';
import * as moment from 'moment';


export interface ContractProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    contractList?:any;

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


    showDetails(e: any, bShow: boolean, editObj: any, modelHeader: any) {
        e && e.preventDefault();
        const { contractObj } = this.state;
        contractObj.id = editObj.id;
        contractObj.vendorName = editObj.vendorName;
        contractObj.durationOfContract = editObj.durationOfContract;
        contractObj.typeOfOwnerShip = editObj.typeOfOwnerShip;
        contractObj.startDate = moment(editObj.strStartDate,"DD-MM-YYYY").format("YYYY-MM-DD");
        contractObj.endDate = moment(editObj.strEndDate,"DD-MM-YYYY").format("YYYY-MM-DD")
        this.setState(() => ({
            isModalOpen: bShow,
            contractObj: contractObj,
            modelHeader: modelHeader,
            errorMessage: "",
            successMessage: "",
        }));
    }
    createRow(objAry: any) {
        const { source } = this.state;
        console.log("createRow() - Contract list on Contract page:  ", objAry);
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
                <td>{obj.vendorName}</td>
                <td>{obj.durationOfContract}</td>
                <td>{obj.typeOfOwnerShip}</td>
                <td>{obj.strStartDate}</td>
                <td>{obj.strEndDate}</td>
                <td>
                    {
                        <button className="btn btn-primary" onClick={e => this.showDetails(e, true, obj, "Edit Contract")}>Edit</button>
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
            contractObj: {},
            modelHeader: headerLabel,
            errorMessage: "",
            successMessage: "",
        }));
    }
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

    validateDates(startDate: any, endDate: any){
        let stDate = moment(startDate, "YYYY-MM-DD");
        let enDate = moment(endDate, "YYYY-MM-DD");
        if (enDate.isSameOrBefore(stDate) || stDate.isSameOrAfter(enDate)) {
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

    save = (e: any) => {
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
                                <div className="fwidth-modal-text m-r-1 ">
                                        <label className="gf-form-label b-0 bg-transparent">vendorName</label>
                                        <input type="text" required className="gf-form-input" onChange={this.onChange}  value={contractObj.vendorName} placeholder="vendorName" name="vendorName" id="vendorName" maxLength={255}/>
                                    </div> 
                                    <div className="fwidth-modal-text m-r-1 ">
                                        <label className="gf-form-label b-0 bg-transparent">durationOfContract</label>
                                        <input type="text" required className="gf-form-input" onChange={this.onChange}  value={contractObj.durationOfContract} placeholder="durationOfContract" name="durationOfContract" id="durationOfContract" maxLength={255}/>
                                    </div> 
                                   </div>
                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">typeOfOwnerShip<span style={{ color: 'red' }}> * </span></label>
                                        <select name="typeOfOwnerShip" id="typeOfOwnerShip" onChange={this.onChange} value={contractObj.typeOfOwnerShip} className="gf-form-input">
                                            <option key={""} value={""}>Select typeOfOwnerShip</option>
                                            <option key={"COMPANYOWNED"} value={"COMPANYOWNED"}>COMPANYOWNED</option>
                                            <option key={"CONTRACTUAL"} value={"CONTRACTUAL"}>CONTRACTUAL</option>
                                        </select>
                                    </div>
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Start Date <span style={{ color: 'red' }}> * </span></label>
                                        <input type="Date" className="gf-form-input" onChange={this.onChange}  value={contractObj.startDate} placeholder="Start date" name="startDate" id="startDate" maxLength={10}  />
                                    </div>
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">End Date <span style={{ color: 'red' }}> * </span></label>
                                        <input type="Date" className="gf-form-input" onChange={this.onChange}  value={contractObj.endDate} placeholder="End date" name="endDate" id="endDate" maxLength={10}  />
                                    </div>
                                  
                                <div className="m-t-1 text-center">
                                    {
                                        modelHeader === "Add New Contract" ?
                                        <button type="button" id="btnAdd" className="btn btn-primary border-bottom" onClick={this.save} >Save</button>
                                        :
                                        <button type="button" id="btnUpdate" className="btn btn-primary border-bottom" onClick={this.save}>Update</button>
                                    }
                                    &nbsp;<button className="btn btn-danger border-bottom" onClick={(e) => this.showModals(e, false, modelHeader)}>Cancel</button>
                                    
                                </div>
                                 </div>
                        </form>
                        
                        
                    </ModalBody>
                </Modal>
               

<button className="btn btn-primary" style={{width:'200px'}} onClick={e => this.showModals(e, true, "Add New Contract")}>
<i className="fa fa-plus-circle"></i> Add New contract
</button>
{
              

contractList !== null && contractList !== undefined && contractList.length > 0 ?
    <div style={{width:'100%', height:'250px', overflow:'auto'}}>
        <table id="contractTable" className="striped-table fwidth bg-white p-2 m-t-1">
            <thead>
                <tr>
                <th>id</th>
                <th> vendor Name</th>
                <th>duration Of Contract</th>
                <th>type Of Owner Ship</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Edit</th>
                </tr>
            </thead>
            <tbody>
                { this.createRow(contractList) }
            </tbody>
        </table>
    </div>
    : null
  }  
</main>
        );
    }
}

export default withApollo(Contract);