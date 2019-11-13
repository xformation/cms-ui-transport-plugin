import DatePicker from 'react-datepicker';
import * as moment from 'moment';
import * as React from 'react';

import { graphql, MutationFunc, QueryProps, compose } from 'react-apollo';

import { ADD_CONTRACT_MUTATION, ADD_INSURANCE_MUTATION, LOAD_ADD_VEHICLE_DATA_CACHE_QUERY } from '../_queries';
import withLoadingHandler from '../withLoadingHandler';

import "react-datepicker/dist/react-datepicker.css";


type AddVehiclePageStates = {
  vehicleData: any,
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
      this.state = {
          vehicleData: {
            vendorName:"",
            durationOfContract:"",
              college: {
                  id: 951
              },
               branch: {
                  id: 1151
              },
              typeOfInsurance:{
                id:""
              },
              typeOfOwnership:{
                id:""
              },
              insuranceCompany:"",
          },
          startDate:"",
          endDate:"",
          dateOfInsurance:"",
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
      this.changeValidTill = this.changeValidTill.bind(this);
      this.isInsDatesOverlap= this.isInsDatesOverlap.bind(this);
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
        let typeOfOwnership = typeOfOwnerships[i];
        typeOfOwnershipsOptions.push(
            <option key={typeOfOwnerships[i].description} value={typeOfOwnerships[i].description}>{typeOfOwnerships[i].description}</option>
        );
    }
    return typeOfOwnershipsOptions;
    }

 onChange = (e: any) => {
  const { name, value } = e.nativeEvent.target;
  const { vehicleData } = this.state;
  if(name === "typeOfInsurance"){
    this.setState({
      vehicleData: {
        ...vehicleData,
        typeOfInsurance: {
          id: value
        }
      }
    });
  } else if(name === "typeOfOwnership"){
     this.setState({
       vehicleData: {
         ...vehicleData,
         typeOfOwnership: {
           id: value
         }
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
  let txttoo: any = document.querySelector("#typeOfOwnership");
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
    typeOfOwnerShip: vehicleData.typeOfOwnership.id,
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


render() {
  const { data: { createAddVehicleDataCache, refetch }, addInsuranceMutation, addContract } = this.props;
    const { vehicleData } = this.state;
    return (
        <section className="xform-container">
            <div className="student-profile-container">
                
              
        <h4 className="bg-heading p-1">Insurance Details</h4> 
        <div className="border ThirdRow  p-1">
        <div className="Srow">
        <div className="firstColumn">
        <div>
          <label htmlFor="">Insurance Company</label>
          <input type="text" className="fwidth" style={{ width: '230px' }} id="insuranceCompany" name="insuranceCompany" onChange={this.onChange} value={vehicleData.insuranceCompany} />
        </div>
        <div>
              <label htmlFor="">Type Of Insurance</label>
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
        <div>
            <label htmlFor="">&nbsp;</label>
            <button className="btn btn-primary dflex" type="button" id="btnSaveInsurance" name="btnSaveInsurance" onClick={this.saveInsurance} style={{width: '120px'}}>Save Insurance</button>
          </div>
        </div>
        </div>
        <h4 className="bg-heading p-1">Contract Details</h4> 
        <div className="border ThirdRow  p-1">
        <div className="Srow">
        <div className="firstColumn">
        <div>
          <label htmlFor="">Vendor Name</label>
          <input type="text" className="fwidth" style={{ width: '230px' }} id="vendorName" name="vendorName" onChange={this.onChange} value={vehicleData.vendorName} />
        </div>
        <div>
              <label htmlFor="">Type Of Ownership</label>
              <select required name="typeOfOwnership" id="typeOfOwnership" onChange={this.onChange} value={vehicleData.typeOfOwnership.id} >
                      {this.createTypeOfOwnerships(this.props.data.createAddVehicleDataCache.typeOfOwnerships)}
                    </select>
            </div>
            <div>
          <label htmlFor="">Duration Of Contract</label>
          <input type="text" className="fwidth" style={{ width: '230px' }} id="durationOfContract" name="durationOfContract" onChange={this.onChange} value={vehicleData.durationOfContract} />
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
        <div>
            <label htmlFor="">&nbsp;</label>
            <button className="btn btn-primary dflex" type="button" id="btnSaveContract" name="btnSaveContract" onClick={this.saveContract} style={{width: '120px'}}>Save Contract</button>
          </div>
          </div>
        </div>
        </div>
       </div>
        </section>
    );
}
}
export default graphql(LOAD_ADD_VEHICLE_DATA_CACHE_QUERY, {
    options: ({ }) => ({
      variables: {
        collegeId: 951, 
        branchId: 1151
      }
    })
  })(withLoadingHandler(
    compose(
      graphql(ADD_CONTRACT_MUTATION, { name: "addContract" }),
      graphql(ADD_INSURANCE_MUTATION, { name: "addInsurance" })
    )
      (AddVehiclePage) as any
  ));
