
import * as React from 'react';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { graphql, QueryProps, MutationFunc, compose, withApollo } from "react-apollo";
import { EMPLOYEE_DATA_CACHE, EMPLOYEE_LIST } from '../_queries';
import withLoadingHandler from '../withLoadingHandler';
import wsCmsBackendServiceSingletonClient from '../../../wsCmsBackendServiceClient';

const w180 = {
  width: '180px'
};

type DriverTableStates = {
  user:any,
  employees: any,
  employeeData: any,
  vehicles: any,
  pageSize: any,
  employeeFilterCacheList:any,
  branchId: any,
  academicYearId: any,
  departmentId: any,
  search: any
};

export interface EmployeeListProps extends React.HTMLAttributes<HTMLElement> {
  [data: string]: any;
  employeeFilterCacheList?: any;
}

class DriverTable<T = {[data: string]: any}>  extends React.Component<any, DriverTableStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: this.props.user,
      employeeFilterCacheList: this.props.employeeFilterCacheList,
      branchId: null,
      academicYearId: null,
      departmentId: null,
      employees: {},
      employeeData: {
        vehicle: {
          id: ""
        },
        employee: {
          id: ""
        },
      
        mutateResult: [],
        search: ""
      },
      vehicles: [],
      pageSize: 5,
      search: ''

    };
    this.createDrivers = this.createDrivers.bind(this);
    this.createVehicles = this.createVehicles.bind(this);
   
    // this.searchHandlers = this.searchHandlers.bind(this);

    this.checkAllDrivers = this.checkAllDrivers.bind(this);
    this.onClickCheckbox = this.onClickCheckbox.bind(this);
    this.createDriverRows = this.createDriverRows.bind(this);
    this.createNoRecordMessage = this.createNoRecordMessage.bind(this);
  }

  async componentDidMount(){
    await this.registerSocket();
  }

  registerSocket() {
    const socket = wsCmsBackendServiceSingletonClient.getInstance();

    socket.onmessage = (response: any) => {
        let message = JSON.parse(response.data);
        console.log("Vehicle Index. message received from server ::: ", message);
        this.setState({
            branchId: message.selectedBranchId,
            academicYearId: message.selectedAcademicYearId,
            departmentId: message.selectedDepartmentId,
        });
        console.log("Vehicle Index. branchId: ",this.state.branchId);
        console.log("Vehicle Index. departmentId: ",this.state.departmentId);  
        console.log("Vehicle Index. ayId: ",this.state.academicYearId);  
    }

    socket.onopen = () => {
        console.log("Vehicle Index. Opening websocekt connection to cmsbackend. User : ",this.state.user.login);
        socket.send(this.state.user.login);
    }

    window.onbeforeunload = () => {
        console.log("Vehicle. Closing websocket connection with cms backend service");
    }
  }

  createDrivers(employees: any) {
    let employeesOptions = [<option key={0} value="">Select DriverId</option>];
    for (let i = 0; i < employees.length; i++) {
        employeesOptions.push(
          <option key={employees[i].id} value={employees[i].id}>{employees[i].id}</option>
        );
      }
    
    return employeesOptions;
  }

  createVehicles(vehicles: any) {
    let vehiclesOptions = [<option key={0} value="">Select VehicleId</option>];
    for (let i = 0; i < vehicles.length; i++) {
      // if (selectedEmployeeId == vehicles[i].employee.id) {
        vehiclesOptions.push(
          <option key={vehicles[i].id} value={vehicles[i].id}>{vehicles[i].id}</option>
        );
      }
    // }
    return vehiclesOptions;
  }

  checkAllDrivers(e: any) {
    const { employeeData } = this.state;
    const mutateResLength = employeeData.mutateResult.length;
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
    // const { target } = e;
    const { id } = e.nativeEvent.target;
    let chkBox: any = document.querySelector("#" + id);
    chkBox.checked = e.nativeEvent.target.checked;
  }
  createNoRecordMessage(objAry: any) {
    const mutateResLength = objAry.length;
    const retVal = [];
    for (let x = 0; x < mutateResLength; x++) {
      const tempObj = objAry[x];
      const employees = tempObj.data.getEmployeeList;
      const length = employees.length;
      if (length === 0) {
        retVal.push(
          <h4 className="ptl-06">No Record Found</h4>
        );
      }
    }
    return retVal;
  }


  createDriverRows(objAry: any) {
    let { search } = this.state.employeeData;
    search = search.trim();
    const mutateResLength = objAry.length;
    const retVal = [];
    for (let x = 0; x < mutateResLength; x++) {
      const tempObj = objAry[x];
      const employees = tempObj.data.getEmployeeList;
      const length = employees.length;
      for (let i = 0; i < length; i++) {
        const employee = employees[i];
        if(search){
          if(employee.employeeName.indexOf(search) !== -1){
            retVal.push(
              <tr key={employee.id}>
                <td>
                  <input onClick={(e: any) => this.onClickCheckbox(i, e)} checked={employee.isChecked} type="checkbox" name="" id={"chk" + employee.id} />
                </td>
                <td>
                    {employee.employeeName}
                </td>
                <td>{employee.primaryContactNo}</td>
                <td>{employee.disability}</td>
                <td>{employee.drivingLicenceNo}</td>
                <td>{employee.strdrivingLicenceValidity}</td>
                <td>{employee.vehicle.vehicleNumber}</td>
                <td>{employee.vehicle.vehicleType}</td>
              </tr>
            );
          }
        } else{
          retVal.push(
            <tr key={employee.id}>
            <td>
              <input onClick={(e: any) => this.onClickCheckbox(i, e)} checked={employee.isChecked} type="checkbox" name="" id={"chk" + employee.id} />
            </td>
            <td>
                {employee.employeeName}
            </td>
            <td>{employee.primaryContactNo}</td>
            <td>{employee.disability}</td>
            <td>{employee.drivingLicenceNo}</td>
            <td>{employee.strdrivingLicenceValidity}</td>
            <td>{employee.vehicle.vehicleNumber}</td>
            <td>{employee.vehicle.vehicleType}</td>
          </tr>
          );
        }
      }
    }

    return retVal;
  }

  onChange = (e: any) => {
    const { search } = e.nativeEvent.target;
    const { name, value } = e.nativeEvent.target;
    const { employeeData } = this.state;
    if (name === "vehicle") {
      this.setState({
        employeeData: {
          ...employeeData,
          vehicle: {
            id: value
          }
        }
      });
    } else if (name === "employee") {
      this.setState({
        employeeData: {
          ...employeeData,
          employee: {
            id: value
          }
        }
      });
    } else {
      this.setState({
        employeeData: {
          ...employeeData,
          [name]: value
        }
      });
    }
  }
 

  onClick = (e: any) => {
    const { name, value } = e.nativeEvent.target;
    const { getEmployeeList } = this.props;
    const { employeeData } = this.state;
    e.preventDefault();

    let driverFilterInputObject = {
      vehicleId: employeeData.vehicle.id,
      employeeId: employeeData.employee.id
    };
    this.props.client
      .mutate({
        mutation: EMPLOYEE_LIST,
        variables: {
          filter: driverFilterInputObject,
        },
      }).then((data:any) => {
      const edt = data;
      employeeData.mutateResult = [];
      employeeData.mutateResult.push(edt);
      this.setState({
        employeeData: employeeData
      });
      console.log('Driver filter mutation result ::::: ', employeeData.mutateResult);
    }).catch((error: any) => {
      console.log('there was an error sending the query result', error);
      return Promise.reject(`Could not retrieve Driver data: ${error}`);
    });

  }

  render() {
    const { employeeData, employeeFilterCacheList} = this.state;
    // { studentData.filter((this.state.search)).map() }
    return (
      <section className="customCss">
        <div className="container-fluid p-1 ">
          <div className="m-b-1 bg-heading-bgStudent studentListFlex">
            <div className="">
              <h4 className="ptl-06">Driver Details</h4>
            </div>
          </div>

          <div>
            <div className="student-flex">
            <div>
                <label htmlFor="">Employee Id</label>
                <select
                  required
                  name="employeeId"
                  id="employeeId"
                  onChange={this.onChange}
                  value={employeeData.employee.id}
                  className="gf-form-input max-width-22"
                >
                  {employeeFilterCacheList !== null &&
                  employeeFilterCacheList !== undefined &&
                  employeeFilterCacheList.employee !== null &&
                  employeeFilterCacheList.employee !== undefined
                    ? this.createDrivers(
                        employeeFilterCacheList.employee
                      )
                    : null}
                </select>
              </div>
              <div>
                <label htmlFor="">Vehicle Id</label>
                <select
                  required
                  name="vehicleId"
                  id="vehicleId"
                  onChange={this.onChange}
                  value={employeeData.vehicle.id}
                  className="gf-form-input max-width-22"
                >
                  {employeeFilterCacheList !== null &&
                  employeeFilterCacheList !== undefined &&
                  employeeFilterCacheList.vehicle !== null &&
                  employeeFilterCacheList.vehicle !== undefined
                    ? this.createVehicles(
                        employeeFilterCacheList.vehicle
                      )
                    : null}
                </select>
              </div>
              <div className="margin-bott max-width-22">
                <label htmlFor="">Driver Name</label>
                <input type="text" name="search" value={employeeData.search} onChange={this.onChange} />
              </div>
            <div className="m-b-1 bg-heading-bg studentSearch">
              {/* <h4 className="ptl-06"></h4> */}
              <button className="btn btn-primary max-width-13" id="btnFind" name="btnFind" onClick={this.onClick} style={w180}>Search Drivers</button>
            </div>
            </div>
            <table id="driverlistpage" className="striped-table fwidth bg-white">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" onClick={(e: any) => this.checkAllDrivers(e)} value="checkedall" name="" id="chkCheckedAll" />
                  </th>
                  <th>Driver Name</th>
                  <th>Contact No</th>
                  <th>Disability</th>
                  <th>DrivingLicence No</th>
                  <th>DrivingLicence Validity</th>
                  <th>Bus Assigned</th>
                  {/* <th>Route Assigned</th> */}
                  <th>Vehicle Type</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.createDriverRows(this.state.employeeData.mutateResult)
                }
              </tbody>
            </table>
            {/* <Pagination /> */}
            {
              this.createNoRecordMessage(this.state.employeeData.mutateResult)
            }
          </div>
        </div>
      </section>

    );
  }
}
export default withApollo(DriverTable);