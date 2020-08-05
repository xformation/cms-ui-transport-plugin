import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { commonFunctions } from '../../_utilites/common.functions';
import "../../../css/custom.css"
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
import { ADD_TRANSPORTROUTE_STOP_MUTATION,  GET_TRANSPORT_ROUTE_STOPAGE_LIST  } from '../_queries';
import moment = require('moment');
import wsCmsBackendServiceSingletonClient from '../../../wsCmsBackendServiceClient';

export interface VehicleProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    transportRouteList?: any;
    transportRouteStopageList?: any;
    vehicleFilterCacheList?: any;
    transportRoute: any;
    stopage: any;
    onSaveUpdate?: any;
    user?:any;
}

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in Transportroutestopage service, Transportroutestopage could not be saved. Please check Transportroutestopage service logs";
const SUCCESS_MESSAGE_TRANSPORTROUTESTOPAGE_ADDED = "New TransportRouteStopage saved successfully";
const SUCCESS_MESSAGE_TRANSPORTROUTESTOPAGE_UPDATED = "Transportroutestopage updated successfully";
// const ERROR_MESSAGE_INSURANCE_FIELD = "select one insurance for one vehicle only"

class TransportRouteStopageList<T = {[data: string]: any}> extends React.Component<VehicleProps, any> {
    constructor(props: VehicleProps) {
        super(props);
        this.state = {
            list: this.props.data,
            transportRouteList: this.props.transportRouteList,
            transportRouteStopageList: this.props.transportRouteStopageList,
            stopageList: this.props.stopaeList,
            vehicleFilterCacheList: this.props.vehicleFilterCacheList,
            isModalOpen: false,
            transportRouteObj: {
                stopage:{
                    id:""
                },
                transportRoute:{
                    id:""
                },
                routeName: "",
                routeDetails: "",
                routeMapUrl: "",    
                noOfStops: "",
                routeFrequency: "", 
                status: "",
                stopageName: "", 
                stopageId:"",
                transportRouteId:"",
                transportRouteStopageData: [],
            },
            errorMessage: "",
            successMessage: "",
            modelHeader: ""
        };
        this.createTransportRoute = this.createTransportRoute.bind(this);
        this.createStopage = this.createStopage.bind(this); 
        this.checkAllRoutes = this.checkAllRoutes.bind(this);
        this.createRouteStopageRow = this.createRouteStopageRow.bind(this);
        // this.createNoRecordMessage = this.createNoRecordMessage.bind(this);
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

  createTransportRoute(transportRoute: any) {
    let transportRouteOptions = [
      <option key={0} value="">
        Select TransportRoute
      </option>,
    ];
    for (let i = 0; i < transportRoute.length; i++) {
        transportRouteOptions.push(
        <option key={transportRoute[i].id} value={transportRoute[i].id}>
          {transportRoute[i].routeName}
        </option>
      );
    }
    return transportRouteOptions;
  }
  createStopage(stopage: any) {
    let stopageOptions = [
      <option key={0} value="">
        Select StopageName 
      </option>,
    ];
    for (let i = 0; i < stopage.length; i++) {
        stopageOptions.push(
        <option key={stopage[i].id} value={stopage[i].id}>
          {stopage[i].stopageName}
        </option>
      );
    }
    return stopageOptions;
  }
  createRouteStopageRow(objAry: any) {
    const {source} = this.state;
    console.log("TRANSPORT R---->> ", objAry);
      console.log("createRouteStopageRow() - RouteStopage list on AddTransportRouteStopage page:  ", objAry);
      if(objAry === undefined || objAry === null) {
        return;
    }
    const mutateResLength = objAry.length;
    const retVal = [];
    for (let i = 0; i < mutateResLength; i++) {
        const transportRouteObj = objAry[i];
        retVal.push(
            <tr>
          <td>{transportRouteObj.id}</td>
          <td>{transportRouteObj.transportRoute.routeName}</td>
          <td>{transportRouteObj.transportRoute.routeDetails}</td>
          <td>{transportRouteObj.transportRoute.noOfStops}</td>
          <td>{transportRouteObj.transportRoute.routeMapUrl}</td>
          <td>{transportRouteObj.transportRoute.routeFrequency}</td>
          <td>{transportRouteObj.transportRoute.status}</td>
          <td>{transportRouteObj.stopage.stopageName}</td>
          <td>      
          <button className="btn btn-primary" onClick={e => this.showDetail(e, true, transportRouteObj, "Edit RouteStopage")}>Edit</button>

            {/* <button className="btn btn-primary" onClick={e => this.editTransportRouteStopage(k)}>Edit</button> */}
          </td>
          
        </tr>
        );
    }
    return retVal;
}  

//     const { transportRouteObj } = this.state;
//     const len = obj.length;
//     const retVal = [];
//     let aryLength = 0;
//     // for (let p = 0; p < len; p++) {
//     let v = obj[0];
//     if (v.data.updateTransportRoute === undefined || v.data.updateTransportRoute === null) {
//       return;
//     }
//     for (let x = 0; x < v.data.updateTransportRoute.length; x++) {
//       let k = v.data.updateTransportRoute[x];
//       retVal.push(
//         <tr>
//           <td>{k.id}</td>
//           <td>{k.categoryName}</td>
//           <td>{k.description}</td>
//           <td>{k.status}</td>
//           <td>{k.strStartDate}</td>
//           <td>{k.strEndDate}</td>
//           <td>
//             <button className="btn btn-primary" onClick={e => this.editTransportRoute(k)}>Edit</button>
//           </td>
          
//         </tr>
//       );
//     }
//     // }
//     return retVal;
//   }
  editTransportRouteStopage(obj: any) {
    const { transportRouteObj } = this.state;
    let txtRn: any = document.querySelector("#routeName");
    let txtRd: any = document.querySelector("#routeDetails");
    let txtNs: any = document.querySelector("#noOfStops");
    let txtRu: any = document.querySelector("#routeMapUrl");
    let txtRf: any = document.querySelector("#routeFrequency");
    // let chkSts: any = document.querySelector("#status");
    let txtSn: any = document.querySelector("#stopageName");
    
 
    txtRn.value = obj.routeName;
    txtRd.value = obj.routeDetails;
    txtNs.value = obj.noOfStops;
    txtRu.value = obj.routeMapUrl;
    txtRf.value = obj.routeFrequency;
    txtSn.value = obj.stopageName;

    transportRouteObj.transportRouteStopage.id = obj.id;
    transportRouteObj.transportroute.routeName = obj.routeName;
    transportRouteObj.transportroute.noOfStops = obj.noOfStops;
    transportRouteObj.transportroute.routeMapUrl = obj.routeMapUrl;
    transportRouteObj.transportroute.routeDetails = obj.routeDetails;
    transportRouteObj.transportroute.routeFrequency = obj.routeFrequency;
    transportRouteObj.stopage.stopageName = obj.stopageName;

    // transportRouteObj.status = obj.status;

    this.setState({
      
      transportRouteObj: transportRouteObj
    });
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
showModal(e: any, bShow: boolean, headerLabel: any) {
    e && e.preventDefault();
    this.setState(() => ({
        isModalOpen: bShow,
        transportRouteObj: {},
        modelHeader: headerLabel,
        errorMessage: "",
        successMessage: "",
    }));
}
    onChange = (e: any) => {
        e.preventDefault();
        const { name, value } = e.nativeEvent.target;
        const { transportRouteObj } = this.state;
        this.setState({
            transportRouteObj: {
                ...transportRouteObj,
                [name]: value
            },
            errorMessage: "",
            successMessage: "",
        });
        
        commonFunctions.restoreTextBoxBorderToNormal(name);
    }

   getAddTransportRouteStopageLinkInput(transportRouteObj: any, modelHeader: any){
        let id = null;
        if(modelHeader === "Edit RouteStopage"){
            id = transportRouteObj.id;
        }
        let input = {
            id: id,
            transportRouteId: transportRouteObj.transportRouteId,
            stopageId: transportRouteObj.stopageId,
        };
        return input;
    }
    validateFields(obj: any){
        let isValid = true;
        let errorMessage = ""
        if(obj.transportRouteId === undefined || obj.transportRouteId === null || obj.transportRouteId === ""){
            commonFunctions.changeTextBoxBorderToError((obj.transportRouteId === undefined || obj.transportRouteId === null) ? "" : obj.transportRouteId, "transportRouteId");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.stopageId === undefined || obj.stopageId === null || obj.stopageId === ""){
          commonFunctions.changeTextBoxBorderToError((obj.stopageId === undefined || obj.stopageId === null) ? "" : obj.stopageId, "stopageId");
          errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
          isValid = false;
      }
        this.setState({
            errorMessage: errorMessage
        });
        return isValid; 

    }
    async doSave(input: any, id: any){
        let btn = document.querySelector("#"+id);
        btn && btn.setAttribute("disabled", "true");
        let exitCode = 0;
        
        await this.props.client.mutate({
            mutation: ADD_TRANSPORTROUTE_STOP_MUTATION,
            variables: { 
                input: input
            },
        }).then((resp: any) => {
            console.log("Success in saveTransportRouteStopageLink Mutation. Exit code : ",resp.data.saveTransportRouteStopageLink.cmsTransportRouteStopageLinkVo.exitCode);
            exitCode = resp.data.saveTransportRouteStopageLink.cmsTransportRouteStopageLinkVo.exitCode;
            let temp = resp.data.saveTransportRouteStopageLink.cmsTransportRouteStopageLinkVo.dataList; 
            console.log("New TransportRouteStopage list : ", temp);
            this.setState({
              transportRouteStopageList: temp
            });
        }).catch((error: any) => {
            exitCode = 1;
            console.log('Error in saveTransportRouteStopageLink : ', error);
        });
        btn && btn.removeAttribute("disabled");
        
        let errorMessage = "";
        let successMessage = "";
        if(exitCode === 0 ){
            successMessage = SUCCESS_MESSAGE_TRANSPORTROUTESTOPAGE_ADDED;
            if(input.id !== null){
                successMessage = SUCCESS_MESSAGE_TRANSPORTROUTESTOPAGE_UPDATED;
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
        const {transportRouteObj, modelHeader} = this.state;
        let isValid = this.validateFields(transportRouteObj);
        if(isValid === false){
            return;
        }
        const input = this.getAddTransportRouteStopageLinkInput(transportRouteObj, modelHeader);
        this.doSave(input, id);
    }
    async getTransportRouteStopageList(e: any){
        console.log("Refreshing route list");
        const { data } =  await this.props.client.query({
            query: GET_TRANSPORT_ROUTE_STOPAGE_LIST,
            fetchPolicy: 'no-cache'
        })
        const temp = data.getTransportRouteStopageList;
        this.setState({
            list: temp
        });
    }
    checkAllRoutes(e: any){
        const { transportRouteObj } = this.state;
        const mutateResLength = transportRouteObj.mutateResult.length;
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
    // createNoRecordMessage(objAry: any) {
    //     const mutateResLength = objAry.length;
    //     const retVal = [];
    //     for (let x = 0; x < mutateResLength; x++) {
    //       const tempObj = objAry[x];
    //       const transportRoute = tempObj.data.getTransportRouteList;
    //       const length = transportRoute.length;
    //       if (length === 0) {
    //         retVal.push(
    //           <h4 className="ptl-06">No Record Found</h4>
    //         );
    //       }
    //     }
    //     return retVal;
    //   }
    render() {
        const {transportRouteStopageList,stopageList ,vehicleFilterCacheList,  isModalOpen, transportRouteObj, modelHeader, errorMessage, successMessage} = this.state;
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
                            <button className="btn btn-primary mr-1" id="btnSaveFeeCategory" name="btnSaveFeeCategory" onClick={this.addTransportRoute} style={{ width: '140px' }}>Add Route Stopage</button>
                            <button className="btn btn-primary mr-1" id="btnUpdateFeeCategory" name="btnUpdateFeeCategory" onClick={this.addTransportRoute} style={{ width: '170px' }}>Update Route Stopage</button>
                            </div>
                            </div>
        <div id="feeCategoryDiv" className="b-1">
          <div className="b1 row m-1 j-between">
              
          <div className="mdflex modal-fwidth"> 
                <div className="fwidth-modal-text m-r-1">
                <label htmlFor="">
                  TransportRoute<span style={{ color: 'red' }}> * </span>
                </label>
              <select required name="transportRouteId" 
              id="transportRouteId" 
              onChange={this.onChange}  
              value={transportRouteObj.transportRouteId} 
              className="gf-form-input fwidth">
               {this.createTransportRoute(vehicleFilterCacheList.transportRoute)}
               </select>
                 </div>
             <div className="fwidth-modal-text m-r-1">
             <label htmlFor="">
               Stopage<span style={{ color: 'red' }}> * </span>
               </label>
                <select required name="stopageId" 
                id="stopageId" 
                onChange={this.onChange}  
                value={transportRouteObj.stopageId} 
                className="gf-form-input fwidth">
                 {this.createStopage(vehicleFilterCacheList.stopage)}
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
                <th>Route Name</th>
                <th>Route Details</th>
                <th>RouteMapUrl</th>
                <th>NoOfStops</th>
                <th>Route Frequency</th>
                <th>Status</th>
                <th>Stopage Name</th>   
                <th>Edit</th>
              </tr>
            </thead>

            <tbody>
               { this.createRouteStopageRow(transportRouteStopageList) }
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

export default withApollo(TransportRouteStopageList);