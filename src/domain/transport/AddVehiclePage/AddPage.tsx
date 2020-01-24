import DatePicker from 'react-datepicker';
import * as moment from 'moment';
import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { commonFunctions } from '../../_utilites/common.functions';
import  "../../../css/custom.css";
import '../../../css/college-settings.css';
import '../../../css/tabs.css'; 
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { graphql, MutationFunc, QueryProps, compose } from 'react-apollo';
//mport { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { ADD_CONTRACT_MUTATION, ADD_INSURANCE_MUTATION, LOAD_ADD_VEHICLE_DATA_CACHE_QUERY,ADD_VEHICLE_MUTATION } from '../_queries';
import withLoadingHandler from '../withLoadingHandler';
import "react-datepicker/dist/react-datepicker.css";
export interface VehicleProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    veList?: any;
    onSaveUpdate?: any;
}
const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in preferences service, branch could not be saved. Please check preferences service logs";
const SUCCESS_MESSAGE_TRANSPORT_ADDED = "New transport saved successfully";
const SUCCESS_MESSAGE_TRANSPORT_UPDATED = "Transport Route updated successfully";

const w180 = {
  width: '180px',
  marginRight: '10px',
};

// type AddVehiclePageStates = {
//   vehicleData: any,
//   branches: any,
//   colleges: any,
//   // transportRoutes: any,
//   dateOfRegistration: any,
//   dateOfInsurance: any,
//   typeOfInsurances: any,
//   typeOfOwnerships: any,
//   validTill:any,
//   startDate:any,
//   endDate:any,
//   add: any,
//   update: any
// }

class VehicleGrid<T={[data:string]:any }>extends React.Component<VehicleProps, any>{
  constructor(props: VehicleProps) {
      super(props);
      this.state = {
        veList: this.props.veList,
        isModalOpen: false,

          veObj: {
              id:null,
            vendorName:"",
            durationOfContract:"",
            vehicleNumber:"",
            vehicleType:"",
            capacity:"",
            ownerShip:"",
            yearOfManufacturing:"",
            manufacturingCompany:"",
            model:"",
            chasisNo:"",
            rcNo:"",
            contactNumber:"",
              college: {
                  id:""
              },
               branch: {
                  id: ""
              },
              employee:{
                id: ""
              },
              transportRoute:{
                id: ""
              },
              contract:{
                id: ""
              },
              insurance:{
                id: ""
              },
              typeOfInsurance:{
                id:""
              },
              typeOfOwnerShip:{
                id:""
              },
              insuranceCompany:"",
          },
          startDate:"",
          endDate:"",
          dateOfInsurance:"",
          dateOfRegistration:"",
          colleges:[],
          branches:[],
          // transportRoutes:[],
          validTill:"",
          typeOfInsurances:[],
          typeOfOwnerships:[],
          add: false,
          update: false,
          errorMessage: "",
          successMessage: "",
          modelHeader: ""     
      };
    
     
    }

