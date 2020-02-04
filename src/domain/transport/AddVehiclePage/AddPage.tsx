import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { commonFunctions } from '../../_utilites/common.functions';
import "../../../css/custom.css"
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
import { ADD_VEHICLE_MUTATION  } from '../_queries';


export interface VehicleProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    vehicleList?: any;
    collegeList?: any;
    branchList?: any;  
}

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in preferences service, vehicle could not be saved. Please check preferences service logs";
const SUCCESS_MESSAGE_VEHICLE_ADDED = "New Vehicle saved successfully";
const SUCCESS_MESSAGE_VEHICLE_UPDATED = "vehicle updated successfully";

class Vehicle<T = {[data: string]: any}> extends React.Component<VehicleProps, any> {
    constructor(props: VehicleProps) {
        super(props);
        this.state = {
            vehicleList: this.props.vehicleList,
            branchList: this.props.branchList,
            collegeList: this.props.collegeList,
            isModalOpen: false,
            vehicleObj: {
                branchId: "",
                collegeId:"",
                vehicleNumber:"",
                vehicleType:"",
                capacity:"",
                ownerShip:"",
                dateOfRegistration:"",
                yearOfManufacturing:"",
                manufacturingCompany:"",
                model:"",
                chasisNo:"",
                rcNo:"",
                contactNumber:"",
                status:"",
            },
            errorMessage: "",
            successMessage: "",
            modelHeader: ""
        };
        
    }
    
    showDetail(e: any, bShow: boolean, editObj: any, modelHeader: any) {
        e && e.preventDefault();
        const { vehicleObj } = this.state;

        vehicleObj.id = editObj.id;
        vehicleObj.collegeId = editObj.collegeId;
        vehicleObj.branchId = editObj.branchId;
        vehicleObj.vehicleNumber = editObj.vehicleNumber;
        vehicleObj.vehicleType = editObj.vehicleType;
        vehicleObj.capacity = editObj.capacity;
        vehicleObj.ownerShip = editObj.ownerShip;
        vehicleObj.dateOfRegistration = editObj.dateOfRegistration;
        vehicleObj.yearOfManufacturing = editObj.yearOfManufacturing;
        vehicleObj.manufacturingCompany = editObj.manufacturingCompany;
        vehicleObj.model = editObj.model;
        vehicleObj.chasisNo = editObj.chasisNo;
        vehicleObj.rcNo = editObj.rcNo;
        vehicleObj.contactNumber = editObj.contactNumber;
        vehicleObj.status = editObj.status;
        
        this.setState(() => ({
            isModalOpen: bShow,
            vehicleObj: vehicleObj,
            modelHeader: modelHeader,
            errorMessage: "",
            successMessage: "",
        }));
    }

    // createRows(objAry: any) {
    //     const { source } = this.state;
    //     console.log("createRows() - course list on course page:  ", objAry);
    //     if(objAry === undefined || objAry === null) {
    //         return;
    //     }
    //     const aryLength = objAry.length;
    //     const retVal = [];
    //     for (let i = 0; i < aryLength; i++) {
    //         const obj = objAry[i];
    //         retVal.push(
    //           <tr >
    //             <td>{obj.name}</td>
    //             <td>{obj.description}</td>
    //             <td>{obj.courseDuration}</td>
    //             <td>{obj.courseType}</td>
    //             <td>{obj.yearOrSemesterType}</td>
    //             <td>{obj.totalFee}</td>
    //             <td>{obj.cmsDepartmentVo.name}</td>
    //             <td>{obj.cmsBranchVo.branchName}</td>
    //             <td>{obj.status}</td>
    //             <td>
    //                 {
    //                     <button className="btn btn-primary" onClick={e => this.showDetail(e, true, obj, "Edit Course")}>Edit</button>
    //                 }
    //             </td>
    //           </tr>
    //         );
    //     }
    //     return retVal;
    // }

