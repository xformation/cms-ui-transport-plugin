import * as React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import '../../../css/college-settings.css';
import AddRoute from './AddRoute';
import AddPage from './AddPage';
import {
    VEHICLE_DATA_CACHE,INSURANCE_DATA_CACHE
} from '../_queries';
import { withApollo } from 'react-apollo';
import wsCmsBackendServiceSingletonClient from '../../../wsCmsBackendServiceClient';
import AddInsurance from './AddInsurance';
import AddContract from './AddContract';
import VehicleListPage from './VehicleListPage';
// import DriverListPage from '../DriverListPage/DriverListPage';
export interface VehicleProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    user?: any,
}
class vehicle extends React.Component<VehicleProps, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            activeTab: 0,
            user: this.props.user,
            vehicleFilterCacheList: null,
            insuranceFilterCacheList:null,
            // employeeFilterCacheList: null,
            branchId: null,
            academicYearId: null,
            departmentId: null,
        };
        this.toggleTab = this.toggleTab.bind(this);
        this.registerSocket = this.registerSocket.bind(this);
        this.getVehicleFilterCacheList = this.getVehicleFilterCacheList.bind(this);
        this.getInsuranceFilterCacheList = this.getInsuranceFilterCacheList.bind(this);

        // this.getEmployeeFilterCacheList = this.getEmployeeFilterCacheList.bind(this);
 
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


    toggleTab(tabNo: any) {
        if(tabNo === 1 ){
            this.getVehicleFilterCacheList();
        }
        if(tabNo===2){
            this.getInsuranceFilterCacheList();
        }
        if(tabNo === 4 ){
            this.getVehicleFilterCacheList();
        }
        // if(tabNo === 5 ){
        //     this.getEmployeeFilterCacheList();
        // }
        this.setState({
            activeTab: tabNo,
        });
    }

    async getVehicleFilterCacheList() {
        // const {branchId, academicYearId} = this.state;
        const {data} = await this.props.client.query({
          query: VEHICLE_DATA_CACHE,
            variables: {
            //   branchId: branchId,
            //   academicYearId: academicYearId,
            },
          
          fetchPolicy: 'no-cache',
        });
        this.setState({
            vehicleFilterCacheList: data,
        });
      }
      async getInsuranceFilterCacheList() {
        // const {branchId, academicYearId} = this.state;
        const {data} = await this.props.client.query({
          query: INSURANCE_DATA_CACHE,
            variables: {
            //   branchId: branchId,
            //   academicYearId: academicYearId,
            },
          
          fetchPolicy: 'no-cache',
        });
        this.setState({
            insuranceFilterCacheList: data,
        });
      }

    //   async getEmployeeFilterCacheList() {
    //     // const {branchId, academicYearId} = this.state;
    //     const {data} = await this.props.client.query({
    //       query: EMPLOYEE_DATA_CACHE,
    //         variables: {
    //         //   branchId: branchId,
    //         //   academicYearId: academicYearId,
    //         },
          
    //       fetchPolicy: 'no-cache',
    //     });
    //     this.setState({
    //         employeeFilterCacheList: data,
    //     });
    //   }
    render() {
        const { activeTab,vehicleFilterCacheList,insuranceFilterCacheList,user } = this.state;
        return (
            <section className="tab-container row vertical-tab-container">
                 <Nav tabs className="pl-3 pl-3 mb-4 mt-4 col-sm-2">
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 0 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(0); }} >
                        Route Page
                        </NavLink>
                    </NavItem>
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 1 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(1); }} >
                        Vehicle Page
                        </NavLink> 
                    </NavItem>
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 2 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(2); }} >
                           Insurance Page
                        </NavLink>
                    </NavItem>
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 3 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(3); }} >
                           Contract Page 
                        </NavLink>
                   </NavItem>
                   <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 4? 'side-active' : ''}`} onClick={() => { this.toggleTab(4); }} >
                           Vehicle List Page 
                        </NavLink>
                   </NavItem>
                   {/* <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 5? 'side-active' : ''}`} onClick={() => { this.toggleTab(5); }} >
                           Driver List Page 
                        </NavLink>
                   </NavItem> */}
                </Nav>
                <TabContent activeTab={activeTab} className="col-sm-9 border-left p-t-1">
                   <TabPane tabId={0}>
                         <AddRoute/>
                    </TabPane>
                    <TabPane tabId={1}>
                    {
                            user !== null && vehicleFilterCacheList !== null?
                                <AddPage user={user} vehicleFilterCacheList={vehicleFilterCacheList.createVehicleDataCache}/>
                            :
                            null
                        }
                    </TabPane>
                    <TabPane tabId={2}>
                    {
                            user !== null && insuranceFilterCacheList !== null?
                                <AddInsurance user={user} insuranceFilterCacheList={insuranceFilterCacheList.createInsuranceDataCache}/>
                            :
                            null
                        }
                        
                    </TabPane>
                    <TabPane tabId={3}>
                        <AddContract/>
                    </TabPane>
                    <TabPane tabId={4}>
                    {
                            user !== null && vehicleFilterCacheList !== null?
                                <VehicleListPage user={user} vehicleFilterCacheList={vehicleFilterCacheList.createVehicleDataCache}/>
                            :
                            null
                        }
                    </TabPane>
                    {/* <TabPane tabId={5}>
                    {
                            user !== null && employeeFilterCacheList !== null?
                                <DriverListPage user={user} employeeFilterCacheList={employeeFilterCacheList.createEmployeeDataCache}/>
                            :
                            null
                        }
                    </TabPane> */}
                </TabContent> 
            </section>
        );
    }
}
export default withApollo(vehicle)