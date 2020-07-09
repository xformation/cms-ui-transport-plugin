import * as React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import '../../../css/college-settings.css';
// import AddRoute from './AddRoute';
import AddPage from './AddPage';
import {
    VEHICLE_DATA_CACHE,INSURANCE_DATA_CACHE, GET_CONTRACT_LIST, GET_VEHICLE_LIST,
} from '../_queries';
import { withApollo } from 'react-apollo';
import wsCmsBackendServiceSingletonClient from '../../../wsCmsBackendServiceClient';
import AddInsurance from './AddInsurance';
import AddContract from './AddContract';
import AddVehicleContractPage from './AddVehicleContractPage';
// import VehicleListPage from './VehicleListPage';
// import VehicleDetails from './VehicleDetails';
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
            contractList: null,
            vehicleList: null,
            vehicleFilterCacheList: null,
            insuranceFilterCacheList:null,
            branchId: null,
            academicYearId: null,
            departmentId: null,
        };
        this.toggleTab = this.toggleTab.bind(this);
        this.registerSocket = this.registerSocket.bind(this);
        this.getVehicleFilterCacheList = this.getVehicleFilterCacheList.bind(this);
        this.getContractList = this.getContractList.bind(this);
        this.getInsuranceFilterCacheList = this.getInsuranceFilterCacheList.bind(this);
        this.getVehicleList = this.getVehicleFilterCacheList.bind(this);
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
            this.getContractList();
        }
        if(tabNo === 3 ){
            this.getInsuranceFilterCacheList();
        }
        if(tabNo === 3 ){
            this.getVehicleFilterCacheList();
        }
        this.setState({
            activeTab: tabNo,
        });
    }

    async getContractList(){
        const {data} = await this.props.client.query({
            query: GET_CONTRACT_LIST,
            variables: {
            },
            fetchPolicy: 'no-cache',
          });
          this.setState({
            contractList: data,
          });
    }
    
    async getVehicleList(){
        const {data} = await this.props.client.query({
            query: GET_VEHICLE_LIST,
            variables: {
            },
            fetchPolicy: 'no-cache',
          });
          this.setState({
            vehicleList: data,
          });
    }
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
      async getInsuranceFilterCacheList() {
        const {data} = await this.props.client.query({
          query: INSURANCE_DATA_CACHE,
            variables: {
            },
          
          fetchPolicy: 'no-cache',
        });
        this.setState({
            insuranceFilterCacheList: data,
        });
      }
    render() {
        const { activeTab,vehicleFilterCacheList, contractList,vehicleList, insuranceFilterCacheList,user } = this.state;
        return (
            <section className="tab-container row vertical-tab-container">
                 <Nav tabs className="pl-3 pl-3 mb-4 mt-4 col-sm-2">
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 0 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(0); }} >
                           Add Vehicle Page
                        </NavLink>
                    </NavItem>
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 1 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(1); }} >
                          Add Contract Page
                        </NavLink> 
                    </NavItem>
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 2 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(2); }} >
                            Add Insurance Page
                        </NavLink>
                    </NavItem>
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 3 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(3); }} >
                           Vehicle Contract page
                        </NavLink>
                   </NavItem>
                   {/* <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 4? 'side-active' : ''}`} onClick={() => { this.toggleTab(4); }} >
                           Vehicle List Page 
                        </NavLink>
                   </NavItem> */}
                </Nav>
                <TabContent activeTab={activeTab} className="col-sm-9 border-left p-t-1">
                   <TabPane tabId={0}>
                   {
                            user !== null && vehicleFilterCacheList !== null?
                                <AddPage user={user} vehicleFilterCacheList={vehicleFilterCacheList.createVehicleDataCache}/>
                            :
                            null
                        } 
                    </TabPane>
                    <TabPane tabId={1}>
                    {
                            user !== null && contractList !== null && (
                                <AddContract user={user} contractList={contractList.getContractList}/>
                            )
                  
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
                    {
                            user !== null && vehicleFilterCacheList !== null?
                                <AddVehicleContractPage user={user} vehicleFilterCacheList={vehicleFilterCacheList.createVehicleDataCache}/>
                            :
                            null
                        }
                    </TabPane>
                    {/* <TabPane tabId={4}>
                    {
                            user !== null && vehicleFilterCacheList !== null?
                                <AddVehicleContractPage user={user} vehicleFilterCacheList={vehicleFilterCacheList.createVehicleDataCache}/>
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