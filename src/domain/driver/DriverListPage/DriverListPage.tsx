import * as React from 'react';
import * as _ from 'lodash';

import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { graphql, QueryProps, MutationFunc, compose } from 'react-apollo';

import * as DriverListQueryGql from './DriverListQuery.graphql';
import { LoadDriverFilterDataCacheType, DriverListQuery, DriverFragment } from '../../types';
import '../../../css/dark.css';
import withDriverFilterDataCacheLoader from "./withDriverFilterDataCacheLoader";


const w180 = {
  width: '180px'
};

type DriverRootProps = RouteComponentProps<{
}> & {
    data: QueryProps & LoadDriverFilterDataCacheType;
  }
type DriverPageProps = DriverRootProps & {
  mutate: MutationFunc<DriverListQuery>;
};

type DriverTableStates = {
  employees: any,
  employeeData: any,
  vehicles: any,
  pageSize: any,
  search: any
};

class DriverTable extends React.Component<DriverPageProps, DriverTableStates> {
  constructor(props: any) {
    super(props);
    this.state = {
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
    let vehicleOptions = [<option key={0} value="">Select RouteId</option>];
    for (let i = 0; i < vehicles.length; i++) {
      vehicleOptions.push(
        <option key={vehicles[i].id} value={vehicles[i].id}>{vehicles[i].id}</option>
      );
  }
    return vehicleOptions;
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
                <td>{employee.transportRoute.routeName}</td>
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
            <td>{employee.transportRoute.routeName}</td>
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
    const { mutate } = this.props;
    const { employeeData } = this.state;
    e.preventDefault();

    let driverFilterInputObject = {
      vehicleId: employeeData.vehicle.id,
      employeeId: employeeData.employee.id
    };


    return mutate({
      variables: { filter: driverFilterInputObject },
    }).then(data => {
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
    const { data: { createEmployeeDataCache, refetch }, mutate } = this.props;
    const { employeeData } = this.state;
    // { studentData.filter((this.state.search)).map() }
    return (
      <section className="customCss">
        <h3 className="bg-heading-bgStudent p-1 mb-1">
          <i className="fa fa-university stroke-transparent mr-1" aria-hidden="true" />{' '}
          Admin - Driver
        </h3>
        <div className="container-fluid p-1 ">
          <div className="m-b-1 bg-heading-bgStudent studentListFlex">
            <div className="">
              <h4 className="ptl-06">Driver Details</h4>
            </div>
          </div>

          <div>
            <div className="student-flex">
            <div>
                <label htmlFor="">Driver ID</label>
                <select required name="employee" id="employee" onChange={this.onChange} value={employeeData.employee.id} className="gf-form-input max-width-22">
                  {this.createDrivers(this.props.data.createEmployeeDataCache.employees)}
                </select>
              </div>
             
              <div>
                <label htmlFor="">Vehicle ID</label>
                <select name="vehicle" id="vehicle" onChange={this.onChange} value={employeeData.vehicle.id} className="gf-form-input max-width-22">
                  {this.createVehicles(this.props.data.createEmployeeDataCache.vehicles)}
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
                  <th>Route Assigned</th>
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
export default withDriverFilterDataCacheLoader(

  compose(
    graphql<DriverListQuery, DriverRootProps>(DriverListQueryGql, {
      name: "mutate"
    })

  )
    (DriverTable) as any
);