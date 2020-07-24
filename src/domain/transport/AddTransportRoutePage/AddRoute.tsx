import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { commonFunctions } from '../../_utilites/common.functions';
import  "../../../css/custom.css";
import '../../../css/college-settings.css';
import '../../../css/tabs.css'; 
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
// import * as moment from 'moment';
import moment = require('moment');
import { ADD_ROUTE_MUTATION } from "./../_queries";
import wsCmsBackendServiceSingletonClient from '../../../wsCmsBackendServiceClient';


export interface RouteProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    trList?: any;
    trData?:any;
    onSaveUpdate?: any;
    user?:any;

}

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in transportRoute service, transportRoutes could not be saved. Please check vehicle service logs";
const SUCCESS_MESSAGE_TRANSPORT_ROUTE_ADDED = "New transportRoute saved successfully";
const SUCCESS_MESSAGE_TRANSPORT_ROUTE_UPDATED = "Transport Route updated successfully";

class RouteGrid<T = {[data: string]: any}> extends React.Component<RouteProps, any> {
    constructor(props: RouteProps) {
         super(props);
        this.state = {
            trList: this.props.trList,
            isModalOpen: false,
            trObj: {
                routeName:"",
                routeDetails:"",
                routeMapUrl:"",
                noOfStops:"",
                routeFrequency:"",
                status:"",
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
        const { trObj } = this.state;
        
        this.setState({
            trObj: {
                ...trObj,
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
    getAddTransportRouteInput(trObj: any, modelHeader: any){
        let id = null;
        // if(modelHeader === "Edit Transport Route"){
        //     id = trObj.id;
        // }
        let trInput = {
            id: id,
            routeName: trObj.routeName,
            routeDetails: trObj.routeDetails,
            routeMapUrl: trObj.routeMapUrl,
            noOfStops: trObj.noOfStops,
            routeFrequency: trObj.routeFrequency,
            status: trObj.status,
        };
        return trInput;
    }

    validateField(trObj: any){
        let isValid = true;
        let errorMessage = ""
        if(trObj.routeName === undefined || trObj.routeName === null || trObj.routeName === "")
        {
            commonFunctions.changeTextBoxBorderToError((trObj.routeName === undefined || trObj.routeName === null) ? "" : trObj.routeName, "routeName");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(trObj.noOfStops === undefined || trObj.noOfStops === null || trObj.noOfStops === ""){
            commonFunctions.changeTextBoxBorderToError((trObj.noOfStops === undefined || trObj.noOfStops === null) ? "" : trObj.noOfStops , "noOfStops");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(trObj.routeFrequency === undefined || trObj.routeFrequency === null || trObj.routeFrequency === ""){
            commonFunctions.changeTextBoxBorderToError((trObj.routeFrequency === undefined || trObj.routeFrequency === null) ? "" : trObj.routeFrequency, "routeFrequency");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        this.setState({
            errorMessage: errorMessage
        });
        return isValid; 

    }

    async doSave(trInput: any, id: any){
      let btn = document.querySelector("#"+id);
      btn && btn.setAttribute("disabled", "true");
      let exitCode = 0;

      await this.props.client.mutate({
          mutation: ADD_ROUTE_MUTATION,
          variables: { 
              input: trInput
          },
      }).then((resp: any) => {
          console.log("Success in addTransportRoute Mutation. Exit code : ",resp.data.addTransportRoute.cmsTransportRouteVo.exitCode);
          exitCode = resp.data.addTransportRoute.cmsTransportRouteVo.exitCode;
          let temp = resp.data.addTransportRoute.cmsTransportRouteVo.dataList; 
          console.log("New Transport Route list : ", temp);
          this.setState({
              trList: temp
          });
      }).catch((error: any) => {
          exitCode = 1;
          console.log('Error in addTransportRoute : ', error);
      });
      btn && btn.removeAttribute("disabled"); 
      let errorMessage = "";
      let successMessage = "";
      if(exitCode === 0 ){
          successMessage = SUCCESS_MESSAGE_TRANSPORT_ROUTE_ADDED;
          if(trInput.id !==null){
              successMessage = SUCCESS_MESSAGE_TRANSPORT_ROUTE_UPDATED;
          }
      }else {
          errorMessage = ERROR_MESSAGE_SERVER_SIDE_ERROR;
      }
      this.setState({
          successMessage: successMessage,
          errorMessage: errorMessage
      });
  }

    addTransport = (e: any) => {
        const { id } = e.nativeEvent.target;
        const {trObj, modelHeader} = this.state;
        let isValid = this.validateField(trObj);
        if(isValid === false){
            return;
        }
        const trInput = this.getAddTransportRouteInput(trObj, modelHeader);
        this.doSave(trInput, id);
    }
render(){
const {trList, isModalOpen, trObj, modelHeader, errorMessage, successMessage} = this.state;
        return (
            // <main>
            //     <Modal isOpen={isModalOpen} className="react-strap-modal-container">
            //         <ModalHeader>{modelHeader}</ModalHeader>
            //         <ModalBody className="modal-content">
            //             <form className="gf-form-group section m-0 dflex">
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
          <h5 className="mtf-8 dark-gray">TransportRoute Details</h5>
        </div>
        <div id="headerRowDiv" className="b-1 h5-fee-bg j-between">
          <div className="m-1 fwidth">Add Route Data</div>
          <div id="saveRouteCatDiv" className="fee-flex">
            <button className="btn btn-primary mr-1" id="btnSaveFeeCategory" name="btnSaveFeeCategory" onClick={this.addTransport} style={{ width: '140px' }}>Add Route</button>
            {/* <button className="btn btn-primary mr-1" id="btnUpdateFeeCategory" name="btnUpdateFeeCategory" onClick={this.addLibrary} style={{ width: '170px' }}>Update Book</button> */}
          </div>
        </div>
        <div id="feeCategoryDiv" className="b-1">
        <div className="form-grid">
           <div>
            <label htmlFor="">
            {/* className="gf-form-label b-0 bg-transparent"> */}
                Route Name <span style={{ color: 'red' }}> * </span>
                </label>
            <input type="text" 
            required className="gf-form-input fwidth" 
            maxLength={255}  
            onChange={this.onChange}  
            value={trObj.routeName} 
            placeholder="routeName" 
            name="routeName" 
            id="routeName"/>
           </div>
           <div>
             <label htmlFor="">
             {/* className="gf-form-label b-0 bg-transparent"> */}
                 Route Details<span style={{ color: 'red' }}> * </span>
                 </label>
             <input type="text"  
             className="gf-form-input fwidth" 
             maxLength={255}  
             onChange={this.onChange}  
             value={trObj.routeDetails} 
             placeholder="routeDetails" 
             name="routeDetails" 
             id="routeDetails"/>
           </div>
           <div>
             <label htmlFor="">
             {/* className="gf-form-label b-0 bg-transparent"> */}
                 RouteMapUrl <span style={{ color: 'red' }}> * </span>
                 </label>
             <input type="text"  
             className="gf-form-input fwidth" 
             maxLength={255}  
             onChange={this.onChange}  
             value={trObj.routeMapUrl} 
             placeholder="routeMapUrl" 
             name="routeMapUrl" 
             id="routeMapUrl"/>
           </div>
           <div>
             <label htmlFor="">
             {/* className="gf-form-label b-0 bg-transparent"> */}
                 NoOfStops<span style={{ color: 'red' }}> * </span>
                 </label>
             <input type="text" 
             required className="gf-form-input fwidth" 
             maxLength={255}  
             onChange={this.onChange}  
             value={trObj.noOfStops} 
             placeholder="noOfStops" 
             name="noOfStops" 
             id="noOfStops"/>
           </div>

           <div>
                        <label htmlFor="">
                        {/* className="gf-form-label b-0 bg-transparent"> */}
                            Route Frequency<span style={{ color: 'red' }}> * </span>
                            </label>
                         <select name="routeFrequency" 
                         id="routeFrequency" 
                         onChange={this.onChange} 
                         value={trObj.routeFrequency} 
                         required className="gf-form-input fwidth" 
                         >
                                <option key={""} value={""}>Select Route Frequency</option>
                                <option key={"MORNINGPICKUP"} value={"MORNINGPICKUP"}>MORNINGPICKUP</option>
                               <option key={"AFTERNOONDROPANDPICKUP"} value={"AFTERNOONDROPANDPICKUP"}>AFTERNOONDROPANDPICKUP</option>
                                 <option key={"AFTERNOONDROP"} value={"AFTERNOONDROP"}>AFTERNOONDROP</option>
                                <option key={"EVENINGDROP"} value={"EVENINGDROP"}>EVENINGDROP</option>
                                             {/* <option key={"DRAFT"} value={"DRAFT"}>DRAFT</option> */}
                         </select>
                         </div> 
           <div>
                        <label htmlFor="">
                        {/* className="gf-form-label b-0 bg-transparent"> */}
                            Status<span style={{ color: 'red' }}> * </span>
                            </label>
                        <select name="status" 
                        id="status" 
                        onChange={this.onChange} 
                        value={trObj.status} 
                        className="gf-form-input fwidth" 
                        >
                                <option key={""} value={""}>Select Status</option>
                                 <option key={"ACTIVE"} value={"ACTIVE"}>ACTIVE</option>
                                <option key={"DEACTIVE"} value={"DEACTIVE"}>DEACTIVE</option>
                                <option key={"DRAFT"} value={"DRAFT"}>DRAFT</option>
                        </select>
            </div> 
           </div>
           </div>
           </section>
        );
}
}
                             

export default withApollo(RouteGrid);
