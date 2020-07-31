import * as React from 'react';
import * as _ from 'lodash';
import {withRouter, RouteComponentProps, Link} from 'react-router-dom';
import {withApollo} from 'react-apollo';
import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
// import StudentDetailsPage from './StudentDetailsPage';
import '../../../css/dark.css';
import withLoadingHandler from '../withLoadingHandler';
import {GET_VEHICLE_LIST, VEHICLE_DATA_CACHE} from '../_queries';
import wsCmsBackendServiceSingletonClient from '../../../wsCmsBackendServiceClient';
import {FaBluetooth} from 'react-icons/fa';
// import EditStudentPage from './EditStudentPage';

const w140 = {
  width: '140px',
  marginBottom: '5px',
};

type VehicleTableStates = {
  vehicles:any;
  transportRouteVehicleLink: any;
  vehicleData: any;
  transportRouteStopageLink: any;
  vehicleDriverLink: any;
  vehicle:any;
  pageSize: any;
  search: any;
  vehicleFilterCacheList: any;
  user: any;
  activeTab: any;
  vObj: any;
};

export interface VehicleListProps extends React.HTMLAttributes<HTMLElement> {
  [data: string]: any;
  user?: any;
  vehicleFilterCacheList?: any;
  // branchId?: any;
  // academicYearId?: any;
  // departmentId?: any;
}

class VehicleTable extends React.Component<VehicleListProps, VehicleTableStates> {
  constructor(props: any) {
    super(props);
    // const params = new URLSearchParams(location.search);
    this.state = {
      activeTab: 0,
      vObj: {},
      user: this.props.user,
      vehicleFilterCacheList: this.props.vehicleFilterCacheList,
      vehicles: {},
      vehicleData: {
        vehicle:{
          id:'',
        },
        transportRouteVehicleLink: {
          id: '',
        },
        transportRouteStopageLink: {
          id: '',
        },
        vehicleDriverLink: {
            id:'',
        },
        mutateResult: [],
        search: '',
      },
      vehicle: [],
      transportRouteStopageLink: [],
      transportRouteVehicleLink: [],
      vehicleDriverLink: [],
      pageSize: 5,
      search: '',
    };
    // this.createBranches = this.createBranches.bind(this);
    // this.createDepartments = this.createDepartments.bind(this);
    this.createTransportRouteVehicle = this.createTransportRouteVehicle.bind(this);
    this.createTransportRouteStopage = this.createTransportRouteStopage.bind(this);
    this.createVehicleDriver = this.createVehicleDriver.bind(this);
    this.showDetail = this.showDetail.bind(this);
    this.SetObject = this.SetObject.bind(this);
    this.getVehicleFilterCacheList = this.getVehicleFilterCacheList.bind(this);
    this.toggleTab = this.toggleTab.bind(this);
    this.createVehicles = this.createVehicles.bind(this);


    // this.searchHandlers = this.searchHandlers.bind(this);

    this.checkAllVehicles = this.checkAllVehicles.bind(this);
    this.onClickCheckbox = this.onClickCheckbox.bind(this);
    this.createVehicleRows = this.createVehicleRows.bind(this);
    this.createNoRecordMessage = this.createNoRecordMessage.bind(this);
    // this.exportStudents = this.exportStudents.bind(this);
    // this.convertArrayOfObjectsToCSV = this.convertArrayOfObjectsToCSV.bind(this);
    // this.download = this.download.bind(this);
    this.registerSocket = this.registerSocket.bind(this);
  }

  async toggleTab(tabNo: any) {
    await this.setState({
      activeTab: tabNo,
    });
    // if (tabNo === 0) {
    //   this.getcreateStudentFilterDataCache();
    // }
  }

