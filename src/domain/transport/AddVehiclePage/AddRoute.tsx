import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { commonFunctions } from '../../_utilites/common.functions';
import  "../../../css/custom.css";
import '../../../css/college-settings.css';
import '../../../css/tabs.css'; 
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
import * as moment from 'moment';
import { ADD_ROUTE_MUTATION } from "./../_queries";

export interface RouteProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    trList?: any;
    onSaveUpdate?: any;
}

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in vehicle service, vehicles could not be saved. Please check vehicle service logs";
const SUCCESS_MESSAGE_TRANSPORT_ROUTE_ADDED = "New transport saved successfully";
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
            },
            errorMessage: "",
            successMessage: "",
            modelHeader: ""
        };
        
    }
    
    showDetail(e: any, bShow: boolean,editObj: any, modelHeader: any) {
        e && e.preventDefault();
        const { trObj } = this.state;
        trObj.id = editObj.id;
        trObj.routeName = editObj.routeName;
        trObj.routeDetails = editObj.routeDetails;
        trObj.routeMapUrl = editObj.routeMapUrl;
        trObj.noOfStops = editObj.noOfStops;
        trObj.routeFrequency = editObj.routeFrequency;
        this.setState(() => ({
            isModalOpen: bShow,
            trObj: trObj,
            modelHeader: modelHeader,
            errorMessage: "",
            successMessage: "",
        }));
    }

    createRows(objAry: any) {
        const { source } = this.state;
        console.log("createRows() - TransportRoute list on TransportRoute  page:  ", objAry);
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
                <td>{obj.routeName}</td>
                <td>{obj.routeDetails}</td>
                <td>{obj.routeMapUrl}</td>
                <td>{obj.noOfStops}</td>
                <td>{obj.routeFrequency}</td>
                <td>
                    {
                        <button className="btn btn-primary" onClick={e => this.showDetail(e, true, obj, "Edit Transport Route")}>Edit</button>
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
            trObj: {},
            modelHeader: headerLabel,
            errorMessage: "",
            successMessage: "",
        }));
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

    getAddTransportRouteInput(trObj: any, modelHeader: any){
        let id = null;
        if(modelHeader === "Edit Transport Route"){
            id = trObj.id;
        }
        let trInput = {
            id: id,
            routeName: trObj.routeName,
            routeDetails: trObj.routeDetails,
            routeMapUrl: trObj.routeMapUrl,
            noOfStops: trObj.noOfStops,
            routeFrequency: trObj.routeFrequency
        };
        return trInput;
    }

    validateFields(obj: any){
        let isValid = true;
        let errorMessage = ""
        if(obj.routeName === undefined || obj.routeName === null || obj.routeName === ""){
            commonFunctions.changeTextBoxBorderToError((obj.routeName === undefined || obj.routeName === null) ? "" : obj.routeName, "routeName");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.noOfStops === undefined || obj.noOfStops === null || obj.noOfStops === ""){
            commonFunctions.changeTextBoxBorderToError((obj.noOfStops === undefined || obj.noOfStops === null) ? "" : obj.noOfStops , "noOfStops");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.routeFrequency === undefined || obj.routeFrequency === null || obj.routeFrequency === ""){
            commonFunctions.changeTextBoxBorderToError((obj.routeFrequency === undefined || obj.routeFrequency === null) ? "" : obj.routeFrequency, "routeFrequency");
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
          console.log("Success in addTransportRoute Mutation. Exit code : ",resp.data.addTransportRoute.cmsTransportVo.exitCode);
          exitCode = resp.data.addTransportRoute.cmsTransportVo.exitCode;
          this.props.onSaveUpdate(resp.data.addTransportRoute.cmsTransportVo.dataList);
          let temp = resp.data.addTransportRoute.cmsTransportVo.dataList; 
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



    addTransportRoute = (e: any) => {
        const { id } = e.nativeEvent.target;
        const {trObj, modelHeader} = this.state;
        let isValid = this.validateFields(trObj);
        if(isValid === false){
            return;
        }
        const trInput = this.getAddTransportRouteInput(trObj, modelHeader);
        this.doSave(trInput, id);
    }
render(){
const {trList, isModalOpen, trObj, modelHeader, errorMessage, successMessage} = this.state;
        return (
            <main>
                <Modal isOpen={isModalOpen} className="react-strap-modal-container">
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
                                <div className="fwidth-modal-text modal-fwidth">
                                    <label className="gf-form-label b-0 bg-transparent">Route Name <span style={{ color: 'red' }}> * </span></label>
                                    <input type="text" className="gf-form-input " onChange={this.onChange}  value={trObj.routeName} placeholder="routeName" name="routeName" id="routeName" maxLength={150} />
                                </div>
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">noOfStops<span style={{ color: 'red' }}> * </span></label>
                                        <input type="text" required className="gf-form-input" onChange={this.onChange}  value={trObj.noOfStops} placeholder="noOfStops" name="noOfStops" id="noOfStops" maxLength={150}/>
                                    </div>
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">routeDetails</label>
                                        <input type="text" required className="gf-form-input" onChange={this.onChange}  value={trObj.routeDetails} placeholder="routeDetails" name="routeDetails" id="routeDetails" maxLength={150}/>
                                    </div>
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">routeMapUrl</label>
                                        <input type="text" required className="gf-form-input" onChange={this.onChange}  value={trObj.routeMapUrl} placeholder="routeMapUrl" name="routeMapUrl" id="routeMapUrl" maxLength={150}/>
                                    </div>
                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">routeFrequency<span style={{ color: 'red' }}> * </span></label>
                                        <select name="routeFrequency" id="routeFrequency" onChange={this.onChange} value={trObj.routeFrequency} className="gf-form-input">
                                            <option key={""} value={""}>Select Route Frequency</option>
                                            <option key={"MORNINGPICKUP"} value={"MORNINGPICKUP"}>MORNINGPICKUP</option>
                                            <option key={"AFTERNOONDROPANDPICKUP"} value={"AFTERNOONDROPANDPICKUP"}>AFTERNOONDROPANDPICKUP</option>
                                            <option key={"AFTERNOONDROP"} value={"AFTERNOONDROP"}>AFTERNOONDROP</option>
                                            <option key={"EVENINGDROP"} value={"EVENINGDROP"}>EVENINGDROP</option>
                                            {/* <option key={"DRAFT"} value={"DRAFT"}>DRAFT</option> */}
                                        </select>
                                    </div> 
                                <div className="m-t-1 text-center">
                                    {
                                        modelHeader === "Add New Academic Year" ?
                                        <button type="button" id="btnAdd" className="btn btn-primary border-bottom" onClick={this.addTransportRoute} >Save</button>
                                        :
                                        <button type="button" id="btnUpdate" className="btn btn-primary border-bottom" onClick={this.addTransportRoute}>Update</button>
                                    }
                                    &nbsp;<button className="btn btn-danger border-bottom" onClick={(e) => this.showModal(e, false, modelHeader)}>Cancel</button>
                                    
                                </div>
                            </div>
                        </form>
                    </ModalBody>
                </Modal>
                <button className="btn btn-primary" style={{width:'200px'}} onClick={e => this.showModal(e, true, "Add New Academic Year")}>
                    <i className="fa fa-plus-circle"></i> Add New Route
                </button>
                {
                    trList !== null && trList !== undefined && trList.length > 0 ?
                        <div style={{width:'100%', height:'250px', overflow:'auto'}}>
                            <table id="veTable" className="striped-table fwidth bg-white p-2 m-t-1">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>routeName</th>
                                        <th>routeDetails</th>
                                        <th>routeMapUrl</th>
                                        <th>noOfStops</th>
                                        <th>routeFrequency</th>
                                        <th>Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.createRows(trList) }
                                </tbody>
                            </table>
                        </div>
                    : null
                }
                
            </main>
        );
    }
}

export default withApollo(RouteGrid);