    showModal(e: any, bShow: boolean, headerLabel: any) {
        e && e.preventDefault();
        this.setState(() => ({
            isModalOpen: bShow,
            vehicleObj: {},
            modelHeader: headerLabel,
            errorMessage: "",
            successMessage: "",
        }));
    }

    onChange = (e: any) => {
        e.preventDefault();
        const { name, value } = e.nativeEvent.target;
        const { vehicleObj } = this.state;
        
        this.setState({
            vehicleObj: {
                ...vehicleObj,
                [name]: value
            },
            errorMessage: "",
            successMessage: "",
        });
        
        commonFunctions.restoreTextBoxBorderToNormal(name);
    }

    
    validateFields(obj: any){
        let isValid = true;
        let errorMessage = ""
        if(obj.branchId === undefined || obj.branchId === null || obj.branchId === ""){
            commonFunctions.changeTextBoxBorderToError((obj.branchId === undefined || obj.branchId === null) ? "" : obj.branchId, "branchId");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.collegeId === undefined || obj.collegeId === null || obj.collegeId === ""){
            commonFunctions.changeTextBoxBorderToError((obj.collegeId === undefined || obj.collegeId === null) ? "" : obj.collegeId, "collegeId");
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
        // if(obj.courseDuration === undefined || obj.courseDuration === null || obj.courseDuration === ""){
        //     commonFunctions.changeTextBoxBorderToError((obj.courseDuration === undefined || obj.courseDuration === null) ? "" : obj.courseDuration, "courseDuration");
        //     errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        //     isValid = false;
        // }
        // if(obj.courseType === undefined || obj.courseType === null || obj.courseType === ""){
        //     commonFunctions.changeTextBoxBorderToError((obj.courseType === undefined || obj.courseType === null) ? "" : obj.courseType, "courseType");
        //     errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        //     isValid = false;
        // }
        // if(obj.yearOrSemesterType === undefined || obj.yearOrSemesterType === null || obj.yearOrSemesterType === ""){
        //     commonFunctions.changeTextBoxBorderToError((obj.yearOrSemesterType === undefined || obj.yearOrSemesterType === null) ? "" : obj.yearOrSemesterType, "yearOrSemesterType");
        //     errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        //     isValid = false;
        // }
        // if(obj.status === undefined || obj.status === null || obj.status === ""){
        //     commonFunctions.changeTextBoxBorderToError((obj.status === undefined || obj.status === null) ? "" : obj.status, "status");
        //     errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        //     isValid = false;
        // }        

        this.setState({
            errorMessage: errorMessage
        });
        return isValid; 

    }

    getInput(vehicleObj: any, modelHeader: any){
        let id = null;
        if(modelHeader === "Edit Course"){
            id = vehicleObj.id;
        }
        let input = {
            id: id,
            branchId: vehicleObj.branchId,
            collegeId: vehicleObj.collegeId,
            vehicleNumber: vehicleObj.vehicleNumber,
            vehicleType: vehicleObj.vehicleType,
            capacity: vehicleObj.capacity, 
            ownerShip: vehicleObj.ownerShip,
            dateOfRegistration: vehicleObj.dateOfRegistration,
            yearOfManufacturing: vehicleObj.yearOfManufacturing,
            manufacturingCompany: vehicleObj.manufacturingCompany,
            model: vehicleObj.model,
            chasisNo: vehicleObj.chasisNo,
            rcNo: vehicleObj.rcNo,
            contactNumber: vehicleObj.contactNumber,
            status: vehicleObj.status,
        };
        return input;
    }
    
    async doSave(inp: any, id: any){
        let btn = document.querySelector("#"+id);
        btn && btn.setAttribute("disabled", "true");
        let i = 0;
        
        await this.props.client.mutate({
            mutation: ADD_VEHICLE_MUTATION,
            variables: { 
                input: inp
            },
        }).then((resp: any) => {
            console.log("Success in saveVehicle Mutation. Exit code : ",resp.data.addVehicle);
            // exitCode = resp.data.saveCourse.cmsCourseVo.exitCode;
            let temp = resp.data.addVehicle; 
            console.log("New course list : ", temp);
            this.setState({
                courseList: temp
            });
        }).catch((error: any) => {
            i = 1;
            console.log('Error in saveCourse : ', error);
        });
        btn && btn.removeAttribute("disabled");
        
        let errorMessage = "";
        let successMessage = "";
        if(i === 0 ){
            successMessage = SUCCESS_MESSAGE_VEHICLE_ADDED;
            if(inp.id !== null){
                successMessage = SUCCESS_MESSAGE_VEHICLE_UPDATED;
            }
        }else {
            errorMessage = ERROR_MESSAGE_SERVER_SIDE_ERROR;
        }
        this.setState({
            successMessage: successMessage,
            errorMessage: errorMessage
        });
    }

    save = (e: any) => {
        const { id } = e.nativeEvent.target;
        const {vehicleObj, modelHeader} = this.state;
        let isValid = this.validateFields(vehicleObj);
        if(isValid === false){
            return;
        }
        const inputObj = this.getInput(vehicleObj, modelHeader);
        this.doSave(inputObj, id);
    }

    render() {
        const {vehicleList, collegeList, branchList, isModalOpen, vehicleObj, modelHeader, errorMessage, successMessage} = this.state;
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
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Branch<span style={{ color: 'red' }}> * </span></label>
                                        <select name="branchId" id="branchId" onChange={this.onChange} value={vehicleObj.branchId} className="gf-form-input">
                                        <option value="">Select Branch</option>
                                        {
                                            commonFunctions.createSelectbox(branchList, "id", "id", "branchName")
                                        }
                                        </select>
                                    </div> 

                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">College<span style={{ color: 'red' }}> * </span></label>
                                        <select name="collegeId" id="collegeId" onChange={this.onChange} value={vehicleObj.departmentId} className="gf-form-input">
                                        <option value="">Select Department</option>
                                        {
                                            commonFunctions.createSelectbox(collegeList, "id", "id", "name")
                                        }
                                        </select>
                                    </div>
                                </div>

                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Name <span style={{ color: 'red' }}> * </span></label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={vehicleObj.name} placeholder="Course Name" name="name" id="name" maxLength={255} />
                                    </div> 

                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Description<span style={{ color: 'red' }}> * </span></label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={vehicleObj.description} placeholder="Course Description" name="description" id="description" maxLength={255} />
                                    </div>
                                </div>

                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Course Duration <span style={{ color: 'red' }}> * </span></label>
                                        <select name="courseDuration" id="courseDuration" onChange={this.onChange} value={vehicleObj.courseDuration} className="gf-form-input">
                                            <option key={""} value={""}>Select Course Duration</option>
                                            <option key={"SIX MONTH"} value={"SIX MONTH"}>SIX MONTH</option>
                                            <option key={"ONE YEAR"} value={"ONE YEAR"}>ONE YEAR</option>
                                            <option key={"TWO YEAR"} value={"TWO YEAR"}>TWO YEAR</option>
                                            <option key={"THREE YEAR"} value={"THREE YEAR"}>THREE YEAR</option>
                                            <option key={"FOUR YEAR"} value={"FOUR YEAR"}>FOUR YEAR</option>
                                            <option key={"FIVE YEAR"} value={"FIVE YEAR"}>FIVE YEAR</option>
                                        </select>
                                    </div> 

                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Course Type<span style={{ color: 'red' }}> * </span></label>
                                        <select name="courseType" id="courseType" onChange={this.onChange} value={vehicleObj.courseType} className="gf-form-input">
                                            <option key={""} value={""}>Select Course Type</option>
                                            <option key={"DEGREE"} value={"DEGREE"}>DEGREE</option>
                                            <option key={"DIPLOMA"} value={"DIPLOMA"}>DIPLOMA</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Yearly/Semester Course <span style={{ color: 'red' }}> * </span></label>
                                        <select name="yearOrSemesterType" id="yearOrSemesterType" onChange={this.onChange} value={vehicleObj.yearOrSemesterType} className="gf-form-input">
                                            <option key={""} value={""}>Select Yearly/Semester Course</option>
                                            <option key={"YEARLY"} value={"YEARLY"}>YEARLY COURSE</option>
                                            <option key={"SEMESTER"} value={"SEMESTER"}>SEMESTER COURSE</option>
                                        </select>
                                    </div> 

                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Total Course Fee</label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={vehicleObj.totalFee} placeholder="Total Course Fee" name="totalFee" id="totalFee" maxLength={10} />
                                    </div>
                                </div>
                                
                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Yearly Course Fee</label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={vehicleObj.yearlyFee} placeholder="Yearly Course Fee" name="yearlyFee" id="yearlyFee" maxLength={10} />
                                    </div> 

                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Per Semester Course Fee</label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={vehicleObj.perSemesterFee} placeholder="Per Semester Course Fee" name="perSemesterFee" id="perSemesterFee" maxLength={255} />
                                    </div>
                                </div>

                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1 ">
                                        <label className="gf-form-label b-0 bg-transparent">Comments</label>
                                        <input type="text" required className="gf-form-input" onChange={this.onChange}  value={vehicleObj.comments} placeholder="Comments" name="comments" id="comments" maxLength={255}/>
                                    </div>
                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Status<span style={{ color: 'red' }}> * </span></label>
                                        <select name="status" id="status" onChange={this.onChange} value={vehicleObj.status} className="gf-form-input">
                                            <option key={""} value={""}>Select Status</option>
                                            <option key={"ACTIVE"} value={"ACTIVE"}>ACTIVE</option>
                                            <option key={"DEACTIVE"} value={"DEACTIVE"}>DEACTIVE</option>
                                            <option key={"DRAFT"} value={"DRAFT"}>DRAFT</option>
                                        </select>
                                    </div> 
                                </div>
                                <div className="m-t-1 text-center">
                                    {
                                        modelHeader === "Add New Course" ?
                                        <button type="button" id="btnAdd" className="btn btn-primary border-bottom" onClick={this.save} >Save</button>
                                        :
                                        <button type="button" id="btnUpdate" className="btn btn-primary border-bottom" onClick={this.save}>Update</button>
                                    }
                                    &nbsp;<button className="btn btn-danger border-bottom" onClick={(e) => this.showModal(e, false, modelHeader)}>Cancel</button>
                                    
                                </div>
                            </div>
                        </form>
                        
                        
                    </ModalBody>
                </Modal>
                <button className="btn btn-primary" style={{width:'200px'}} onClick={e => this.showModal(e, true, "Add New Course")}>
                    <i className="fa fa-plus-circle"></i> Add New Course
                </button>
                {
                    vehicleList !== null && vehicleList !== undefined && vehicleList.length > 0 ?
                        <div style={{width:'100%', height:'250px', overflow:'auto'}}>
                            <table id="ayTable" className="striped-table fwidth bg-white p-2 m-t-1">
                                <thead>
                                    <tr>
                                        <th>name</th>
                                        <th>description</th>
                                        <th>Course Duration</th>
                                        <th>Course Type</th>
                                        <th>Year/Semester Course</th>
                                        <th>Total Fee</th>
                                        <th>Department</th>
                                        <th>Branch</th>
                                        <th>Status</th>
                                        <th>Edit</th>

                                    </tr>
                                </thead>
                                {/* <tbody>
                                    { this.createRows(courseList) }
                                </tbody> */}
                            </table>
                        </div>
                    : null
                }
                
            </main>
        );
    }
}

export default withApollo(Vehicle);