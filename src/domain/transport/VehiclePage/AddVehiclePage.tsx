import DatePicker from 'react-datepicker';
import * as moment from 'moment';
import * as React from 'react';

import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { graphql, MutationFunc, QueryProps, compose } from 'react-apollo';
//mport { withRouter, RouteComponentProps, Link } from 'react-router-dom';


import { ADD_CONTRACT_MUTATION, ADD_INSURANCE_MUTATION, LOAD_ADD_VEHICLE_DATA_CACHE_QUERY,ADD_VEHICLE_MUTATION } from '../_queries';
import withLoadingHandler from '../withLoadingHandler';
import "react-datepicker/dist/react-datepicker.css";
const w180 = {
  width: '180px',
  marginRight: '10px',
};

type AddVehiclePageStates = {
  vehicleData: any,
  branches: any,
  colleges: any,
  // transportRoutes: any,
  dateOfRegistration: any,
  dateOfInsurance: any,
  typeOfInsurances: any,
  typeOfOwnerships: any,
  validTill:any,
  startDate:any,
  endDate:any,
  add: any,
  update: any
}

class AddVehiclePage extends React.Component<any, AddVehiclePageStates>{
  constructor(props: any) {
      super(props);
      const params = new URLSearchParams(location.search);
      this.state = {
          vehicleData: {
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
                  id:1101
              },
               branch: {
                  id: 1301
              },
              employee:{
                id: 2401
              },
              transportRoute:{
                id: 1351
              },
              contract:{
                id: 1051
              },
              insurance:{
                id: 1801
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
          update: false      
      };
    
      this.createTypeOfOwnerships =  this.createTypeOfOwnerships.bind(this);
      this.createTypeOfInsurances = this.createTypeOfInsurances.bind(this);
      this.changeStartDate = this.changeStartDate.bind(this);
      this.changeEndDate = this.changeEndDate.bind(this);
      this.isConDatesOverlap = this.isConDatesOverlap.bind(this);
      this.changeDateOfInsurance = this.changeDateOfInsurance.bind(this);
      this.changeDateOfRegistration = this.changeDateOfRegistration.bind(this);
      this.createBranches = this.createBranches.bind(this);
      this.createColleges = this.createColleges.bind(this);
      // this.createTransportRoutes = this.createTransportRoutes.bind(this);
      this.changeValidTill = this.changeValidTill.bind(this);
      this.isInsDatesOverlap= this.isInsDatesOverlap.bind(this);
      this.saveVehicle = this.saveVehicle.bind(this);
      this.saveInsurance = this.saveInsurance.bind(this);
      this.saveContract = this.saveContract.bind(this);
    }

  
   createTypeOfInsurances(typeOfInsurances: any) {
    let typeOfInsurancesOptions = [<option key={""} value="">Select Type Of Insurance</option>];
    for (let i = 0; i < typeOfInsurances.length; i++) {
        let typeOfInsurance = typeOfInsurances[i];
        typeOfInsurancesOptions.push(
            <option key={typeOfInsurances[i].description} value={typeOfInsurances[i].description}>{typeOfInsurances[i].description}</option>
        );
    }
    return typeOfInsurancesOptions;
    }

    createTypeOfOwnerships(typeOfOwnerships: any) {
    let typeOfOwnershipsOptions = [<option key={""} value="">Select Type Of Ownership</option>];
    for (let i = 0; i < typeOfOwnerships.length; i++) {
        let typeOfOwnerShip = typeOfOwnerships[i];
        typeOfOwnershipsOptions.push(
            <option key={typeOfOwnerships[i].description} value={typeOfOwnerships[i].description}>{typeOfOwnerships[i].description}</option>
        );
    }
    return typeOfOwnershipsOptions;
    }
    
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
    createBranches(branches: any) {
      let branchesOptions = [<option key={0} value="">Select branch</option>];
      for (let i = 0; i < branches.length; i++) {
        let branch = branches[i]
        branchesOptions.push(
          <option key={branches[i].id} value={branches[i].id}>{branches[i].branchName}</option>
        );
      }
      return branchesOptions;
    }
    createColleges(colleges: any) {
      let collegesOptions = [<option key={0} value="">Select college</option>];
      for (let i = 0; i < colleges.length; i++) {
        let college = colleges[i]
        collegesOptions.push(
          <option key={colleges[i].id} value={colleges[i].id}>{colleges[i].shortName}</option>
        );
      }
      return collegesOptions;
    }
  
  

 onChange = (e: any) => {
  const { name, value } = e.nativeEvent.target;
  const { vehicleData } = this.state;
  if(name === "branch"){
    this.setState({
      vehicleData: {
        ...vehicleData,
        branch: {
          id: value
        },
        college:{
          id:""
        },
        transportRoute:{
          id:""
        },
        typeOfInsurance:{
          id:""
        },
        typeOfOwnerShip:{
          id:""
        }
      }
    });
  } else if(name === "college"){
     this.setState({
       vehicleData: {
         ...vehicleData,
         college: {
           id: value
         },
         transportRoute:{
          id:""
        },
         typeOfInsurance:{
           id:""
         },
         typeOfOwnerShip:{
           id:""
         }
       }
     })
  }
  else if(name === "transportRoute"){
    this.setState({
      vehicleData: {
        ...vehicleData,
        transportRoute:{
          id: value
        },
        typeOfInsurance: {
          id: value
        },
        typeOfOwnerShip:{
          id:""
        }
      }
    })
 }
  else if(name === "typeOfInsurance"){
    this.setState({
      vehicleData: {
        ...vehicleData,
        typeOfInsurance: {
          id: value
        },
        typeOfOwnerShip:{
          id:""
        }
      }
    })
 }
 else if(name === "typeOfOwnerShip"){
  this.setState({
    vehicleData: {
      ...vehicleData,
      typeOfOwnerShip: {
        id: value
      },
    }
  })
}else {
      this.setState({
          vehicleData: {
              ...vehicleData,
              [name]: value
          }
      });      
    }
  }

  changeDateOfRegistration = (e: any) => {
    const varDt = e;
    console.log("registration date...", varDt);
    this.setState({
      dateOfRegistration: varDt
    });
  }

changeDateOfInsurance = (e: any) => {
  const varDt = e;
  console.log("insurance date...", varDt);
  this.setState({
    dateOfInsurance: varDt
  });
}

changeValidTill = (e: any) => {
  const varDt = e;
  console.log("Valid till date...", varDt);
  this.setState({
    validTill: varDt
  });
}

isInsDatesOverlap(dateOfInsurance: any, validTill: any){
  if (validTill.isBefore(dateOfInsurance)) {
    alert("Valid till date should not be prior to date of insurance date.");
    return true;
  }
  return false;
}

changeStartDate = (e: any) => {
  const varDt = e;
  console.log("start date...", varDt);
  this.setState({
    startDate: varDt
  });
}

changeEndDate = (e: any) => {
  const varDt = e;
  console.log("end date...", varDt);
  this.setState({
    endDate: varDt
  });
}

isConDatesOverlap(startDate: any, endDate: any){
  if (endDate.isBefore(startDate)) {
    alert("start date should not be prior to end date.");
    return true;
  }
  return false;
}

saveVehicle(e: any) {
  const { id, value } = e.nativeEvent.target;
  const { addVehicle } = this.props;
  const { vehicleData } = this.state;
  e.preventDefault();

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
  let txtVN: any = document.querySelector("#vehicleNumber");
  if (txtVN.value.trim() === "") {
    alert("Please provide some value in Vehicle Number");
    return;
  }
  let txtVT: any = document.querySelector("#vehicleType");
  if (txtVT.value.trim() === "") {
    alert("Please provide some value in Vehicle Type");
    return;
  }
  let chkCp: any = document.querySelector("#capacity");
  if (chkCp.value.trim() === "") {
    alert("Please provide some value in Capacity");
    return;
  }
  let txtOS: any = document.querySelector("#ownerShip");
  if (txtOS.value.trim() === "") {
    alert("Please provide some value in OwnerShip");
    return;
  }
  let txYOM: any = document.querySelector("#yearOfManufacturing");
  if (txYOM.value.trim() === "") {
    alert("Please provide some value in Year Of Manufacturing");
    return;
  }
  let txtMC: any = document.querySelector("#manufacturingCompany");
  if (txtMC.value.trim() === "") {
    alert("Please provide some value in Manufacturing Company");
    return;
  }
  let txtMd: any = document.querySelector("#model");
  if (txtMd.value.trim() === "") {
    alert("Please provide some value in Model");
    return;
  }
  let txtCN: any = document.querySelector("#chasisNo");
  if (txtCN.value.trim() === "") {
    alert("Please provide some value in Chasis No");
    return;
  }
  let txtRN: any = document.querySelector("#rcNo");
  if (txtRN.value.trim() === "") {
    alert("Please provide some value in RcNo");
    return;
  }
  let txtCoN: any = document.querySelector("#contactNumber");
  if (txtCoN.value.trim() === "") {
    alert("Please provide some value in Contact Number");
    return;
  }
  if (this.state.dateOfRegistration === undefined || this.state.dateOfRegistration === null || this.state.dateOfRegistration === "") {
    alert("Please provide date of registration");
    return;
  }

  let drDate = null;
  if (this.state.dateOfRegistration !== undefined || this.state.dateOfRegistration !== null || this.state.dateOfRegistration !== "") {
    drDate = moment(this.state.dateOfRegistration, "YYYY-MM-DD");
  }
  let chkStatus: any = document.querySelector("#status");
    let status = "DEACTIVE";
    if (chkStatus.checked) {
      status = "ACTIVE";
    }
  // let vtDate = null;
  // if (this.state.validTill !== undefined || this.state.validTill !== null || this.state.validTill !== "") {
  //   vtDate = moment(this.state.validTill, "YYYY-MM-DD");
  // }
  // if(diDate !== null && vtDate !== null){
  //   if(this.isInsDatesOverlap(diDate, vtDate)){
  //     return;
  //   }
  // }
 
  let addVehicleInput = {
    // branch:vehicleData.branch.id,
    // college:vehicleData.college.id,
    vehicleNumber: vehicleData.vehicleNumber,
    vehicleType: vehicleData.vehicleType,
    capacity: vehicleData.capacity,
    ownerShip: vehicleData.ownerShip,
    yearOfManufacturing: vehicleData.yearOfManufacturing,
    manufacturingCompany: vehicleData.manufacturingCompany,
    model: vehicleData.model,
    chasisNo: vehicleData.chasisNo,
    rcNo: vehicleData.rcNo,
    contactNumber: vehicleData.contactNumber,
    employeeId: vehicleData.employee.id,
    transportRouteId: vehicleData.transportRoute.id,
    contractId: vehicleData.contract.id,
    insuranceId: vehicleData.insurance.id,
    branchId: vehicleData.branch.id,
    collegeId: vehicleData.college.id,
    dateOfRegistration: drDate,
    status: status,
  };
  console.log("form data : ", vehicleData);
  return addVehicle({
    variables: { input: addVehicleInput }
  }).then((data:any) => {
    console.log('Add Vehicle ::::: ', data);
    alert("Vehicle added successfully!");
    const sdt = data;
    vehicleData.vehicleData = [];
    vehicleData.vehicleData.push(sdt);
    // = data.data.addFeeCategory;
    this.setState({
      vehicleData: vehicleData
    });

  }).catch((error: any) => {
    alert("Due to some errorvehicle could not be added");
    console.log('there was an error sending the add vehicle mutation result', error);
    return Promise.reject(`Could not retrieve add vehicle data: ${error}`);
  });
}


saveInsurance(e: any) {
  const { id, value } = e.nativeEvent.target;
  const { addInsurance } = this.props;
  const { vehicleData } = this.state;
  e.preventDefault();

  let txtIc: any = document.querySelector("#insuranceCompany");
  if (txtIc.value.trim() === "") {
    alert("Please provide some value in Insurance Company");
    return;
  }
  let txtto: any = document.querySelector("#typeOfInsurance");
  if (txtto.value.trim() === "") {
    alert("Please provide some value in Type Of Insurance");
    return;
  }
 
  if (this.state.dateOfInsurance === undefined || this.state.dateOfInsurance === null || this.state.dateOfInsurance === "") {
    alert("Please provide date of insurance");
    return;
  }

  let diDate = null;
  if (this.state.dateOfInsurance !== undefined || this.state.dateOfInsurance !== null || this.state.dateOfInsurance !== "") {
    diDate = moment(this.state.dateOfInsurance, "YYYY-MM-DD");
  }
  let vtDate = null;
  if (this.state.validTill !== undefined || this.state.validTill !== null || this.state.validTill !== "") {
    vtDate = moment(this.state.validTill, "YYYY-MM-DD");
  }
  if(diDate !== null && vtDate !== null){
    if(this.isInsDatesOverlap(diDate, vtDate)){
      return;
    }
  }
 
  let addInsuranceInput = {
    insuranceCompany: vehicleData.insuranceCompany,
    typeOfInsurance: vehicleData.typeOfInsurance.id,
    dateOfInsurance: diDate,
    validTill: vtDate
  };
  console.log("form data : ", vehicleData);
  return addInsurance({
    variables: { input: addInsuranceInput }
  }).then((data:any) => {
    console.log('Add Insurance ::::: ', data);
    alert("Insurance added successfully!");
    const sdt = data;
    vehicleData.vehicleData = [];
    vehicleData.vehicleData.push(sdt);
    // = data.data.addFeeCategory;
    this.setState({
      vehicleData: vehicleData
    });
  }).catch((error: any) => {
    alert("Due to some error Insurance could not be added");
    console.log('there was an error sending the add Insurance mutation result', error);
    return Promise.reject(`Could not retrieve add Insurance data: ${error}`);
  });
}

saveContract(e: any) {
  const { id, value } = e.nativeEvent.target;
  const { addContract } = this.props;
  const { vehicleData } = this.state;
  e.preventDefault();

  let txtVn: any = document.querySelector("#vendorName");
  if (txtVn.value.trim() === "") {
    alert("Please provide some value in Vendor Name");
    return;
  }
  let txttoo: any = document.querySelector("#typeOfOwnerShip");
  if (txttoo.value.trim() === "") {
    alert("Please provide some value in Type Of Ownership");
    return;
  }
  let txtDoc: any = document.querySelector("#durationOfContract");
  if (txtDoc.value.trim() === "") {
    alert("Please provide some value in Duration Of Contract");
    return;
  }
  if (this.state.startDate === undefined || this.state.startDate === null || this.state.startDate === "") {
    alert("Please provide start date");
    return;
  }

  let stDate = null;
  if (this.state.startDate !== undefined || this.state.startDate !== null || this.state.startDate !== "") {
    stDate = moment(this.state.startDate, "YYYY-MM-DD");
  }
  let enDate = null;
  if (this.state.endDate !== undefined || this.state.endDate !== null || this.state.endDate !== "") {
    enDate = moment(this.state.endDate, "YYYY-MM-DD");
  }
  if(stDate !== null && enDate !== null){
    if(this.isInsDatesOverlap(stDate, enDate)){
      return;
    }
  }
 
  let addContractInput = {
    vendorName: vehicleData.vendorName,
    typeOfOwnerShip: vehicleData.typeOfOwnerShip.id,
    durationOfContract: vehicleData.durationOfContract,
    startDate: stDate,
    endDate: enDate
  };
  console.log("form data : ", vehicleData);
  return addContract({
    variables: { input: addContractInput }
  }).then((data:any) => {
    console.log('Add Contract ::::: ', data);
    alert("Contract added successfully!");
    const sdt = data;
    vehicleData.vehicleData = [];
    vehicleData.vehicleData.push(sdt);
    this.setState({
      vehicleData: vehicleData
    });

  }).catch((error: any) => {
    alert("Due to some error Contract could not be added");
    console.log('there was an error sending the add Contract mutation result', error);
    return Promise.reject(`Could not retrieve add Contract data: ${error}`);
  });
}

saveAll= (e: any) => {
  const { id } = e.nativeEvent.target;
  const { addVehicle,addContract,addInsurance } = this.props;
  const { vehicleData } = this.state;
  let vInput = this.saveVehicle(e);
  if(vInput == null || vInput === undefined){
      return;
  }
  let cInput = this.saveContract(e);
  if(cInput == null || cInput === undefined){
    return;
  }
  let iInput = this.saveInsurance(e);
  if(iInput == null || iInput === undefined){
    return;
  }
}

render() {
  const { data: { createAddVehicleDataCache, refetch }, addInsuranceMutation, addContract, addVehicle } = this.props;
    const { vehicleData } = this.state;
    return (
        <section className="xform-container">
            <div className="student-profile-container">
            <div>
                <select name="branch" id="branch" onChange={this.onChange} value={vehicleData.branch.id} className="gf-form-input max-width-10">
                  {this.createBranches(this.props.data.createAddVehicleDataCache.branches)}
                </select>
                <select name="college" id="college" onChange={this.onChange} value={vehicleData.college.id} className="gf-form-input max-width-10">
                  {this.createColleges(this.props.data.createAddVehicleDataCache.colleges)}
                </select>
              </div>
              <h4 className="bg-heading p-1">Vehicle Details</h4> 
        <div className="border ThirdRow  p-1">
        <div className="Srow">
        <div className="firstColumn">
        <div>
          <label htmlFor="">Vehicle Number</label>
          <input type="text" className="fwidth" style={{ width: '130px' }} id="vehicleNumber" name="vehicleNumber" onChange={this.onChange} value={vehicleData.vehicleNumber} />
        </div>
        <div>
          <label htmlFor="">Vehicle Type</label>
          <input type="text" className="fwidth" style={{ width: '130px' }} id="vehicleType" name="vehicleType" onChange={this.onChange} value={vehicleData.vehicleType} />
        </div>
        <div>
          <label htmlFor="">Capacity</label>
          <input type="text" className="fwidth" style={{ width: '130px' }} id="capacity" name="capacity" onChange={this.onChange} value={vehicleData.capacity} />
        </div>
        <div>
          <label htmlFor="">OwnerShip</label>
          <input type="text" className="fwidth" style={{ width: '130px' }} id="ownerShip" name="ownerShip" onChange={this.onChange} value={vehicleData.ownerShip} />
        </div>
        </div>
        <div className="secondColumn">
        <div>
          <label htmlFor="">Date Of Registration</label>
          <DatePicker selected={this.state.dateOfRegistration} value={this.state.dateOfRegistration} onChange={this.changeDateOfRegistration} id="dtPickerSt" name="dtPickerSt" />
        </div>
        <div>
          <label htmlFor="">year Of Manufacturing</label>
          <input type="text" className="fwidth" style={{ width: '130px' }} id="yearOfManufacturing" name="yearOfManufacturing" onChange={this.onChange} value={vehicleData.yearOfManufacturing} />
        </div>
        <div>
          <label htmlFor="">Manufacturing Company</label>
          <input type="text" className="fwidth" style={{ width: '130px' }} id="manufacturingCompany" name="manufacturingCompany" onChange={this.onChange} value={vehicleData.manufacturingCompany} />
        </div>
        <div>
          <label htmlFor="">Model</label>
          <input type="text" className="fwidth" style={{ width: '130px' }} id="model" name="model" onChange={this.onChange} value={vehicleData.model} />
        </div>
        </div>
        <div className="thirdColumn">
        <div>
          <label htmlFor="">Chasis No</label>
          <input type="text" className="fwidth" style={{ width: '130px' }} id="chasisNo" name="chasisNo" onChange={this.onChange} value={vehicleData.chasisNo} />
        </div>
        <div>
          <label htmlFor="">Rc No</label>
          <input type="text" className="fwidth" style={{ width: '130px' }} id="rcNo" name="rcNo" onChange={this.onChange} value={vehicleData.rcNo} />
        </div>
        <div>
          <label htmlFor="">Contact Number</label>
          <input type="text" className="fwidth" style={{ width: '130px' }} id="contactNumber" name="contactNumber" onChange={this.onChange} value={vehicleData.contactNumber} />
        </div>
        </div>
        <div>
              <label htmlFor="">Status</label>
              <label className="switch">
                {' '}
                <input type="checkbox" id="status" name="status" defaultChecked /> <span className="slider" />{' '}
              </label>
        </div>
        </div>
        </div>
        {/* <div>
          <label htmlFor="">Insurance Company</label>
          <input type="text" className="fwidth" style={{ width: '230px' }} id="insuranceCompany" name="insuranceCompany" onChange={this.onChange} value={vehicleData.insuranceCompany} />
        </div> */}
        
        {/* <div>
          <label htmlFor="">Valid Till</label>
          <DatePicker selected={this.state.validTill} value={this.state.validTill} onChange={this.changeValidTill} id="dtPickerNd" name="dtPickerNd" />
        </div> */}
        {/* <div>
            <label htmlFor="">&nbsp;</label>
            <button className="btn btn-primary dflex" type="button" id="btnSaveVehicle" name="btnSaveVehicle" onClick={this.saveVehicle} style={{width: '120px'}}>Save Vehicle</button>
        </div> */}
        {/* </div>
         */}
              
        <h4 className="bg-heading p-1">Insurance Details</h4> 
        <div className="border ThirdRow  p-1">
        <div className="Srow">
        <div className="firstColumn">
        <div>
          <label htmlFor="">Insurance Company</label>
          <input type="text" className="fwidth" style={{ width: '130px' }} id="insuranceCompany" name="insuranceCompany" onChange={this.onChange} value={vehicleData.insuranceCompany} />
        </div>
        <div>
              <label>Type Of Insurance</label>
              <select required name="typeOfInsurance" id="typeOfInsurance" onChange={this.onChange} value={vehicleData.typeOfInsurance.id} >
                      {this.createTypeOfInsurances(this.props.data.createAddVehicleDataCache.typeOfInsurances)}
                    </select>
        </div>
        </div>
        <div>
          <label htmlFor="">Date Of Insurance</label>
          <DatePicker selected={this.state.dateOfInsurance} value={this.state.dateOfInsurance} onChange={this.changeDateOfInsurance} id="dtPickerSt" name="dtPickerSt" />
        </div>
        <div>
          <label htmlFor="">Valid Till</label>
          <DatePicker selected={this.state.validTill} value={this.state.validTill} onChange={this.changeValidTill} id="dtPickerNd" name="dtPickerNd" />
        </div>
        {/* <div>
            <label htmlFor="">&nbsp;</label>
            <button className="btn btn-primary dflex" type="button" id="btnSaveInsurance" name="btnSaveInsurance" onClick={this.saveInsurance} style={{width: '120px'}}>Save Insurance</button>
        </div> */}
        </div>
        </div>
        <h4 className="bg-heading p-1">Contract Details</h4> 
        <div className="border ThirdRow  p-1">
        <div className="Srow">
        <div className="firstColumn">
        <div>
          <label htmlFor="">Vendor Name</label>
          <input type="text" className="fwidth" style={{ width: '130px' }} id="vendorName" name="vendorName" onChange={this.onChange} value={vehicleData.vendorName} />
        </div>
        <div>
              <label>Type Of Ownership</label>
              <select required name="typeOfOwnerShip" id="typeOfOwnerShip" onChange={this.onChange} value={vehicleData.typeOfOwnerShip.id} >
                      {this.createTypeOfOwnerships(this.props.data.createAddVehicleDataCache.typeOfOwnerships)}
              </select>
            </div>
            <div>
          <label htmlFor="">Duration Of Contract</label>
          <input type="text" className="fwidth" style={{ width: '130px' }} id="durationOfContract" name="durationOfContract" onChange={this.onChange} value={vehicleData.durationOfContract} />
        </div>
        </div>
        <div className="secondColumn">
        <div>
          <label htmlFor="">Start Date</label>
          <DatePicker selected={this.state.startDate} value={this.state.startDate} onChange={this.changeStartDate} id="dtPickerSt" name="dtPickerSt" />
        </div>
        <div>
          <label htmlFor="">End Date</label>
          <DatePicker selected={this.state.endDate} value={this.state.endDate} onChange={this.changeEndDate} id="dtPickerNd" name="dtPickerNd" />
        </div>
        {/* <div>
            <label htmlFor="">&nbsp;</label>
            <button className="btn btn-primary dflex" type="button" id="btnSaveContract" name="btnSaveContract" onClick={this.saveContract} style={{width: '120px'}}>Save Contract</button>
          </div> */}
          </div>
        </div>
        </div>
        <div>
            <label htmlFor="">&nbsp;</label>
            <button className="btn bs pull-right" type="submit" id="btnSaveAll" name="btnSaveAll" onClick={this.saveAll} style={{width: '120px'}}>Save</button>
          </div>
       </div>      
        </section>
    );
}
}
export default graphql(LOAD_ADD_VEHICLE_DATA_CACHE_QUERY, {
    options: ({ }) => ({
      variables: {
        collegeId: 1101,
        branchId: 1301
      }
    })
  })(withLoadingHandler(
    compose(
      graphql(ADD_CONTRACT_MUTATION, { name: "addContract" }),
      graphql(ADD_INSURANCE_MUTATION, { name: "addInsurance" }),
      graphql(ADD_VEHICLE_MUTATION, { name: "addVehicle" })
    )
      (AddVehiclePage) as any
  ));