  async componentDidMount() {
    await this.registerSocket();
    // console.log(
    //   '5. check create catch batches:',
    //   this.state.createStudentFilterDataCache.batches
    // );
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

async getVehicleFilterCacheList() {
    const {data} = await this.props.client.query({
      query: VEHICLE_DATA_CACHE,
        variables: {
        },
      
      fetchPolicy: 'no-cache',
    });
    this.setState({
        vehicleFilterCacheList: data,
    });
  }

  createTransportRouteVehicle(transportRouteVehicleLink: any) {
    let transportRouteVehicleLinkOptions = [
      <option key={0} value="">
        Select Vehicle
      </option>,
    ];
    for (let i = 0; i < transportRouteVehicleLink.length; i++) {
        transportRouteVehicleLinkOptions.push(
        <option key={transportRouteVehicleLink[i].id} value={transportRouteVehicleLink[i].id}>
          {transportRouteVehicleLink[i].id}
        </option>
      );
    }
    return transportRouteVehicleLinkOptions;
  }
  createVehicles(vehicle: any) {
    let vehiclesOptions = [
    <option key={0} value="">
      Select VehicleId
      </option>];
    for (let i = 0; i < vehicle.length; i++) {
      // let vehicle = vehicles[i]
      vehiclesOptions.push(
        <option key={vehicle[i].id} value={vehicle[i].id}>{vehicle[i].id}</option>
      );
    }
    return vehiclesOptions;
  }
  createVehicleDriver(vehicleDriverLink: any) {
    let vehicleDriverLinkOptions = [
      <option key={0} value="">
        Select driver
      </option>,
    ];
    for (let i = 0; i < vehicleDriverLink.length; i++) {
        vehicleDriverLinkOptions.push(
        <option key={vehicleDriverLink[i].id} value={vehicleDriverLink[i].id}>
          {vehicleDriverLink[i].id}
        </option>
      );
    }
    return vehicleDriverLinkOptions;
  }

  createTransportRouteStopage(transportRouteStopageLink: any) {
    let transportRouteStopageLinkOptions = [
      <option key={0} value="">
        Select Route
      </option>,
    ];
    for (let i = 0; i < transportRouteStopageLink.length; i++) {
        transportRouteStopageLinkOptions.push(
        <option key={transportRouteStopageLink[i].id} value={transportRouteStopageLink[i].id}>
          {transportRouteStopageLink[i].id}
        </option>
      );
    }
    return transportRouteStopageLinkOptions;
  }

  checkAllVehicles(e: any) {
    const {vehicleData} = this.state;
    const mutateResLength = vehicleData.mutateResult.length;
    let chkAll = e.nativeEvent.target.checked;
    let els = document.querySelectorAll('input[type=checkbox]');

    var empty = [].filter.call(els, function(el: any) {
      if (chkAll) {
        el.checked = true;
      } else {
        el.checked = false;
      }
    });
  }

  onClickCheckbox(index: any, e: any) {
    // const { target } = e;
    const {id} = e.nativeEvent.target;
    let chkBox: any = document.querySelector('#' + id);
    chkBox.checked = e.nativeEvent.target.checked;
  }
  createNoRecordMessage(objAry: any) {
    const mutateResLength = objAry.length;
    const retVal = [];
    for (let x = 0; x < mutateResLength; x++) {
      const tempObj = objAry[x];
      const vehicles = tempObj.data.getVehicleList;
      const length = vehicles.length;
      if (length === 0) {
        retVal.push(<h4 className="ptl-06">No Record Found</h4>);
      }
    }
    return retVal;
  }

  createVehicleRows(objAry: any) {
    let {search} = this.state.vehicleData;
    search = search.trim();
    const mutateResLength = objAry.length;
    const retVal = [];
    for (let x = 0; x < mutateResLength; x++) {
      const tempObj = objAry[x];
      const vehicles = tempObj.data.getVehicleList;
      const length = vehicles.length;
      for (let i = 0; i < length; i++) {
        const vehicle = vehicles[i];
        if (search) {
        //   if (vehicle.studentName.indexOf(search) !== -1) {
            retVal.push(
              <tr key={vehicle.id}>
                <td>
                  <input
                    onClick={(e: any) => this.onClickCheckbox(i, e)}
                    checked={vehicle.isChecked}
                    type="checkbox"
                    name="chk"
                    id={'chk' + vehicle.id}
                  />
                </td>
                <td>
                  {/* <Link
                    className="table-link link-color"
                    to={`/plugins/ems-student/page/student?id=${student.id}`}
                  >
                    {student.studentName}
                  </Link> */}
                  {/* <a onClick={(e: any) => this.showDetail(student, e)}> */}
                  {/* <a
                    onClick={() => {
                      // this.toggleTab(1);
                      (e: any) => this.showDetail(student, e);
                    }}
                  >
                    {student.studentName}
                  </a> */}
                  <a
                    onClick={(e: any) => this.showDetail(vehicle, e)}
                    style={{color: '#307dc2'}}
                  >
                    {vehicle.transportRouteVehicleLink.vehicle.vehicleNumber}
                  </a>
                </td>
                <td>{vehicle.transportRouteVehicleLink.vehicle.capacity}</td>
                <td>{vehicle.transportRouteVehicleLink.transportRoute.routeName}</td>
                <td>
                  {vehicle.transportRouteVehicleLink.transportRoute.noOfStops}
                  {/* {student.department.name} */}
                </td>
                <td>{vehicle.transportRouteVehicleLink.transportRoute.routeFrequency}</td>
                <td>{vehicle.transportRouteStopageLink.stopage.stopageName}</td>
                {/* <td>{student.sex}</td>
                <td>{student.studentType}</td>
                <td>{student.studentPrimaryCellNumber}</td> */}
                {/* <td>
                  <button
                    className="btn btn-primary"
                    onClick={(e: any) => this.getStDetail(student, e)}
                  >
                    {' '}
                    Edit{' '}
                  </button>
                </td> */}
              </tr>
            );
            console.log('print vehicle obj:', vehicle);
        //   }
        } else {
          retVal.push(
            <tr key={vehicle.id}>
              <td>
                <input
                  onClick={(e: any) => this.onClickCheckbox(i, e)}
                  checked={vehicle.isChecked}
                  type="checkbox"
                  name="chk"
                  id={'chk' + vehicle.id}
                />
              </td>
              <td>
                {/* <Link
                  className="table-link link-color"
                  to={`/plugins/ems-student/page/student?id=${student.id}`}
                >
                  {student.studentName}
                </Link> */}
                {/* <a onClick={(e: any) => this.showDetail(student, e)}> */}
                {/* <a
                  onClick={() => {
                    // this.toggleTab(1);
                    (e: any) => this.showDetail(student, e);
                  }}
                >
                  {student.studentName}
                </a> */}
                <a
                  onClick={(e: any) => this.showDetail(vehicle, e)}
                  style={{color: '#307dc2'}}
                >
                   {vehicle.transportRouteVehicleLink.vehicle.vehicleNumber}
                  </a>
                </td>
                <td>{vehicle.transportRouteVehicleLink.vehicle.capacity}</td>
                <td>{vehicle.transportRouteVehicleLink.transportRoute.routeName}</td>
                <td>
                  {vehicle.transportRouteVehicleLink.transportRoute.noOfStops}
                  {/* {student.department.name} */}
                </td>
                <td>{vehicle.transportRouteVehicleLink.transportRoute.routeFrequency}</td>
                <td>{vehicle.transportRouteStopageLink.stopage.stopageName}</td>
              {/* <td>{student.sex}</td>
              <td>{student.studentType}</td>
              <td>{student.studentPrimaryCellNumber}</td> */}
              {/* <td>
                <button
                  className="btn btn-primary"
                  onClick={(e: any) => this.getStDetail(student, e)}
                >
                  {' '}
                  Edit{' '}
                </button>
              </td> */}
            </tr>
          );
          console.log('print vehicle obj:', vehicle);
        }
      }
    }

    return retVal;
  }

//   exportStudents(objAry: any) {
//     const studentsToExport = [];
//     const mutateResLength = objAry.length;
//     let fileType: any = document.querySelector('#fileType');
//     if (fileType.value == '') {
//       alert('Please select a file type to export');
//       return;
//     }
//     for (let x = 0; x < mutateResLength; x++) {
//       const tempObj = objAry[x];
//       const students = tempObj.data.getStudentList;
//       const length = students.length;
//       for (let i = 0; i < length; i++) {
//         const student = students[i];
//         let chkBox: any = document.querySelector('#chk' + student.id);
//         if (chkBox.checked) {
//           studentsToExport.push(student);
//         }
//       }
//     }
//     if (studentsToExport.length > 0) {
//       var csvContent = this.convertArrayOfObjectsToCSV(studentsToExport);
//       this.download(csvContent, 'studentlist.csv', 'text/csv;encoding:utf-8');
//     } else {
//       alert('Please select records to export');
//     }
//   }

//   convertArrayOfObjectsToCSV(data: any) {
//     var result: any, ctr: any, keys: any, columnDelimiter: any, lineDelimiter: any;

//     data = data || null;
//     if (data == null || !data.length) {
//       return null;
//     }

//     columnDelimiter = ',';
//     lineDelimiter = '\n';

//     keys = Object.keys(data[0]);

//     result = '';
//     result += keys.join(columnDelimiter);
//     result += lineDelimiter;

//     data.forEach(function(item: any) {
//       ctr = 0;
//       keys.forEach(function(key: any) {
//         if (ctr > 0) result += columnDelimiter;

//         result += item[key];
//         ctr++;
//       });
//       result += lineDelimiter;
//     });

//     return result;
//   }

//   download(content: any, fileName: any, mimeType: any) {
//     var a = document.createElement('a');
//     mimeType = mimeType || 'application/octet-stream';

//     if (navigator.msSaveBlob) {
//       // IE10
//       navigator.msSaveBlob(
//         new Blob([content], {
//           type: mimeType,
//         }),
//         fileName
//       );
//     } else if (URL && 'download' in a) {
//       //html5 A[download]
//       a.href = URL.createObjectURL(
//         new Blob([content], {
//           type: mimeType,
//         })
//       );
//       a.setAttribute('download', fileName);
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//     } else {
//       location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
//     }
//   }

onChange = (e: any) => {
    const { search } = e.nativeEvent.target;
    const { name, value } = e.nativeEvent.target;
    const { vehicleData } = this.state;
    if (name === "vehicle") {
      this.setState({
        vehicleData: {
          ...vehicleData,
          vehicle: {
            id: value
          },
          transportRouteVehicleLink: {
            id: value
          },
          transportRouteStopageLink:{
            id:""
          },
          vehicleDriverLink:{
              id:""
          }
        }
      });
    }else if (name === "transportRouteVehicleLink") {
      this.setState({
        vehicleData: {
          ...vehicleData,
          transportRouteVehicleLink: {
            id: value
          },
          transportRouteStopageLink:{
            id:""
          },
          vehicleDriverLink:{
              id:""
          }
        }
      });
    } else if (name === "transportRouteStopageLink") {
      this.setState({
        vehicleData: {
          ...vehicleData,
          transportRouteStopageLink: {
            id: value
          },
          vehicleDriverLink: {
              id:""
          }
        }
      });
    }
    else if (name === "vehicleDriverLink") {
        this.setState({
          vehicleData: {
            ...vehicleData,
            vehicleDriverLink: {
                id: value
            }
          }
        });
      } 
    else {
      this.setState({
        vehicleData: {
          ...vehicleData,
          [name]: value
        }
      });
    }
  }

  async getStDetail(obj: any, e: any) {
    await this.SetObject(obj);
    console.log('3. data in vObj:', this.state.vObj);
    await this.toggleTab(2);
  }

  async showDetail(obj: any, e: any) {
    await this.SetObject(obj);
    console.log('3. data in vObj:', this.state.vObj);
    await this.toggleTab(1);
  }

  async SetObject(obj: any) {
    console.log('1. setting object :', obj);
    await this.setState({
      vObj: obj,
    });
    console.log('2. data in obj:', obj);
  }

  onClick = (e: any) => {
    const {name, value} = e.nativeEvent.target;
    const {mutate} = this.props;
    const {vehicleData} = this.state;
    e.preventDefault();
    // if (!branchId) {
    //   alert('Please select branch from preferences');
    //   return;
    // }
    let vehicleFilterInputObject = {
      vehicleId: vehicleData.vehicle.id,
      transportRouteStopageLinkId: vehicleData.transportRouteStopageLink.id, // studentData.section.id, //1251,
      transportRouteVehicleLinkId: vehicleData.transportRouteVehicleLink.id,
      vehicleDriverLinkId: vehicleData.vehicleDriverLink.id,
    };

    this.props.client
      .mutate({
        mutation: GET_VEHICLE_LIST,
        variables: {
          filter: vehicleFilterInputObject,
        },
      })
      .then((data: any) => {
        const sdt = data;
        vehicleData.mutateResult = [];
        vehicleData.mutateResult.push(sdt);
        this.setState({
          vehicleData: vehicleData,
        });
        console.log('Vehicle filter mutation result ::::: ', vehicleData.mutateResult);
      })
      .catch((error: any) => {
        console.log('there was an error sending the query result', error);
        return Promise.reject(`Could not retrieve vehicle data: ${error}`);
      });
  };

  render() {
    // const {
    //   data: {createStudentFilterDataCache, refetch},
    //   mutate,
    // } = this.props;
    const {
      vehicleData,
      vehicleFilterCacheList,
      activeTab,
      user,
    } = this.state;
    // { studentData.filter((this.state.search)).map() }
    return (
      <section className="customCss">
        <TabContent activeTab={activeTab}>
          <TabPane tabId={0}>
            <div className="container-fluid" style={{padding: '0px'}}>
              <div className="m-b-1 bg-heading-bgStudent studentListFlex p-point5">
                <div className="">
                  <h4 className="ptl-06">Vehicle Details</h4>
                </div>
                {/* <div className=""> */}
                  {/* <Link
                to={`/plugins/ems-student/page/addstudent`}
                className="btn btn-primary"
                style={w180}
              >
                Create New Student
              </Link> */}
                  {/* <a
                    className="btn btn-primary m-l-1"
                    onClick={(e: any) =>
                      this.exportStudents(this.state.studentData.mutateResult)
                    }
                  >
                    Export
                  </a> */}
                  {/* <select name="fileType" id="fileType" className="max-width-10 m-l-1">
                    <option value="">Select File Type</option>
                    <option value="CSV">CSV</option>
                  </select> */}
                {/* </div> */}
              </div>
             
              <div>
                <div className="student-flex">
                <div>
                    <label htmlFor="">Vehicle</label>
                    <select
                      required
                      name="vehicle"
                      id="vehicle"
                      onChange={this.onChange}
                      value={vehicleData.vehicle.id}
                      className="gf-form-input max-width-22"
                    >
                      {vehicleFilterCacheList !== null &&
                      vehicleFilterCacheList !== undefined &&
                      vehicleFilterCacheList.vehicle !== null &&
                      vehicleFilterCacheList.vehicle !== undefined
                        ? this.createVehicles(
                            vehicleFilterCacheList.vehicle
                          )
                        : null}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="">VehicleRoute</label>
                    <select
                      required
                      name="transportRouteVehicleLink"
                      id="transportRouteVehicleLink"
                      onChange={this.onChange}
                      value={vehicleData.transportRouteVehicleLink.id}
                      className="gf-form-input max-width-22"
                    >
                      {vehicleFilterCacheList !== null &&
                      vehicleFilterCacheList !== undefined &&
                      vehicleFilterCacheList.transportRouteVehicleLink !== null &&
                      vehicleFilterCacheList.transportRouteVehicleLink !== undefined
                        ? this.createTransportRouteVehicle(
                            vehicleFilterCacheList.transportRouteVehicleLink
                          )
                        : null}
                      {/* {this.createBatches(createStudentFilterDataCache.batches, departmentId)} */}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="">Route</label>
                    <select
                      required
                      name="transportRouteStopageLink"
                      id="transportRouteStopageLink"
                      onChange={this.onChange}
                      value={vehicleData.transportRouteStopageLink.id}
                      className="gf-form-input max-width-12"
                    >
                      {vehicleFilterCacheList !== null &&
                      vehicleFilterCacheList !== undefined &&
                      vehicleFilterCacheList.transportRouteStopageLink !== null &&
                      vehicleFilterCacheList.transportRouteStopageLink !== undefined
                        ? this.createTransportRouteStopage(
                            vehicleFilterCacheList.transportRouteStopageLink
                          )
                        : null}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="">Driver</label>
                    <select
                      required
                      name="vehicleDriverLink"
                      id="vehicleDriverLink"
                      onChange={this.onChange}
                      value={vehicleData.vehicleDriverLink.id}
                      className="gf-form-input max-width-12"
                    >
                      {vehicleFilterCacheList !== null &&
                      vehicleFilterCacheList !== undefined &&
                      vehicleFilterCacheList.vehicleDriverLink !== null &&
                      vehicleFilterCacheList.vehicleDriverLink !== undefined
                        ? this.createVehicleDriver(
                            vehicleFilterCacheList.vehicleDriverLink
                          )
                        : null}
                    </select>
                  </div>
                  {/* <div>
                    <label htmlFor="">Student Type</label>
                    <select
                      required
                      name="studentTypeObj"
                      id="studentTypeObj"
                      // onChange={this.onChange}
                      // value={studentData.studentType}
                      className="gf-form-input max-width-22"
                    >
                      <option value="">Select Student Type</option>
                      <option value="REGULAR">REGULAR</option>
                      <option value="STAFF_CONCESSION">STAFF_CONCESSION</option>
                      <option value="BENEFITS">BENEFITS</option>
                      <option value="SCHOLARSHIP">SCHOLARSHIP</option>
                      <option value="OTHER_BENEFITS">OTHER_BENEFITS</option>
                    </select>
                    {/* <select
                  required
                  name="studentType"
                  id="studentType"
                  onChange={this.onChange}
                  value={studentData.studentType.id}
                  className="gf-form-input max-width-22"
                >
                  {createStudentFilterDataCache !== null &&
                  createStudentFilterDataCache !== undefined &&
                  createStudentFilterDataCache.studentTypes !== null &&
                  createStudentFilterDataCache.studentTypes !== undefined
                    ? this.createStudentTypes(createStudentFilterDataCache.studentTypes)
                    : null}
                </select> */}
                  {/* </div> */}
                  {/* <div id="srch" className="margin-bott">
                    <label htmlFor="">Search</label>
                    <input
                      type="text"
                      className="gf-form-input"
                      name="search"
                      value={vehicleData.search}
                      onChange={this.onChange}
                    />
                  </div> */}
                  <div className="bg-heading-bg studentSearch">
                    {/* <h4 className="ptl-06"></h4> */}
                    <button
                      className="btn btn-primary"
                      id="btnFind"
                      name="btnFind"
                      onClick={this.onClick}
                      style={w140}
                    >
                      Search Students
                    </button>
                  </div>
                </div>

                <table id="vehiclelistpage" className="striped-table fwidth bg-white">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          onClick={(e: any) => this.checkAllVehicles(e)}
                          value="checkedall"
                          name=""
                          id="chkCheckedAll"
                        />
                      </th>
                      {/* <th>id</th> */}
                      <th>Vehicle Number</th>
                      <th>Capacity</th>
                      <th>Route Name</th>
                      <th>No Of Stops</th>
                      <th>Route Frequency</th>
                      <th>Stopage name</th>
                      {/* <th>Type</th>
                      <th>Primary Contact</th>
                      <th>Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {this.createVehicleRows(this.state.vehicleData.mutateResult)}
                  </tbody>
                </table>
                {/* <Pagination /> */}
                {this.createNoRecordMessage(this.state.vehicleData.mutateResult)}
              </div>
            </div>
          </TabPane>
          {/* <TabPane tabId={1}>
            <div className="container-fluid" style={{padding: '0px'}}>
              <div className="m-b-1 bg-heading-bgStudent studentListFlex p-point5">
                <div className="">
                  <h4 className="ptl-06">Student Details</h4>
                </div>
                <div className="">
                  <a
                    className="btn btn-primary m-l-1"
                    onClick={() => {
                      this.toggleTab(0);
                    }}
                  >
                    Back
                  </a> */}
                  {/* <a
                    className="btn btn-primary m-l-1"
                    onClick={(e: any) => {
                      print();
                    }}
                  >
                    Print
                  </a> */}
                {/* </div>
              </div> */}
              {/* {user !== null &&
                this.state.StdObj !== null &&
                this.state.StdObj !== undefined && (
                  <StudentDetailsPage user={user} data={this.state.StdObj} />
                )} */}
              {/* {this.state.vObj !== null && this.state.vObj !== undefined && (
                <StudentDetailsPage data={this.state.StdObj} />
              )}
            </div>
          </TabPane> */}
          {/* <TabPane tabId={2}>
            <div className="container-fluid" style={{padding: '0px'}}>
              <div className="m-b-1 bg-heading-bgStudent studentListFlex p-point5">
                <div className="">
                  <h4 className="ptl-06">Student Details</h4>
                </div>
                <div className="">
                  <a
                    className="btn btn-primary m-l-1"
                    onClick={() => {
                      this.toggleTab(0);
                    }}
                  >
                    Back
                  </a>
                </div>
              </div>
              {user !== null &&
                this.state.StdObj !== null &&
                this.state.StdObj !== undefined && (
                  <EditStudentPage
                    user={user}
                    data={this.state.StdObj}
                    StdObj={this.state.StdObj}
                    batches={this.state.createStudentFilterDataCache.batches}
                    sections={this.state.createStudentFilterDataCache.sections}
                  />
                )}
            </div>
          </TabPane> */}
        </TabContent>
      </section>
    );
  }
}

export default withApollo(VehicleTable);