    showDetail(e: any, bShow: boolean,editObj: any, modelHeader: any) {
        e && e.preventDefault();
        const { veObj } = this.state;
        veObj.id = editObj.id;
        veObj.vendorName = editObj.vendorName;
        veObj.durationOfContract = editObj.durationOfContract;
        veObj.vehicleNumber = editObj.vehicleNumber;
        veObj.vehicleType = editObj.vehicleType;
        veObj.capacity = editObj.capacity;
        veObj.ownerShip = editObj.ownership;
        veObj.yearOfManufacturing = editObj.yearOfManufacturing;
        veObj.model = editObj.model;
        veObj.chasisNo = editObj.chasisNo;

        veObj.rcNo = editObj.rcNo;



        this.setState(() => ({
            isModalOpen: bShow,
            veObj: veObj,
            modelHeader: modelHeader,
            errorMessage: "",
            successMessage: "",
        }));
    }
    createRows(objAry: any) {
        const { source } = this.state;
        console.log("createRows() - AddPage list on   page:  ", objAry);
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
                <td>{obj.vehicleNumber}</td>
                <td>{obj.vehicleType}</td>
                <td>{obj.capacity}</td>
                <td>{obj.ownerShip}</td>
                <td>{obj.yearOfManufacturing}</td>
                <td>{obj.model}</td>
                <td>{obj.chasisNo}</td>
                <td>{obj.rcNo}</td>

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
            veObj: {},
            modelHeader: headerLabel,
            errorMessage: "",
            successMessage: "",
        }));
    }
    onChange = (e: any) => {
        e.preventDefault();
        const { name, value } = e.nativeEvent.target;
        const { veObj } = this.state;
        
        this.setState({
            veObj: {
                ...veObj,
                [name]: value
            },
            errorMessage: "",
            successMessage: "",
        });
        
        commonFunctions.restoreTextBoxBorderToNormal(name);
    }
    getVehicleInput(veObj: any, modelHeader: any){
        let id = null;
        if(modelHeader === "Edit vehicle "){
            id = veObj.id;
        }
        let veInput = {
            id: id,
            vendorName: veObj.vendorName,
            durationOfContract: veObj.durationOfContract,
            vehicleNumber: veObj.vehicleNumber,
            vehicleType: veObj.vehicleType,
            capacity: veObj.capacity,
            ownerShip: veObj.ownerShip,
            yearOfManufacturing: veObj.yearOfManufacturing,
            model: veObj.model,
            chasisNo: veObj.chasisNo,
            rcNo: veObj.rcNo,
            

        };
        return veInput;
    }
    validateFields(obj: any){
        let isValid = true;
        let errorMessage = ""
        if(obj.vendorName === undefined || obj.vendorName === null || obj.vendorName === ""){
            commonFunctions.changeTextBoxBorderToError((obj.routeName === undefined || obj.vendorName === null) ? "" : obj.vendorName, "vendorName");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.durationOfContract === undefined || obj.durationOfContract === null || obj.durationOfContract === ""){
            commonFunctions.changeTextBoxBorderToError((obj.durationOfContract === undefined || obj.durationOfContract === null) ? "" : obj.noOfStops , "noOfStops");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
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
        if(obj.capacity === undefined || obj.capacity === null || obj.capacity === ""){
            commonFunctions.changeTextBoxBorderToError((obj.capacity === undefined || obj.capacity === null) ? "" : obj.capacity, "capacity");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.ownerShip === undefined || obj.ownerShip === null || obj.ownerShip === ""){
            commonFunctions.changeTextBoxBorderToError((obj.ownerShip === undefined || obj.ownerShip === null) ? "" : obj.ownerShip, "ownerShip");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.yearOfManufacturing === undefined || obj.yearOfManufacturing === null || obj.yearOfManufacturing === ""){
            commonFunctions.changeTextBoxBorderToError((obj.yearOfManufacturing === undefined || obj.yearOfManufacturing === null) ? "" : obj.yearOfManufacturing, "yearOfManufacturing");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.model === undefined || obj.model === null || obj.model === ""){
            commonFunctions.changeTextBoxBorderToError((obj.model === undefined || obj.model === null) ? "" : obj.model, "model");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.chasisNo === undefined || obj.chasisNo === null || obj.chasisNo === ""){
            commonFunctions.changeTextBoxBorderToError((obj.chasisNo === undefined || obj.chasisNo === null) ? "" : obj.chasisNo, "chasisNo");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.rcNo === undefined || obj.rcNo === null || obj.rcNo === ""){
            commonFunctions.changeTextBoxBorderToError((obj.rcNo === undefined || obj.rcNo === null) ? "" : obj.rcNo, "rcNo");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        this.setState({
            errorMessage: errorMessage
        });
        return isValid; 

    }
    
    
    async doSave(veInput: any, id: any){
        let btn = document.querySelector("#"+id);
        btn && btn.setAttribute("disabled", "true");
        let exitCode = 0;

        await this.props.client.mutate({
            mutation: ADD_VEHICLE_MUTATION,
            variables: { 
                input: veInput
            },
        }).then((resp: any) => {
            console.log("Success in addVehiclePage Mutation: ",resp.data.addVehicle.vehicle.exitCode);
            exitCode = resp.data.addVehicle.vehicle.exitCode;
            this.props.onSaveUpdate(resp.data.addVehicle.vehicle);
            let temp = resp.data.addVehicle.vehicle; 
            console.log("New add page list : ", temp);
            this.setState({
                veList: temp
            });
        }).catch((error: any) => {
            console.log('Error in addPage : ', error);
        });
        btn && btn.removeAttribute("disabled");
         exitCode=1
        let errorMessage = "";
        let successMessage = "";
        if(exitCode== 0){
            successMessage = SUCCESS_MESSAGE_TRANSPORT_ADDED;
            if(veInput.id !== null){
                 successMessage = SUCCESS_MESSAGE_TRANSPORT_UPDATED;
            }
        }else {
            errorMessage = ERROR_MESSAGE_SERVER_SIDE_ERROR;
        }
        this.setState({
            successMessage: successMessage,
            errorMessage: errorMessage
        });
    }
    addVehiclePage = (e: any) => {
        const { id } = e.nativeEvent.target;
        const {veObj, modelHeader} = this.state;
        let isValid = this.validateFields(veObj);
        if(isValid === false){
            return;
        }
        const veInput = this.getVehicleInput(veObj, modelHeader);
        this.doSave(veInput, id);
    }


//    createTypeOfInsurances(typeOfInsurances: any) {
//     let typeOfInsurancesOptions = [<option key={""} value="">Select Type Of Insurance</option>];
//     for (let i = 0; i < typeOfInsurances.length; i++) {
//         let typeOfInsurance = typeOfInsurances[i];
//         typeOfInsurancesOptions.push(
//             <option key={typeOfInsurances[i].description} value={typeOfInsurances[i].description}>{typeOfInsurances[i].description}</option>
//         );
//     }
//     return typeOfInsurancesOptions;
//     }

//     createTypeOfOwnerships(typeOfOwnerships: any) {
//     let typeOfOwnershipsOptions = [<option key={""} value="">Select Type Of Ownership</option>];
//     for (let i = 0; i < typeOfOwnerships.length; i++) {
//         let typeOfOwnerShip = typeOfOwnerships[i];
//         typeOfOwnershipsOptions.push(
//             <option key={typeOfOwnerships[i].description} value={typeOfOwnerships[i].description}>{typeOfOwnerships[i].description}</option>
//         );
//     }
//     return typeOfOwnershipsOptions;
//     }
    
    // createTransportRoutes(transportRoutes: any) {
    //   let transportRoutesOptions = [<option key={0} value="">Select routeName</option>];
    //   for (let i = 0; i < transportRoutes.length; i++) {
    //     let transportRoute = transportRoutes[i]
    //     transportRoutesOptions.push(
    //       <option key={transportRoutes[i].id} value={transportRoutes[i].id}>{transportRoutes[i].routeName}</option>
    //     );
    //   }
    //   return transportRoutesOptions;
    // }
//     createBranches(branches: any) {
//       let branchesOptions = [<option key={0} value="">Select branch</option>];
//       for (let i = 0; i < branches.length; i++) {
//         let branch = branches[i]
//         branchesOptions.push(
//           <option key={branches[i].id} value={branches[i].id}>{branches[i].branchName}</option>
//         );
//       }
//       return branchesOptions;
//     }
//     createColleges(colleges: any) {
//       let collegesOptions = [<option key={0} value="">Select college</option>];
//       for (let i = 0; i < colleges.length; i++) {
//         let college = colleges[i]
//         collegesOptions.push(
//           <option key={colleges[i].id} value={colleges[i].id}>{colleges[i].shortName}</option>
//         );
//       }
//       return collegesOptions;
//     }
  
  

//  onChange = (e: any) => {
//   const { name, value } = e.nativeEvent.target;
//   const { vehicleData } = this.state;
//   if(name === "branch"){
//     this.setState({
//       vehicleData: {
//         ...vehicleData,
//         branch: {
//           id: value
//         },
//         college:{
//           id:""
//         },
//         transportRoute:{
//           id:""
//         },
//         typeOfInsurance:{
//           id:""
//         },
//         typeOfOwnerShip:{
//           id:""
//         }
//       }
//     });
//   } else if(name === "college"){
//      this.setState({
//        vehicleData: {
//          ...vehicleData,
//          college: {
//            id: value
//          },
//          transportRoute:{
//           id:""
//         },
//          typeOfInsurance:{
//            id:""
//          },
//          typeOfOwnerShip:{
//            id:""
//          }
//        }
//      })
//   }
//   else if(name === "transportRoute"){
//     this.setState({
//       vehicleData: {
//         ...vehicleData,
//         transportRoute:{
//           id: value
//         },
//         typeOfInsurance: {
//           id: value
//         },
//         typeOfOwnerShip:{
//           id:""
//         }
//       }
//     })
//  }
//   else if(name === "typeOfInsurance"){
//     this.setState({
//       vehicleData: {
//         ...vehicleData,
//         typeOfInsurance: {
//           id: value
//         },
//         typeOfOwnerShip:{
//           id:""
//         }
//       }
//     })
//  }
//  else if(name === "typeOfOwnerShip"){
//   this.setState({
//     vehicleData: {
//       ...vehicleData,
//       typeOfOwnerShip: {
//         id: value
//       },
//     }
//   })
// }else {
//       this.setState({
//           vehicleData: {
//               ...vehicleData,
//               [name]: value
//           }
//       });      
//     }
//   }

//   changeDateOfRegistration = (e: any) => {
//     const varDt = e;
//     console.log("registration date...", varDt);
//     this.setState({
//       dateOfRegistration: varDt
//     });
//   }

// changeDateOfInsurance = (e: any) => {
//   const varDt = e;
//   console.log("insurance date...", varDt);
//   this.setState({
//     dateOfInsurance: varDt
//   });
// }

// changeValidTill = (e: any) => {
//   const varDt = e;
//   console.log("Valid till date...", varDt);
//   this.setState({
//     validTill: varDt
//   });
// }

// isInsDatesOverlap(dateOfInsurance: any, validTill: any){
//   if (validTill.isBefore(dateOfInsurance)) {
//     alert("Valid till date should not be prior to date of insurance date.");
//     return true;
//   }
//   return false;
// }

// changeStartDate = (e: any) => {
//   const varDt = e;
//   console.log("start date...", varDt);
//   this.setState({
//     startDate: varDt
//   });
// }

// changeEndDate = (e: any) => {
//   const varDt = e;
//   console.log("end date...", varDt);
//   this.setState({
//     endDate: varDt
//   });
// }

// isConDatesOverlap(startDate: any, endDate: any){
//   if (endDate.isBefore(startDate)) {
//     alert("start date should not be prior to end date.");
//     return true;
//   }
//   return false;
// }

// saveVehicle(e: any) {
//   const { id, value } = e.nativeEvent.target;
//   const { addVehicle } = this.props;
//   const { vehicleData } = this.state;
//   e.preventDefault();

  // let txtBr: any = document.querySelector("#branch");
  // if (txtBr.value.trim() === "") {
  //   alert("Please select branch");
  //   return;
  // }
  // let txtClg: any = document.querySelector("#college");
  // if (txtClg.value.trim() === "") {
  //   alert("Please select college");
  //   return;
  // }
//   let txtVN: any = document.querySelector("#vehicleNumber");
//   if (txtVN.value.trim() === "") {
//     alert("Please provide some value in Vehicle Number");
//     return;
//   }
//   let txtVT: any = document.querySelector("#vehicleType");
//   if (txtVT.value.trim() === "") {
//     alert("Please provide some value in Vehicle Type");
//     return;
//   }
//   let chkCp: any = document.querySelector("#capacity");
//   if (chkCp.value.trim() === "") {
//     alert("Please provide some value in Capacity");
//     return;
//   }
//   let txtOS: any = document.querySelector("#ownerShip");
//   if (txtOS.value.trim() === "") {
//     alert("Please provide some value in OwnerShip");
//     return;
//   }
//   let txYOM: any = document.querySelector("#yearOfManufacturing");
//   if (txYOM.value.trim() === "") {
//     alert("Please provide some value in Year Of Manufacturing");
//     return;
//   }
//   let txtMC: any = document.querySelector("#manufacturingCompany");
//   if (txtMC.value.trim() === "") {
//     alert("Please provide some value in Manufacturing Company");
//     return;
//   }
//   let txtMd: any = document.querySelector("#model");
//   if (txtMd.value.trim() === "") {
//     alert("Please provide some value in Model");
//     return;
//   }
//   let txtCN: any = document.querySelector("#chasisNo");
//   if (txtCN.value.trim() === "") {
//     alert("Please provide some value in Chasis No");
//     return;
//   }
//   let txtRN: any = document.querySelector("#rcNo");
//   if (txtRN.value.trim() === "") {
//     alert("Please provide some value in RcNo");
//     return;
//   }
//   let txtCoN: any = document.querySelector("#contactNumber");
//   if (txtCoN.value.trim() === "") {
//     alert("Please provide some value in Contact Number");
//     return;
//   }
//   if (this.state.dateOfRegistration === undefined || this.state.dateOfRegistration === null || this.state.dateOfRegistration === "") {
//     alert("Please provide date of registration");
//     return;
//   }

//   let drDate = null;
//   if (this.state.dateOfRegistration !== undefined || this.state.dateOfRegistration !== null || this.state.dateOfRegistration !== "") {
//     drDate = moment(this.state.dateOfRegistration, "YYYY-MM-DD");
//   }
//   let chkStatus: any = document.querySelector("#status");
//     let status = "DEACTIVE";
//     if (chkStatus.checked) {
//       status = "ACTIVE";
//     }
  // let vtDate = null;
  // if (this.state.validTill !== undefined || this.state.validTill !== null || this.state.validTill !== "") {
  //   vtDate = moment(this.state.validTill, "YYYY-MM-DD");
  // }
  // if(diDate !== null && vtDate !== null){
  //   if(this.isInsDatesOverlap(diDate, vtDate)){
  //     return;
  //   }
  // }
 
//   let addVehicleInput = {
    // branch:vehicleData.branch.id,
    // college:vehicleData.college.id,
//     vehicleNumber: vehicleData.vehicleNumber,
//     vehicleType: vehicleData.vehicleType,
//     capacity: vehicleData.capacity,
//     ownerShip: vehicleData.ownerShip,
//     yearOfManufacturing: vehicleData.yearOfManufacturing,
//     manufacturingCompany: vehicleData.manufacturingCompany,
//     model: vehicleData.model,
//     chasisNo: vehicleData.chasisNo,
//     rcNo: vehicleData.rcNo,
//     contactNumber: vehicleData.contactNumber,
//     employeeId: vehicleData.employee.id,
//     transportRouteId: vehicleData.transportRoute.id,
//     contractId: vehicleData.contract.id,
//     insuranceId: vehicleData.insurance.id,
//     branchId: vehicleData.branch.id,
//     collegeId: vehicleData.college.id,
//     dateOfRegistration: drDate,
//     status: status,
//   };
//   console.log("form data : ", vehicleData);
//   return addVehicle({
//     variables: { input: addVehicleInput }
//   }).then((data:any) => {
//     console.log('Add Vehicle ::::: ', data);
//     alert("Vehicle added successfully!");
//     const sdt = data;
//     vehicleData.vehicleData = [];
//     vehicleData.vehicleData.push(sdt);
//     // = data.data.addFeeCategory;
//     this.setState({
//       vehicleData: vehicleData
//     });

//   }).catch((error: any) => {
//     alert("Due to some errorvehicle could not be added");
//     console.log('there was an error sending the add vehicle mutation result', error);
//     return Promise.reject(`Could not retrieve add vehicle data: ${error}`);
//   });
// }


// saveInsurance(e: any) {
//   const { id, value } = e.nativeEvent.target;
//   const { addInsurance } = this.props;
//   const { vehicleData } = this.state;
//   e.preventDefault();

//   let txtIc: any = document.querySelector("#insuranceCompany");
//   if (txtIc.value.trim() === "") {
//     alert("Please provide some value in Insurance Company");
//     return;
//   }
//   let txtto: any = document.querySelector("#typeOfInsurance");
//   if (txtto.value.trim() === "") {
//     alert("Please provide some value in Type Of Insurance");
//     return;
//   }
 
//   if (this.state.dateOfInsurance === undefined || this.state.dateOfInsurance === null || this.state.dateOfInsurance === "") {
//     alert("Please provide date of insurance");
//     return;
//   }

//   let diDate = null;
//   if (this.state.dateOfInsurance !== undefined || this.state.dateOfInsurance !== null || this.state.dateOfInsurance !== "") {
//     diDate = moment(this.state.dateOfInsurance, "YYYY-MM-DD");
//   }
//   let vtDate = null;
//   if (this.state.validTill !== undefined || this.state.validTill !== null || this.state.validTill !== "") {
//     vtDate = moment(this.state.validTill, "YYYY-MM-DD");
//   }
//   if(diDate !== null && vtDate !== null){
//     if(this.isInsDatesOverlap(diDate, vtDate)){
//       return;
//     }
//   }
 
//   let addInsuranceInput = {
//     insuranceCompany: vehicleData.insuranceCompany,
//     typeOfInsurance: vehicleData.typeOfInsurance.id,
//     dateOfInsurance: diDate,
//     validTill: vtDate
//   };
//   console.log("form data : ", vehicleData);
//   return addInsurance({
//     variables: { input: addInsuranceInput }
//   }).then((data:any) => {
//     console.log('Add Insurance ::::: ', data);
//     alert("Insurance added successfully!");
//     const sdt = data;
//     vehicleData.vehicleData = [];
//     vehicleData.vehicleData.push(sdt);
//     // = data.data.addFeeCategory;
//     this.setState({
//       vehicleData: vehicleData
//     });
//   }).catch((error: any) => {
//     alert("Due to some error Insurance could not be added");
//     console.log('there was an error sending the add Insurance mutation result', error);
//     return Promise.reject(`Could not retrieve add Insurance data: ${error}`);
//   });
// }

// saveContract(e: any) {
//   const { id, value } = e.nativeEvent.target;
//   const { addContract } = this.props;
//   const { vehicleData } = this.state;
//   e.preventDefault();

//   let txtVn: any = document.querySelector("#vendorName");
//   if (txtVn.value.trim() === "") {
//     alert("Please provide some value in Vendor Name");
//     return;
//   }
//   let txttoo: any = document.querySelector("#typeOfOwnerShip");
//   if (txttoo.value.trim() === "") {
//     alert("Please provide some value in Type Of Ownership");
//     return;
//   }
//   let txtDoc: any = document.querySelector("#durationOfContract");
//   if (txtDoc.value.trim() === "") {
//     alert("Please provide some value in Duration Of Contract");
//     return;
//   }
//   if (this.state.startDate === undefined || this.state.startDate === null || this.state.startDate === "") {
//     alert("Please provide start date");
//     return;
//   }

//   let stDate = null;
//   if (this.state.startDate !== undefined || this.state.startDate !== null || this.state.startDate !== "") {
//     stDate = moment(this.state.startDate, "YYYY-MM-DD");
//   }
//   let enDate = null;
//   if (this.state.endDate !== undefined || this.state.endDate !== null || this.state.endDate !== "") {
//     enDate = moment(this.state.endDate, "YYYY-MM-DD");
//   }
//   if(stDate !== null && enDate !== null){
//     if(this.isInsDatesOverlap(stDate, enDate)){
//       return;
//     }
//   }
 
//   let addContractInput = {
//     vendorName: vehicleData.vendorName,
//     typeOfOwnerShip: vehicleData.typeOfOwnerShip.id,
//     durationOfContract: vehicleData.durationOfContract,
//     startDate: stDate,
//     endDate: enDate
//   };
//   console.log("form data : ", vehicleData);
//   return addContract({
//     variables: { input: addContractInput }
//   }).then((data:any) => {
//     console.log('Add Contract ::::: ', data);
//     alert("Contract added successfully!");
//     const sdt = data;
//     vehicleData.vehicleData = [];
//     vehicleData.vehicleData.push(sdt);
//     this.setState({
//       vehicleData: vehicleData
//     });

//   }).catch((error: any) => {
//     alert("Due to some error Contract could not be added");
//     console.log('there was an error sending the add Contract mutation result', error);
//     return Promise.reject(`Could not retrieve add Contract data: ${error}`);
//   });
// }

// saveAll= (e: any) => {
//   const { id } = e.nativeEvent.target;
//   const { addVehicle,addContract,addInsurance } = this.props;
//   const { vehicleData } = this.state;
//   let vInput = this.saveVehicle(e);
//   if(vInput == null || vInput === undefined){
//       return;
//   }
//   let cInput = this.saveContract(e);
//   if(cInput == null || cInput === undefined){
//     return;
//   }
//   let iInput = this.saveInsurance(e);
//   if(iInput == null || iInput === undefined){
//     return;
//   }
// }
render(){
    const {veList, isModalOpen, veObj, modelHeader, errorMessage, successMessage} = this.state;
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
                <label className="gf-form-label b-0 bg-transparent">vendorName <span style={{ color: 'red' }}> * </span></label>
                <input type="text" className="gf-form-input " onChange={this.onChange}  value={veObj.vendorName} placeholder="vendorName" name="vendorName" id="vendorName" maxLength={150} />
            </div>
                <div className="fwidth-modal-text m-r-1">
                    <label className="gf-form-label b-0 bg-transparent">durationOfContract<span style={{ color: 'red' }}> * </span></label>
                    <input type="text" required className="gf-form-input" onChange={this.onChange}  value={veObj.durationOfContract} placeholder="durationOfContract" name="durationOfContract" id="durationOfContract" maxLength={150}/>
                </div>
                <div className="fwidth-modal-text m-r-1">
                    <label className="gf-form-label b-0 bg-transparent">vehicleNumber</label>
                    <input type="text" required className="gf-form-input" onChange={this.onChange}  value={veObj.vehicleNumber} placeholder="vehicleNumber" name="vehicleNumber" id="vehicleNumber" maxLength={150}/>
                </div>
                <div className="fwidth-modal-text m-r-1">
                    <label className="gf-form-label b-0 bg-transparent"> <th>capacity</th>
</label>
                    <input type="text" required className="gf-form-input" onChange={this.onChange}  value={veObj.capacity} placeholder="capacity" name="capacity" id="capacity" maxLength={150}/>
                </div>
                <div className="fwidth-modal-text m-r-1">
                    <label className="gf-form-label b-0 bg-transparent"> <th>ownerShip</th>
</label>
                    <input type="text" required className="gf-form-input" onChange={this.onChange}  value={veObj.ownerShip} placeholder="ownerShip" name="ownerShip" id="ownerShip" maxLength={150}/>
                </div>
                <div className="fwidth-modal-text m-r-1">
                    <label className="gf-form-label b-0 bg-transparent"> <th>model</th>
</label>
                    <input type="text" required className="gf-form-input" onChange={this.onChange}  value={veObj.model} placeholder="model" name="model" id="model" maxLength={150}/>
                </div>
                <div className="fwidth-modal-text m-r-1">
                    <label className="gf-form-label b-0 bg-transparent"> <th>chasisNo</th>
</label>
                    <input type="text" required className="gf-form-input" onChange={this.onChange}  value={veObj.chasisNo} placeholder="chasisNo" name="chasisNo" id="chasisNo" maxLength={150}/>
                </div>
                <div className="fwidth-modal-text m-r-1">
                    <label className="gf-form-label b-0 bg-transparent"> <th>rcNo</th>
</label>
                    <input type="text" required className="gf-form-input" onChange={this.onChange}  value={veObj.rcNo} placeholder="rcNo" name="rcNo" id="rcNo" maxLength={150}/>
                </div>
                
             <div className="m-t-1 text-center">
                {
                    modelHeader === "Add New Academic Year" ?
                    <button type="button" id="btnAdd" className="btn btn-primary border-bottom" onClick={this.addVehiclePage} >Save</button>
                    :
                    <button type="button" id="btnUpdate" className="btn btn-primary border-bottom" onClick={this.addVehiclePage}>Update</button>
                }
                &nbsp;<button className="btn btn-danger border-bottom" onClick={(e) => this.showModal(e, false, modelHeader)}>Cancel</button>
                
            </div> 
        </div> 
    </form>
</ModalBody>
</Modal>
<button className="btn btn-primary" style={{width:'200px'}} onClick={e => this.showModal(e, true, "Add New Academic Year")}>
<i className="fa fa-plus-circle"></i> Add new vehicle
</button>
{
veList !== null && veList !== undefined && veList.length > 0 ?
    <div style={{width:'100%', height:'250px', overflow:'auto'}}>
        <table id="veTable" className="striped-table fwidth bg-white p-2 m-t-1">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>vendorName</th>
                    <th>durationOfContract</th>
                    <th>vehicleNumber</th>
                    <th>capacity</th>
                    <th>ownerShip</th>
                    <th>model</th>
                    <th>chasisNo</th>
                    <th>rcNo</th>
                    <th>exit</th>

                </tr>
            </thead>
            <tbody>
                { this.createRows(veList) }
            </tbody>
        </table>
    </div>
: null
}

</main>
);
}
}

export default withApollo(VehicleGrid);